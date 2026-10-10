const test = require("node:test");
const assert = require("node:assert/strict");
const Product = require("../models/Product");
const traceBlockchain = require("../utils/traceBlockchain");
const polygonTrace = require("../utils/polygonTrace");

const originalVerifyTraceChain = traceBlockchain.verifyTraceChain;
const originalVerifyOnChainTrace = polygonTrace.verifyOnChainTrace;
const legacyBlockchain = { valid: true, blockCount: 1, blocks: [{ eventType: "PRODUCT_REGISTERED" }] };
const chainVerification = {
  network: "Polygon Amoy",
  chainId: 80002,
  status: "unavailable",
  registration: { status: "unavailable" },
  events: [],
};

traceBlockchain.verifyTraceChain = async () => legacyBlockchain;
polygonTrace.verifyOnChainTrace = async () => chainVerification;
const { getProductTrace } = require("../controllers/productController");

test.after(() => {
  traceBlockchain.verifyTraceChain = originalVerifyTraceChain;
  polygonTrace.verifyOnChainTrace = originalVerifyOnChainTrace;
});

test("public trace response preserves existing fields and adds on-chain verification", async (context) => {
  const product = { _id: "product-1", name: "Golden Harvest" };
  const originalFindById = Product.findById;
  const query = {
    populate() { return this; },
    then(resolve, reject) { return Promise.resolve(product).then(resolve, reject); },
  };
  Product.findById = () => query;
  context.after(() => {
    Product.findById = originalFindById;
  });

  const response = {
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
  };

  await getProductTrace({ params: { id: "product-1" } }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.product, product);
  assert.equal(response.body.blockchain, legacyBlockchain);
  assert.equal(response.body.onChainVerification, chainVerification);
});
