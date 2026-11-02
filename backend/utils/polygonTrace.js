const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const TraceBlock = require("../models/TraceBlock");

const AMOY_CHAIN_ID = 80002n;
let polygonClientPromise;
let polygonReadClientPromise;
const artifactPath = path.join(
  __dirname,
  "..",
  "..",
  "blockchain",
  "artifacts",
  "contracts",
  "TraceabilityRegistry.sol",
  "TraceabilityRegistry.json",
);
const requiredContractFunctions = [
  "appendTraceEvent",
  "eventIdUsed",
  "getProduct",
  "getTraceCount",
  "getTraceEventById",
  "isProductRegistered",
  "registerProducts",
];

const canonicalValue = (value) => {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value && typeof value === "object") {
    if (value._bsontype === "ObjectId") return value.toString();
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => value[key] !== undefined)
        .sort()
        .map((key) => [key, canonicalValue(value[key])]),
    );
  }
  return value;
};

const canonicalize = (value) => JSON.stringify(canonicalValue(value));

const hashTraceEvent = ({
  productId,
  eventId,
  eventType,
  payload = {},
  actorId = null,
  actorRole = null,
  timestamp,
} = {}) => {
  const normalizedTimestamp = new Date(timestamp || Date.now()).toISOString();
  const canonicalEvent = canonicalize({
    productId: String(productId),
    eventId: String(eventId),
    eventType: String(eventType),
    payload,
    actorId: actorId ? String(actorId) : null,
    actorRole: actorRole || null,
    timestamp: normalizedTimestamp,
  });

  return ethers.keccak256(ethers.toUtf8Bytes(canonicalEvent));
};

const hashPayload = (payload = {}) =>
  ethers.keccak256(ethers.toUtf8Bytes(canonicalize(payload)));

const isPolygonConfigured = () => Boolean(
  process.env.POLYGON_RPC_URL &&
  process.env.POLYGON_PRIVATE_KEY &&
  process.env.POLYGON_TRACE_CONTRACT_ADDRESS,
);

