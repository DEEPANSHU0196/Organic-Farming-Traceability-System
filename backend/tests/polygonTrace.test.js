const test = require("node:test");
const assert = require("node:assert/strict");
const {
  canonicalize,
  hashTraceEvent,
  hashPayload,
  createPolygonTraceService,
  createOnChainVerifier,
} = require("../utils/polygonTrace");

const makeRecord = () => ({
  _id: "trace-event-1",
  product: "product-1",
  index: 0,
  eventType: "PRODUCT_REGISTERED",
  payload: { details: { name: "Golden Harvest", category: "Wheat" } },
  actorId: "farmer-1",
  actorRole: "farmer",
  timestamp: new Date("2026-01-02T03:04:05.000Z"),
  blockchainStatus: "pending",
  blockchainAttempts: 0,
});

const makeModel = (record) => {
  const stored = new Map([[record._id, structuredClone(record)]]);
  const applyUpdate = (current, update) => {
    Object.assign(current, update.$set || {});
    for (const [key, amount] of Object.entries(update.$inc || {})) {
      current[key] = Number(current[key] || 0) + amount;
    }
    for (const key of Object.keys(update.$unset || {})) delete current[key];
    return structuredClone(current);
  };

  return {
    stored,
    async findOneAndUpdate(filter, update) {
      const current = stored.get(String(filter._id));
      if (!current || !["pending", "failed"].includes(current.blockchainStatus)) return null;
      if (current.blockchainLockUntil && current.blockchainLockUntil > new Date()) return null;
      return applyUpdate(current, update);
    },
    async findByIdAndUpdate(id, update) {
      const current = stored.get(String(id));
      return current ? applyUpdate(current, update) : null;
    },
    async findById(id) {
      const current = stored.get(String(id));
      return current ? structuredClone(current) : null;
    },
  };
};

const makeClient = ({ ambiguousReceipt = false, failBeforeBroadcast = false } = {}) => {
  const events = new Map();
  const logs = [];
  const registeredProducts = new Set();
  const registrationCalls = [];
  let appendCount = 0;
  const contract = {
    filters: {
      TraceEventAppended: (productId, eventId) => ({ productId, eventId }),
    },
    async eventIdUsed(eventId) {
      return events.has(eventId);
    },
    async getTraceEventById(eventId) {
      const event = events.get(eventId);
      return [event.productId, event];
    },
    async queryFilter(filter) {
      return logs.filter((log) =>
        log.productId === filter.productId && log.eventId === filter.eventId,
      );
    },
    async isProductRegistered(productId) {
      return registeredProducts.has(productId);
    },
    async registerProducts(productIds, metadataHashes) {
      registrationCalls.push({ productIds, metadataHashes });
      productIds.forEach((productId) => registeredProducts.add(productId));
      return {
        hash: "0xregistration",
        async wait() {
          return { hash: "0xregistration", blockNumber: 10, status: 1 };
        },
      };
    },
    async appendTraceEvent(productId, eventId, eventType, dataHash) {
      if (failBeforeBroadcast) throw new Error("RPC is temporarily unavailable");
      appendCount += 1;
      events.set(eventId, { productId, eventId, eventType, dataHash });
      logs.push({ productId, eventId, transactionHash: "0xtrace", blockNumber: 11 });
      return {
        hash: "0xtrace",
        async wait() {
          if (ambiguousReceipt) throw new Error("RPC receipt timeout");
          return { hash: "0xtrace", blockNumber: 11, status: 1 };
        },
      };
    },
  };

  return {
    contract,
    registrationCalls,
    get appendCount() { return appendCount; },
  };
};

test("canonical JSON and trace hashes ignore nested object key order", () => {
  assert.equal(
    canonicalize({ z: 1, nested: { b: 2, a: 1 }, a: [3, { d: 4, c: 5 }] }),
    canonicalize({ a: [3, { c: 5, d: 4 }], nested: { a: 1, b: 2 }, z: 1 }),
  );

  const first = hashTraceEvent({
    productId: "p1",
    eventId: "e1",
    eventType: "UPDATED",
    payload: { nested: { b: 2, a: 1 } },
    timestamp: "2026-01-02T03:04:05.000Z",
  });
  const reordered = hashTraceEvent({
    productId: "p1",
    eventId: "e1",
    eventType: "UPDATED",
    payload: { nested: { a: 1, b: 2 } },
    timestamp: "2026-01-02T03:04:05.000Z",
  });
  assert.equal(first, reordered);
  assert.match(first, /^0x[0-9a-f]{64}$/);
});

test("reconciles an ambiguous broadcast and never appends the stable event ID twice", async () => {
  const record = makeRecord();
  const model = makeModel(record);
  const client = makeClient({ ambiguousReceipt: true });
  const service = createPolygonTraceService({
    model,
    configured: () => true,
    getClient: async () => client,
  });

  const outcome = await service.processTraceRecord(record);
  assert.equal(outcome.recorded, true);
  assert.equal(outcome.status, "confirmed");
  assert.equal(outcome.txHash, "0xtrace");
  assert.equal(outcome.blockNumber, 11);
  assert.equal(client.appendCount, 1);
  assert.deepEqual(client.registrationCalls[0].metadataHashes, [hashPayload(record.payload)]);

  const retry = await service.processTraceRecord(model.stored.get(record._id));
  assert.equal(retry.status, "confirmed");
  assert.equal(client.appendCount, 1);
});

test("concurrent processing claims a pending Mongo trace only once", async () => {
  const record = makeRecord();
  const model = makeModel(record);
  const client = makeClient();
  const service = createPolygonTraceService({
    model,
    configured: () => true,
    getClient: async () => client,
  });

  await Promise.all([
    service.processTraceRecord(record),
    service.processTraceRecord(record),
  ]);

  assert.equal(client.appendCount, 1);
  assert.equal(model.stored.get(record._id).blockchainStatus, "confirmed");
});

