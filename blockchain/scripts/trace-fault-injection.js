const assert = require("node:assert/strict");
const { ethers } = require("hardhat");
const {
  createPolygonTraceService,
  hashPayload,
  hashTraceEvent,
} = require("../../backend/utils/polygonTrace");

const parseRuns = () => {
  const runsArg = process.argv.find((argument) => argument.startsWith("--runs="));
  const runs = Number(
    process.env.TRACE_FAULT_RUNS ||
    (runsArg ? runsArg.slice("--runs=".length) : 1),
  );
  if (!Number.isInteger(runs) || runs < 1 || runs > 100) {
    throw new Error("--runs must be an integer from 1 to 100");
  }
  return runs;
};

const clone = (value) => structuredClone(value);

const makeRecord = (suffix) => ({
  _id: `fault-event-${suffix}`,
  product: `fault-product-${suffix}`,
  index: 0,
  eventType: "SHIPMENT_STATUS_UPDATED",
  payload: { status: "In Transit", location: "Local Hardhat experiment" },
  actorId: "fault-injection-runner",
  actorRole: "transporter",
  timestamp: new Date("2026-01-02T03:04:05.000Z"),
  blockchainStatus: "pending",
  blockchainAttempts: 0,
});

const makeModel = (record, { beforeUpdate = async () => {} } = {}) => {
  const stored = new Map([[record._id, clone(record)]]);
  const applyUpdate = (current, update) => {
    Object.assign(current, clone(update.$set || {}));
    for (const [key, amount] of Object.entries(update.$inc || {})) {
      current[key] = Number(current[key] || 0) + amount;
    }
    for (const key of Object.keys(update.$unset || {})) delete current[key];
    return clone(current);
  };

  return {
    stored,
    async findOneAndUpdate(filter, update) {
      const current = stored.get(String(filter._id));
      const status = current?.blockchainStatus;
      if (!current || !["pending", "submitted"].includes(status)) return null;
      if (current.blockchainNextAttemptAt > new Date()) return null;
      if (current.blockchainLockUntil > new Date()) return null;
      return applyUpdate(current, update);
    },
    async findByIdAndUpdate(id, update) {
      const current = stored.get(String(id));
      if (!current) return null;
      await beforeUpdate(current, update);
      return applyUpdate(current, update);
    },
    async findById(id) {
      const current = stored.get(String(id));
      return current ? clone(current) : null;
    },
  };
};

const makeLocalClient = (registry, behavior = {}) => {
  let appendCalls = 0;
  const contract = {
    filters: {
      TraceEventAppended: (...args) => registry.filters.TraceEventAppended(...args),
    },
    queryFilter: (...args) => registry.queryFilter(...args),
    eventIdUsed: (...args) => registry.eventIdUsed(...args),
    getTraceEventById: (...args) => registry.getTraceEventById(...args),
    isProductRegistered: (...args) => registry.isProductRegistered(...args),
    registerProducts: (...args) => registry.registerProducts(...args),
    async appendTraceEvent(...args) {
      appendCalls += 1;
      if (behavior.failBeforeBroadcast) {
        throw new Error("Injected transaction submission failure");
      }

      const transaction = await registry.appendTraceEvent(...args);
      if (behavior.failAfterBroadcast) {
        return {
          hash: transaction.hash,
          async wait() {
            await transaction.wait();
            throw new Error("Injected receipt timeout after broadcast");
          },
        };
      }
      return transaction;
    },
  };

  return {
    contract,
    get appendCalls() {
      return appendCalls;
    },
  };
};

const deployRegistry = async () => {
  const factory = await ethers.getContractFactory("TraceabilityRegistry");
  const registry = await factory.deploy();
  await registry.waitForDeployment();
  return registry;
};

const insertOnChainEvent = async (registry, record) => {
  const eventHash = hashTraceEvent({
    productId: record.product,
    eventId: record._id,
    eventType: record.eventType,
    payload: record.payload,
    actorId: record.actorId,
    actorRole: record.actorRole,
    timestamp: record.timestamp,
  });
  await registry.registerProducts([record.product], [hashPayload({ productId: record.product })]);
  await registry.appendTraceEvent(
    record.product,
    record._id,
    record.eventType,
    eventHash,
  );
};

const getChainCount = async (registry, productId) =>
  Number(await registry.getTraceCount(productId));

const makeService = ({ model, client, getClient, options = {} }) =>
  createPolygonTraceService({
    model,
    configured: () => true,
    getClient: getClient || (async () => ({ contract: client.contract })),
    retryBaseMs: 1,
    lockMs: 1,
    maxAttempts: 2,
    waitTimeoutMs: 1000,
    ...options,
  });

const runScenario = async (name, execute, runs) => {
  const results = [];
  for (let run = 1; run <= runs; run += 1) {
    results.push(await execute(run));
  }

  return {
    scenario: name,
    runs,
    results,
  };
};