const readArtifact = () => {
  if (!fs.existsSync(artifactPath)) {
    throw new Error("TraceabilityRegistry artifact missing. Compile the canonical contract in backend/ or blockchain/.");
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const functionNames = new Set(
    artifact.abi
      ?.filter((entry) => entry.type === "function")
      .map((entry) => entry.name),
  );
  const missingFunctions = requiredContractFunctions.filter((name) => !functionNames.has(name));
  if (artifact.contractName !== "TraceabilityRegistry" || missingFunctions.length) {
    throw new Error(`TraceabilityRegistry artifact is incompatible; missing functions: ${missingFunctions.join(", ") || "contract name"}`);
  }

  return artifact;
};

const createPolygonClient = async () => {
  if (!isPolygonConfigured()) throw new Error("Polygon configuration is missing");
  if (!ethers.isAddress(process.env.POLYGON_TRACE_CONTRACT_ADDRESS)) {
    throw new Error("POLYGON_TRACE_CONTRACT_ADDRESS is invalid");
  }

  if (!polygonClientPromise) {
    polygonClientPromise = (async () => {
      const artifact = readArtifact();
      const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
      const network = await provider.getNetwork();
      if (network.chainId !== AMOY_CHAIN_ID) {
        provider.destroy();
        throw new Error(`Polygon trace RPC must use Amoy chain ID ${AMOY_CHAIN_ID}`);
      }

      const wallet = new ethers.Wallet(process.env.POLYGON_PRIVATE_KEY, provider);
      const signer = new ethers.NonceManager(wallet);
      return {
        provider,
        signerAddress: wallet.address,
        contract: new ethers.Contract(process.env.POLYGON_TRACE_CONTRACT_ADDRESS, artifact.abi, signer),
      };
    })().catch((error) => {
      polygonClientPromise = null;
      throw error;
    });
  }

  return polygonClientPromise;
};

const isPolygonReadConfigured = () => Boolean(
  process.env.POLYGON_RPC_URL && process.env.POLYGON_TRACE_CONTRACT_ADDRESS,
);

const createPolygonReadClient = async () => {
  if (!isPolygonReadConfigured()) throw new Error("Polygon read configuration is missing");
  if (!ethers.isAddress(process.env.POLYGON_TRACE_CONTRACT_ADDRESS)) {
    throw new Error("POLYGON_TRACE_CONTRACT_ADDRESS is invalid");
  }

  if (!polygonReadClientPromise) {
    polygonReadClientPromise = (async () => {
      const artifact = readArtifact();
      const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
      const network = await provider.getNetwork();
      if (network.chainId !== AMOY_CHAIN_ID) {
        provider.destroy();
        throw new Error(`Polygon trace RPC must use Amoy chain ID ${AMOY_CHAIN_ID}`);
      }

      return {
        provider,
        contract: new ethers.Contract(process.env.POLYGON_TRACE_CONTRACT_ADDRESS, artifact.abi, provider),
      };
    })().catch((error) => {
      polygonReadClientPromise = null;
      throw error;
    });
  }

  return polygonReadClientPromise;
};

const getEventArg = (log, name, index) => log.args?.[name] ?? log.args?.[index];

const findEventLogs = async (contract, filter, blockNumber) => {
  const deploymentBlock = Number(process.env.POLYGON_TRACE_DEPLOYMENT_BLOCK || 0);
  if (blockNumber !== null && blockNumber !== undefined) {
    const exactBlockLogs = await contract.queryFilter(filter, Number(blockNumber), Number(blockNumber));
    if (exactBlockLogs.length) return exactBlockLogs;
  }
  return contract.queryFilter(filter, deploymentBlock, "latest");
};

const getLocalEventStatus = (record) => {
  if (["pending", "submitted"].includes(record.blockchainStatus)) return "pending";
  if (record.blockchainStatus === "failed") return "failed";
  return "failed";
};

const makeUnverifiedEvent = (record, status, reason) => ({
  eventId: String(record._id),
  eventType: record.eventType,
  timestamp: record.timestamp,
  batchId: record.batchId || null,
  status,
  verified: false,
  eventHash: null,
  transactionHash: null,
  blockNumber: null,
  polygonscanUrl: null,
  reason: reason || (status === "pending"
    ? "Awaiting Polygon Amoy confirmation"
    : status === "failed" ? "No matching event was confirmed on Polygon Amoy" : undefined),
});

const createOnChainVerifier = ({
  getReadClient = createPolygonReadClient,
  configured = isPolygonReadConfigured,
} = {}) => async (productId, traceRecords = []) => {
  const productIdValue = String(productId);
  const productRegistration = traceRecords.find((record) => record.eventType === "PRODUCT_REGISTERED");

  if (!configured()) {
    return {
      network: "Polygon Amoy",
      chainId: Number(AMOY_CHAIN_ID),
      status: "unavailable",
      registration: { status: "unavailable", batchId: productRegistration?.batchId || null },
      events: traceRecords.map((record) => makeUnverifiedEvent(record, "unavailable", "Polygon RPC is not configured")),
    };
  }

  try {
    const { contract } = await getReadClient();
    const registered = await contract.isProductRegistered(productIdValue);
    const events = [];

    for (const record of traceRecords) {
      if (!(await contract.eventIdUsed(String(record._id)))) {
        const status = getLocalEventStatus(record);
        events.push(makeUnverifiedEvent(record, status));
        continue;
      }

      const [storedProductId, storedEvent] = await contract.getTraceEventById(String(record._id));
      const expectedHash = hashTraceEvent({
        productId: productIdValue,
        eventId: String(record._id),
        eventType: record.eventType,
        payload: record.payload,
        actorId: record.actorId,
        actorRole: record.actorRole,
        timestamp: record.timestamp,
      });
      const matches =
        storedProductId === productIdValue &&
        storedEvent.eventType === record.eventType &&
        storedEvent.dataHash.toLowerCase() === expectedHash.toLowerCase() &&
        (!record.eventHash || record.eventHash.toLowerCase() === expectedHash.toLowerCase());

      if (!matches) {
        events.push(makeUnverifiedEvent(record, "failed", "Stored event data does not match the on-chain record"));
        continue;
      }

      let log;
      try {
        const logs = await findEventLogs(
          contract,
          contract.filters.TraceEventAppended(productIdValue, String(record._id)),
          record.blockNumber,
        );
        log = logs.find((candidate) =>
          getEventArg(candidate, "dataHash", 3)?.toLowerCase() === expectedHash.toLowerCase(),
        );
      } catch {
        log = null;
      }

      events.push({
        eventId: String(record._id),
        eventType: record.eventType,
        timestamp: record.timestamp,
        batchId: record.batchId || null,
        status: "confirmed",
        verified: true,
        eventHash: expectedHash,
        transactionHash: log?.transactionHash || null,
        blockNumber: log?.blockNumber ?? null,
        polygonscanUrl: log?.transactionHash
          ? `https://amoy.polygonscan.com/tx/${log.transactionHash}`
          : null,
      });
    }

    let registration;
    if (!registered) {
      registration = {
        status: productRegistration ? getLocalEventStatus(productRegistration) : "unregistered",
        onChainStatus: "unregistered",
        batchId: productRegistration?.batchId || null,
        metadataHash: null,
        transactionHash: null,
        blockNumber: null,
        polygonscanUrl: null,
      };
    } else if (!productRegistration) {
      registration = {
        status: "failed",
        onChainStatus: "registered",
        batchId: null,
        metadataHash: null,
        transactionHash: null,
        blockNumber: null,
        polygonscanUrl: null,
        reason: "No matching Mongo product registration record was found",
      };
    } else {
      const [metadataHash] = await contract.getProduct(productIdValue);
      const expectedMetadataHash = hashPayload(productRegistration.payload);
      const metadataMatches = metadataHash.toLowerCase() === expectedMetadataHash.toLowerCase();
      let registrationLog;
      if (metadataMatches) {
        try {
          const logs = await findEventLogs(
            contract,
            contract.filters.ProductRegistered(productIdValue),
            productRegistration.productRegistrationBlockNumber,
          );
          registrationLog = logs.find((candidate) =>
            getEventArg(candidate, "metadataHash", 1)?.toLowerCase() === expectedMetadataHash.toLowerCase(),
          );
        } catch {
          registrationLog = null;
        }
      }

      registration = {
        status: metadataMatches ? "confirmed" : "failed",
        verified: metadataMatches,
        onChainStatus: "registered",
        batchId: productRegistration.batchId || null,
        metadataHash: metadataMatches ? metadataHash : null,
        transactionHash: registrationLog?.transactionHash || null,
        blockNumber: registrationLog?.blockNumber ?? null,
        polygonscanUrl: registrationLog?.transactionHash
          ? `https://amoy.polygonscan.com/tx/${registrationLog.transactionHash}`
          : null,
        reason: metadataMatches ? undefined : "On-chain product metadata does not match the product registration record",
      };
    }

    let status = registration.status;
    if (registration.status === "confirmed") {
      if (events.some((event) => event.status === "failed")) status = "failed";
      else if (events.some((event) => event.status === "pending")) status = "pending";
      else if (events.some((event) => event.status === "unavailable")) status = "unavailable";
      else status = "confirmed";
    }

    return {
      network: "Polygon Amoy",
      chainId: Number(AMOY_CHAIN_ID),
      status,
      registration,
      events,
    };
  } catch (error) {
    return {
      network: "Polygon Amoy",
      chainId: Number(AMOY_CHAIN_ID),
      status: "unavailable",
      registration: {
        status: "unavailable",
        batchId: productRegistration?.batchId || null,
        reason: "Could not read the Polygon Amoy contract",
      },
      events: traceRecords.map((record) => makeUnverifiedEvent(record, "unavailable", error.message)),
    };
  }
};

const verifyOnChainTrace = createOnChainVerifier();

const recordResult = (record, reason) => ({
  recorded: record?.blockchainStatus === "confirmed",
  status: record?.blockchainStatus || "pending",
  batchId: record?.batchId || null,
  eventHash: record?.eventHash || null,
  payloadHash: record?.payload ? hashPayload(record.payload) : null,
  productId: record?.product ? String(record.product) : null,
  eventType: record?.eventType || null,
  actor: record?.actorId ? String(record.actorId) : null,
  txHash: record?.transactionHash || null,
  blockNumber: record?.blockNumber ?? null,
  reason: reason || record?.blockchainLastError || undefined,
});

const applyUpdate = async (model, id, update) =>
  model.findByIdAndUpdate(id, update, { new: true, runValidators: true });

const makeEventFilter = (contract, productId, eventId) =>
  contract.filters.TraceEventAppended(productId, eventId);

const findExistingEvent = async (contract, record, expectedHash) => {
  const eventId = String(record._id);
  if (!(await contract.eventIdUsed(eventId))) return null;

  const [storedProductId, storedEvent] = await contract.getTraceEventById(eventId);
  if (
    storedProductId !== String(record.product) ||
    storedEvent.eventType !== record.eventType ||
    storedEvent.dataHash.toLowerCase() !== expectedHash.toLowerCase()
  ) {
    throw new Error(`On-chain event ${eventId} does not match its Mongo trace record`);
  }

  const deploymentBlock = Number(process.env.POLYGON_TRACE_DEPLOYMENT_BLOCK || 0);
  const logs = await contract.queryFilter(
    makeEventFilter(contract, String(record.product), eventId),
    deploymentBlock,
  );
  const log = logs.at(-1);
  if (!log) throw new Error(`On-chain event ${eventId} exists but its transaction log is unavailable`);

  return {
    transactionHash: log.transactionHash,
    blockNumber: log.blockNumber,
  };
};

const createPolygonTraceService = ({
  model = TraceBlock,
  getClient = createPolygonClient,
  configured = isPolygonConfigured,
  retryBaseMs = 15000,
  lockMs = 120000,
  maxAttempts = 8,
  confirmations = 1,
  waitTimeoutMs = 90000,
} = {}) => {
  const updateById = (id, update) => applyUpdate(model, id, update);

  const processTraceRecord = async (inputRecord) => {
    if (!inputRecord?._id) throw new Error("A persisted trace record is required for chain submission");
    if (inputRecord.blockchainStatus === "confirmed") return recordResult(inputRecord);

    const productId = String(inputRecord.product);
    const eventId = String(inputRecord._id);
    const eventHash = hashTraceEvent({
      productId,
      eventId,
      eventType: inputRecord.eventType,
      payload: inputRecord.payload,
      actorId: inputRecord.actorId,
      actorRole: inputRecord.actorRole,
      timestamp: inputRecord.timestamp,
    });
    const batchId = inputRecord.batchId || hashPayload({
      productId,
      index: inputRecord.index,
      blockHash: inputRecord.hash,
    });

    if (!configured()) {
      const pending = await updateById(inputRecord._id, {
        $set: {
          eventHash,
          batchId,
          blockchainStatus: "pending",
          blockchainLastError: "Polygon configuration is missing",
          blockchainNextAttemptAt: null,
        },
      });
      return recordResult(pending, "Polygon configuration is missing");
    }

    const now = new Date();
    const lockId = crypto.randomUUID();
    const record = await model.findOneAndUpdate(
      {
        _id: inputRecord._id,
        $or: [
          { blockchainStatus: { $in: ["pending", "submitted"] } },
          { blockchainStatus: { $exists: false } },
        ],
        $and: [
          { $or: [{ blockchainNextAttemptAt: { $exists: false } }, { blockchainNextAttemptAt: null }, { blockchainNextAttemptAt: { $lte: now } }] },
          { $or: [{ blockchainLockUntil: { $exists: false } }, { blockchainLockUntil: null }, { blockchainLockUntil: { $lte: now } }] },
        ],
      },
      {
        $set: {
          eventHash,
          batchId,
          blockchainStatus: "pending",
          blockchainLockId: lockId,
          blockchainLockUntil: new Date(now.getTime() + lockMs),
        },
        $inc: { blockchainAttempts: 1 },
      },
      { new: true },
    );
    if (!record) return recordResult(await model.findById(inputRecord._id));

    try {
      const client = await getClient();
      const contract = client.contract;
      const alreadyRecorded = await findExistingEvent(contract, record, eventHash);
      if (alreadyRecorded) {
        const confirmed = await updateById(record._id, {
          $set: {
            eventHash,
            blockchainStatus: "confirmed",
            transactionHash: alreadyRecorded.transactionHash,
            blockNumber: alreadyRecorded.blockNumber,
            blockchainLastError: null,
            blockchainNextAttemptAt: null,
          },
          $unset: { blockchainLockId: 1, blockchainLockUntil: 1 },
        });
        return recordResult(confirmed);
      }

      if (!(await contract.isProductRegistered(productId))) {
        const productHash = record.eventType === "PRODUCT_REGISTERED"
          ? hashPayload(record.payload)
          : hashPayload({ productId });
        try {
          const registrationTx = await contract.registerProducts([productId], [productHash]);
          const registrationReceipt = await registrationTx.wait(confirmations, waitTimeoutMs);
          if (!registrationReceipt || registrationReceipt.status !== 1) {
            throw new Error("Product registration transaction was not confirmed successfully");
          }
          await updateById(record._id, {
            $set: {
              productRegistrationTransactionHash: registrationReceipt?.hash || registrationTx.hash,
              productRegistrationBlockNumber: registrationReceipt?.blockNumber,
            },
          });
        } catch (error) {
          if (!(await contract.isProductRegistered(productId))) throw error;
        }
      }

      const transaction = await contract.appendTraceEvent(
        productId,
        eventId,
        record.eventType,
        eventHash,
      );
      await updateById(record._id, {
        $set: { eventHash, transactionHash: transaction.hash, blockchainStatus: "submitted" },
      });

      const receipt = await transaction.wait(confirmations, waitTimeoutMs);
      if (!receipt || receipt.status !== 1) throw new Error("Trace transaction was not confirmed successfully");

      const confirmed = await updateById(record._id, {
        $set: {
          eventHash,
          transactionHash: receipt.hash || transaction.hash,
          blockNumber: receipt.blockNumber,
          blockchainStatus: "confirmed",
          blockchainLastError: null,
          blockchainNextAttemptAt: null,
        },
        $unset: { blockchainLockId: 1, blockchainLockUntil: 1 },
      });
      return recordResult(confirmed);
    } catch (error) {
      try {
        const client = await getClient();
        const reconciled = await findExistingEvent(client.contract, record, eventHash);
        if (reconciled) {
          const confirmed = await updateById(record._id, {
            $set: {
              eventHash,
              transactionHash: reconciled.transactionHash,
              blockNumber: reconciled.blockNumber,
              blockchainStatus: "confirmed",
              blockchainLastError: null,
              blockchainNextAttemptAt: null,
            },
            $unset: { blockchainLockId: 1, blockchainLockUntil: 1 },
          });
          return recordResult(confirmed);
        }
      } catch (reconcileError) {
        error = reconcileError;
      }

      const attempts = Number(record.blockchainAttempts || 1);
      const exhausted = attempts >= maxAttempts;
      const delayMs = Math.min(retryBaseMs * (2 ** Math.min(attempts - 1, 8)), 60 * 60 * 1000);
      const failed = await updateById(record._id, {
        $set: {
          eventHash,
          blockchainStatus: exhausted ? "failed" : "pending",
          blockchainLastError: error.message,
          blockchainNextAttemptAt: exhausted ? null : new Date(Date.now() + delayMs),
        },
        $unset: { blockchainLockId: 1, blockchainLockUntil: 1 },
      });
      return recordResult(failed, error.message);
    }
  };

  const retryPendingTraceEvents = async ({ limit = 20 } = {}) => {
    if (!configured()) return [];
    const now = new Date();
    const records = await model.find({
      $and: [
        { $or: [{ blockchainStatus: { $in: ["pending", "submitted"] } }, { blockchainStatus: { $exists: false } }] },
        { $or: [{ blockchainNextAttemptAt: { $exists: false } }, { blockchainNextAttemptAt: null }, { blockchainNextAttemptAt: { $lte: now } }] },
      ],
    }).sort({ timestamp: 1 }).limit(limit).lean();

    const results = [];
    for (const record of records) results.push(await processTraceRecord(record));
    return results;
  };

  return { processTraceRecord, retryPendingTraceEvents };
};

const service = createPolygonTraceService();

const recordTraceEvent = (record) => service.processTraceRecord(record);
const retryPendingTraceEvents = (options) => service.retryPendingTraceEvents(options);

const getTraceCount = async (productId) => {
  if (!isPolygonConfigured()) return 0;
  try {
    const { contract } = await createPolygonClient();
    return Number(await contract.getTraceCount(String(productId)));
  } catch (error) {
    console.warn("Polygon trace count lookup failed:", error.message);
    return 0;
  }
};

const startTraceRetryWorker = ({ intervalMs = 30000 } = {}) => {
  if (!isPolygonConfigured()) return null;
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      await retryPendingTraceEvents();
    } catch (error) {
      console.warn("Polygon trace retry cycle failed:", error.message);
    } finally {
      running = false;
    }
  };
  const timer = setInterval(run, intervalMs);
  timer.unref?.();
  run();
  return () => clearInterval(timer);
};

module.exports = {
  recordTraceEvent,
  retryPendingTraceEvents,
  startTraceRetryWorker,
  getTraceCount,
  hashPayload,
  hashTraceEvent,
  canonicalize,
  isPolygonConfigured,
  isPolygonReadConfigured,
  createPolygonTraceService,
  createOnChainVerifier,
  verifyOnChainTrace,
};