test("keeps an event pending when backend signing is not configured", async () => {
  const record = makeRecord();
  const model = makeModel(record);
  const service = createPolygonTraceService({
    model,
    configured: () => false,
    getClient: async () => assert.fail("RPC client must not be created without credentials"),
  });

  const outcome = await service.processTraceRecord(record);
  assert.equal(outcome.recorded, false);
  assert.equal(outcome.status, "pending");
  assert.match(outcome.reason, /configuration is missing/);
});

test("retains a pending Mongo outbox record and schedules a retry after RPC failure", async () => {
  const record = makeRecord();
  const model = makeModel(record);
  const client = makeClient({ failBeforeBroadcast: true });
  const service = createPolygonTraceService({
    model,
    configured: () => true,
    getClient: async () => client,
    retryBaseMs: 1000,
  });

  const outcome = await service.processTraceRecord(record);
  const persisted = model.stored.get(record._id);
  assert.equal(outcome.recorded, false);
  assert.equal(outcome.status, "pending");
  assert.match(outcome.reason, /temporarily unavailable/);
  assert.ok(persisted.eventHash);
  assert.ok(persisted.batchId);
  assert.equal(persisted.blockchainStatus, "pending");
  assert.ok(persisted.blockchainNextAttemptAt > new Date());
});

test("confirms product registration and event details only when contract state and logs match", async () => {
  const record = makeRecord();
  record.eventHash = hashTraceEvent({
    productId: record.product,
    eventId: record._id,
    eventType: record.eventType,
    payload: record.payload,
    actorId: record.actorId,
    actorRole: record.actorRole,
    timestamp: record.timestamp,
  });
  record.batchId = "batch-product-1";
  record.productRegistrationTransactionHash = "0xregistration";
  record.productRegistrationBlockNumber = 10;
  const metadataHash = hashPayload(record.payload);
  const storedEvent = {
    eventId: record._id,
    eventType: record.eventType,
    dataHash: record.eventHash,
  };
  const contract = {
    filters: {
      ProductRegistered: (productId) => ({ kind: "registration", productId }),
      TraceEventAppended: (productId, eventId) => ({ kind: "trace", productId, eventId }),
    },
    async isProductRegistered() { return true; },
    async eventIdUsed() { return true; },
    async getTraceEventById() { return [record.product, storedEvent]; },
    async getProduct() { return [metadataHash, "0x0000000000000000000000000000000000000001", 100n]; },
    async queryFilter(filter) {
      if (filter.kind === "registration") {
        return [{
          transactionHash: "0xregistration",
          blockNumber: 10,
          args: { metadataHash },
        }];
      }
      return [{
        transactionHash: "0xtrace",
        blockNumber: 11,
        args: { dataHash: record.eventHash },
      }];
    },
  };
  const verify = createOnChainVerifier({
    configured: () => true,
    getReadClient: async () => ({ contract }),
  });

  const result = await verify(record.product, [record]);
  assert.equal(result.status, "confirmed");
  assert.equal(result.registration.status, "confirmed");
  assert.equal(result.registration.verified, true);
  assert.equal(result.registration.batchId, record.batchId);
  assert.equal(result.registration.transactionHash, "0xregistration");
  assert.equal(result.registration.blockNumber, 10);
  assert.equal(result.events[0].verified, true);
  assert.equal(result.events[0].eventHash, record.eventHash);
  assert.equal(result.events[0].transactionHash, "0xtrace");
  assert.equal(result.events[0].blockNumber, 11);
  assert.equal(result.events[0].polygonscanUrl, "https://amoy.polygonscan.com/tx/0xtrace");
});

test("never labels mismatched contract data as a verified event", async () => {
  const record = makeRecord();
  const contract = {
    filters: { TraceEventAppended: () => ({}) },
    async isProductRegistered() { return true; },
    async eventIdUsed() { return true; },
    async getTraceEventById() {
      return [record.product, { eventType: record.eventType, dataHash: `0x${"0".repeat(64)}` }];
    },
    async getProduct() { return [hashPayload(record.payload)]; },
    async queryFilter() { return []; },
  };
  const verify = createOnChainVerifier({
    configured: () => true,
    getReadClient: async () => ({ contract }),
  });

  const result = await verify(record.product, [record]);
  assert.equal(result.events[0].status, "failed");
  assert.equal(result.events[0].verified, false);
  assert.equal(result.events[0].eventHash, null);
  assert.equal(result.events[0].transactionHash, null);
});

test("distinguishes unregistered pending batches from unavailable Polygon reads", async () => {
  const record = makeRecord();
  const unregisteredContract = {
    async isProductRegistered() { return false; },
    async eventIdUsed() { return false; },
  };
  const verifyUnregistered = createOnChainVerifier({
    configured: () => true,
    getReadClient: async () => ({ contract: unregisteredContract }),
  });
  const pending = await verifyUnregistered(record.product, [record]);
  assert.equal(pending.status, "pending");
  assert.equal(pending.registration.status, "pending");
  assert.equal(pending.registration.onChainStatus, "unregistered");
  assert.equal(pending.events[0].status, "pending");
  assert.equal(pending.events[0].eventHash, null);

  const verifyUnavailable = createOnChainVerifier({
    configured: () => false,
    getReadClient: async () => assert.fail("No read client should be created"),
  });
  const unavailable = await verifyUnavailable(record.product, [record]);
  assert.equal(unavailable.status, "unavailable");
  assert.equal(unavailable.registration.status, "unavailable");
  assert.equal(unavailable.events[0].status, "unavailable");
  assert.equal(unavailable.events[0].eventHash, null);
});