const main = async () => {
  const runs = parseRuns();
  const reports = [];

  reports.push(await runScenario("rpc-unavailable-before-submission", async (run) => {
    const record = makeRecord(`rpc-${run}`);
    const registry = await deployRegistry();
    const model = makeModel(record);
    const service = makeService({
      model,
      getClient: async () => {
        throw new Error("Injected RPC unavailable");
      },
    });

    const startedAt = Date.now();
    const outcome = await service.processTraceRecord(record);
    const stored = model.stored.get(record._id);
    const onChainCount = await getChainCount(registry, record.product);
    assert.equal(outcome.status, "pending");
    assert.equal(stored.blockchainStatus, "pending");
    assert.equal(onChainCount, 0);

    return {
      elapsedMs: Date.now() - startedAt,
      finalStatus: stored.blockchainStatus,
      attempts: stored.blockchainAttempts,
      onChainEvents: onChainCount,
      eventStillUnconfirmed: onChainCount === 0,
    };
  }, runs));

  reports.push(await runScenario("trace-transaction-submission-rejected", async (run) => {
    const record = makeRecord(`rejected-${run}`);
    const registry = await deployRegistry();
    const model = makeModel(record);
    const client = makeLocalClient(registry, { failBeforeBroadcast: true });
    const service = makeService({ model, client });

    const startedAt = Date.now();
    const outcome = await service.processTraceRecord(record);
    const stored = model.stored.get(record._id);
    const onChainCount = await getChainCount(registry, record.product);
    assert.equal(outcome.status, "pending");
    assert.equal(stored.blockchainStatus, "pending");
    assert.equal(onChainCount, 0);
    assert.equal(client.appendCalls, 1);

    return {
      elapsedMs: Date.now() - startedAt,
      finalStatus: stored.blockchainStatus,
      attempts: stored.blockchainAttempts,
      appendCalls: client.appendCalls,
      productRegisteredOnChain: await registry.isProductRegistered(record.product),
      onChainEvents: onChainCount,
      eventStillUnconfirmed: onChainCount === 0,
    };
  }, runs));

  reports.push(await runScenario("receipt-timeout-after-broadcast", async (run) => {
    const record = makeRecord(`receipt-${run}`);
    const registry = await deployRegistry();
    const model = makeModel(record);
    const client = makeLocalClient(registry, { failAfterBroadcast: true });
    const service = makeService({ model, client });

    const startedAt = Date.now();
    const outcome = await service.processTraceRecord(record);
    const stored = model.stored.get(record._id);
    const onChainCount = await getChainCount(registry, record.product);
    assert.equal(outcome.status, "confirmed");
    assert.equal(stored.blockchainStatus, "confirmed");
    assert.equal(onChainCount, 1);
    assert.equal(client.appendCalls, 1);

    return {
      elapsedMs: Date.now() - startedAt,
      finalStatus: stored.blockchainStatus,
      attempts: stored.blockchainAttempts,
      appendCalls: client.appendCalls,
      onChainEvents: onChainCount,
      duplicateEvents: Math.max(onChainCount - 1, 0),
      reconciledAfterInjectedTimeout: true,
    };
  }, runs));

  reports.push(await runScenario("stale-pending-record-after-restart", async (run) => {
    const record = makeRecord(`restart-${run}`);
    const registry = await deployRegistry();
    await insertOnChainEvent(registry, record);
    const model = makeModel(record);
    const client = makeLocalClient(registry);
    const service = makeService({ model, client });

    const startedAt = Date.now();
    const outcome = await service.processTraceRecord(record);
    const stored = model.stored.get(record._id);
    const onChainCount = await getChainCount(registry, record.product);
    assert.equal(outcome.status, "confirmed");
    assert.equal(stored.blockchainStatus, "confirmed");
    assert.equal(onChainCount, 1);
    assert.equal(client.appendCalls, 0);

    return {
      elapsedMs: Date.now() - startedAt,
      finalStatus: stored.blockchainStatus,
      appendCalls: client.appendCalls,
      onChainEvents: onChainCount,
      duplicateEvents: Math.max(onChainCount - 1, 0),
      recoveredExistingChainEvent: true,
      note: "Models restart by retrying a persisted pending record; does not kill a process.",
    };
  }, runs));

  reports.push(await runScenario("mongo-write-outage-after-chain-write", async (run) => {
    const record = makeRecord(`mongo-${run}`);
    const registry = await deployRegistry();
    const client = makeLocalClient(registry);
    let failWritesAfterBroadcast = true;
    const model = makeModel(record, {
      beforeUpdate: async () => {
        if (failWritesAfterBroadcast && await registry.eventIdUsed(record._id)) {
          throw new Error("Injected MongoDB update failure");
        }
      },
    });
    const service = makeService({ model, client });

    const startedAt = Date.now();
    let firstCallError = null;
    try {
      await service.processTraceRecord(record);
    } catch (error) {
      firstCallError = error.message;
    }

    const firstStored = model.stored.get(record._id);
    const statusDuringOutage = firstStored.blockchainStatus;
    const attemptsDuringOutage = firstStored.blockchainAttempts;
    const firstChainCount = await getChainCount(registry, record.product);
    assert.match(firstCallError || "", /Injected MongoDB update failure/);
    assert.equal(firstChainCount, 1);
    assert.equal(statusDuringOutage, "pending");

    failWritesAfterBroadcast = false;
    await new Promise((resolve) => setTimeout(resolve, 5));
    const recovery = await service.processTraceRecord(firstStored);
    const recovered = model.stored.get(record._id);
    const recoveredChainCount = await getChainCount(registry, record.product);
    assert.equal(recovery.status, "confirmed");
    assert.equal(recovered.blockchainStatus, "confirmed");
    assert.equal(recoveredChainCount, 1);
    assert.equal(client.appendCalls, 1);

    return {
      elapsedMs: Date.now() - startedAt,
      firstCallError,
      statusDuringOutage,
      statusAfterRecovery: recovered.blockchainStatus,
      attemptsDuringOutage,
      attemptsAfterRecovery: recovered.blockchainAttempts,
      appendCalls: client.appendCalls,
      onChainEvents: recoveredChainCount,
      duplicateEvents: Math.max(recoveredChainCount - 1, 0),
      recoveredAfterLockExpiry: true,
    };
  }, runs));

  console.log(JSON.stringify({
    environment: "in-process Hardhat local EVM; in-memory model; no external RPC or MongoDB",
    runsPerScenario: runs,
    reports,
  }, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
