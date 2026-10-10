const test = require("node:test");
const assert = require("node:assert/strict");
const Product = require("../models/Product");
const Shipment = require("../models/Shipment");
const Order = require("../models/Order");
const Notification = require("../models/Notification");
const traceBlockchain = require("../utils/traceBlockchain");

const recordedEvents = [];
const originalAppendTraceBlock = traceBlockchain.appendTraceBlock;
const appendSequence = [];
traceBlockchain.appendTraceBlock = async (event) => {
  recordedEvents.push(event);
  appendSequence.push("trace");
  return { onChain: { recorded: false, status: "pending" } };
};

const { addProduct } = require("../controllers/productController");
const {
  createShipment,
  acceptShipmentRequest,
  updateShipment,
  assignDriver,
} = require("../controllers/shipmentController");

test.after(() => {
  traceBlockchain.appendTraceBlock = originalAppendTraceBlock;
});

const replaceMethod = (context, target, methodName, replacement) => {
  const original = target[methodName];
  target[methodName] = replacement;
  context.after(() => {
    target[methodName] = original;
  });
};

const makeResponse = () => ({
  statusCode: null,
  body: null,
  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

const makeQuery = (document) => ({
  populate: async () => document,
});

const makeProduct = (id = "product-1") => ({
  _id: id,
  name: "Golden Harvest",
  category: "Wheat",
  quantity: 24,
  harvestDate: new Date("2026-01-10T00:00:00.000Z"),
  location: "Punjab",
  shipment: {
    transporter: null,
    status: "Driver Assigned",
    currentLocation: "Farm",
    updates: [],
  },
  async save() {
    appendSequence.push("product-save");
  },
});

const makeShipment = (overrides = {}) => ({
  _id: "shipment-1",
  trackingId: "TRK-12345678",
  status: "In Transit",
  currentLocation: "Depot",
  transporter: "transporter-1",
  order: {
    _id: "order-1",
    buyer: { _id: "buyer-1" },
    product: { _id: "product-1", farmer: { _id: "farmer-1" } },
  },
  async save() {
    appendSequence.push("shipment-save");
  },
  async populate() {
    return this;
  },
  ...overrides,
});

const makeRequest = ({ role = "transporter", body = {}, params = { id: "shipment-1" } } = {}) => ({
  user: { _id: `${role}-1`, id: `${role}-1`, role, fullName: "Morgan Lee" },
  body,
  params,
});

const resetTraceCalls = () => {
  recordedEvents.length = 0;
  appendSequence.length = 0;
};

test("product registration records one idempotent event and preserves the trace QR URL", async (context) => {
  resetTraceCalls();
  const product = makeProduct();
  replaceMethod(context, Product, "create", async () => product);
  replaceMethod(context, Product, "findByIdAndUpdate", async (_id, update) => {
    Object.assign(product, update);
    return product;
  });
  replaceMethod(context, Product, "findById", async () => product);

  const response = makeResponse();
  await addProduct(makeRequest({
    role: "farmer",
    body: { name: product.name, category: product.category, quantity: product.quantity },
  }), response);

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.product.traceabilityId, "TRACE-product-1");
  assert.ok(response.body.product.qrCode.startsWith("data:image/png;base64,"));
  assert.equal(recordedEvents.length, 1);
  assert.equal(recordedEvents[0].eventType, "PRODUCT_REGISTERED");
  assert.equal(recordedEvents[0].idempotencyKey, "product-registration:product-1");
});

test("shipment creation traces the upserted shipment with a stable key", async (context) => {
  resetTraceCalls();
  const product = makeProduct();
  const order = {
    _id: "order-1",
    status: "Accepted by Farmer",
    product: { _id: product._id, location: "Punjab" },
  };
  const shipment = makeShipment({ status: "Awaiting Driver Assignment", currentLocation: "Punjab" });
  replaceMethod(context, Order, "findById", () => makeQuery(order));
  replaceMethod(context, Shipment, "findOneAndUpdate", () => makeQuery(shipment));

  const response = makeResponse();
  await createShipment(makeRequest({ body: { order: order._id } }), response);

  assert.equal(response.statusCode, 201);
  assert.equal(recordedEvents[0].eventType, "SHIPMENT_CREATED");
  assert.equal(recordedEvents[0].payload.status, "Awaiting Driver Assignment");
  assert.equal(recordedEvents[0].idempotencyKey, "shipment-created:shipment-1");
});

test("acceptance persists Mongo documents before enqueuing its trace event", async (context) => {
  resetTraceCalls();
  const product = makeProduct();
  const shipment = makeShipment({ transporter: null, status: "Pending Acceptance" });
  product.save = async () => {
    appendSequence.push("product-save");
  };
  replaceMethod(context, Shipment, "findById", () => makeQuery(shipment));
  replaceMethod(context, Product, "findById", async () => product);
  replaceMethod(context, Notification, "insertMany", async () => []);

  const response = makeResponse();
  await acceptShipmentRequest(makeRequest({ body: { notes: "Collected at farm" } }), response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(appendSequence.slice(0, 3), ["product-save", "shipment-save", "trace"]);
  assert.equal(recordedEvents[0].payload.status, "Awaiting Driver Assignment");
  assert.equal(recordedEvents[0].idempotencyKey, "shipment-accepted:shipment-1:transporter-1");
});

test("authorized shipment status changes update the product timeline and enqueue an idempotent event", async (context) => {
  resetTraceCalls();
  const product = makeProduct();
  const shipment = makeShipment();
  replaceMethod(context, Shipment, "findOneAndUpdate", () => makeQuery(shipment));
  replaceMethod(context, Product, "findById", async () => product);
  replaceMethod(context, Notification, "insertMany", async () => []);

  const request = makeRequest({
    body: { status: "In Transit", currentLocation: "Depot", notes: "Left the farm" },
  });
  const firstResponse = makeResponse();
  await updateShipment(request, firstResponse);
  const firstKey = recordedEvents[0].idempotencyKey;

  const secondResponse = makeResponse();
  await updateShipment(request, secondResponse);

  assert.equal(firstResponse.statusCode, 200);
  assert.equal(secondResponse.statusCode, 200);
  assert.equal(product.shipment.status, "In Transit");
  assert.equal(recordedEvents.length, 2);
  assert.equal(recordedEvents[0].eventType, "SHIPMENT_STATUS_UPDATED");
  assert.equal(recordedEvents[0].payload.location, "Depot");
  assert.equal(recordedEvents[0].idempotencyKey, firstKey);
  assert.equal(recordedEvents[1].idempotencyKey, firstKey);
});

test("driver assignment records its status without putting contact details on-chain", async (context) => {
  resetTraceCalls();
  const shipment = makeShipment({ status: "Driver Assigned" });
  replaceMethod(context, Shipment, "findOneAndUpdate", () => makeQuery(shipment));
  replaceMethod(context, Notification, "insertMany", async () => []);

  const response = makeResponse();
  await assignDriver(makeRequest({
    body: {
      driverName: "Jordan Driver",
      driverContactNumber: "555-0100",
      vehicleNumber: "TRK-42",
      estimatedDeliveryDate: "2026-10-12T12:00:00.000Z",
    },
  }), response);

  assert.equal(response.statusCode, 200);
  assert.equal(recordedEvents[0].payload.status, "Driver Assigned");
  assert.equal(recordedEvents[0].payload.driverName, undefined);
  assert.equal(recordedEvents[0].payload.driverContactNumber, undefined);
  assert.match(recordedEvents[0].idempotencyKey, /^driver-assignment:0x/);
});

test("role restrictions reject invalid shipment transitions without trace writes", async () => {
  resetTraceCalls();
  const response = makeResponse();
  await updateShipment(makeRequest({
    role: "buyer",
    body: { status: "In Transit" },
  }), response);

  assert.equal(response.statusCode, 403);
  assert.equal(recordedEvents.length, 0);
});
