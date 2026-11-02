const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const Review = require("../models/Review");
const {
  seedInitialAdminAccount,
} = require("../controllers/authController");
const {
  updateProduct,
  deleteProduct,
  buildProductRegistrationPayload,
} = require("../controllers/productController");
const {
  markNotificationAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { getFarmerProfile } = require("../controllers/publicController");
const { hashPayload } = require("../utils/polygonTrace");

const stubMethod = (t, target, key, implementation) => {
  const original = target[key];
  target[key] = implementation;
  t.after(() => {
    target[key] = original;
  });
};

const setAdminBootstrapEnvironment = (t) => {
  const originalEnv = {
    ADMIN_NAME: process.env.ADMIN_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  };
  t.after(() => {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
  process.env.ADMIN_NAME = "Initial Admin";
  process.env.ADMIN_EMAIL = " ADMIN@example.test ";
  process.env.ADMIN_PASSWORD = "a-long-initial-secret";
};

const makeResponse = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

test("initial admin bootstrap leaves an existing account untouched", async (t) => {
  setAdminBootstrapEnvironment(t);

  const existing = { role: "admin", password: "existing-password-hash" };
  let lookup;
  stubMethod(t, User, "findOne", async (filter) => {
    lookup = filter;
    return existing;
  });
  stubMethod(t, User, "create", async () => assert.fail("existing account must not be overwritten"));

  assert.equal(await seedInitialAdminAccount(), existing);
  assert.deepEqual(lookup, { email: "admin@example.test" });
  assert.deepEqual(existing, { role: "admin", password: "existing-password-hash" });
});

test("initial admin bootstrap creates only a hashed, environment-configured account", async (t) => {
  setAdminBootstrapEnvironment(t);

  let created;
  stubMethod(t, User, "findOne", async () => null);
  stubMethod(t, User, "create", async (account) => {
    created = account;
    return account;
  });

  await seedInitialAdminAccount();

  assert.equal(created.fullName, "Initial Admin");
  assert.equal(created.email, "admin@example.test");
  assert.equal(created.role, "admin");
  assert.notEqual(created.password, process.env.ADMIN_PASSWORD);
  assert.equal(await bcrypt.compare(process.env.ADMIN_PASSWORD, created.password), true);
});

test("initial admin bootstrap does not promote an existing non-admin account", async (t) => {
  setAdminBootstrapEnvironment(t);
  const existing = { role: "farmer", password: "existing-password-hash" };

  stubMethod(t, User, "findOne", async () => existing);
  stubMethod(t, User, "create", async () => assert.fail("existing account must not be promoted"));

  await assert.rejects(seedInitialAdminAccount(), /will not promote an existing user/);
  assert.deepEqual(existing, { role: "farmer", password: "existing-password-hash" });
});

test("product update is owner-scoped and ignores fields outside the editable allowlist", async (t) => {
  const filters = [];
  let updates;
  stubMethod(t, Product, "findOne", async (filter) => {
    filters.push(filter);
    return { image: "existing-image" };
  });
  stubMethod(t, Product, "findOneAndUpdate", async (filter, patch, options) => {
    filters.push(filter);
    updates = { patch, options };
    return { name: patch.name, quantity: patch.quantity };
  });

  const res = makeResponse();
  await updateProduct({
    params: { id: "product-1" },
    user: { _id: "farmer-1", role: "farmer" },
    body: {
      name: "Updated batch",
      quantity: 20,
      farmer: "farmer-2",
      status: "Approved",
      certificationNumber: "forged-reference",
      certificationVerified: true,
      organicCertified: true,
      shipment: { status: "Delivered" },
    },
  }, res);

  assert.deepEqual(filters, [
    { _id: "product-1", farmer: "farmer-1" },
    { _id: "product-1", farmer: "farmer-1" },
  ]);
  assert.deepEqual(updates.patch, { name: "Updated batch", quantity: 20 });
  assert.equal(updates.options.runValidators, true);
  assert.equal(res.statusCode, 200);
});

test("product update does not find another farmer's product", async (t) => {
  let updateAttempted = false;
  stubMethod(t, Product, "findOne", async () => null);
  stubMethod(t, Product, "findOneAndUpdate", async () => {
    updateAttempted = true;
    return null;
  });
  const res = makeResponse();

  await updateProduct({
    params: { id: "product-owned-by-someone-else" },
    user: { _id: "farmer-1", role: "farmer" },
    body: { name: "Unauthorized edit" },
  }, res);

  assert.equal(updateAttempted, false);
  assert.equal(res.statusCode, 404);
});

test("product deletion scopes the database delete to the owner", async (t) => {
  let filter;
  stubMethod(t, Product, "findOneAndDelete", async (query) => {
    filter = query;
    return { _id: "product-1" };
  });
  const res = makeResponse();

  await deleteProduct({
    params: { id: "product-1" },
    user: { _id: "farmer-1", role: "farmer" },
  }, res);

  assert.deepEqual(filter, { _id: "product-1", farmer: "farmer-1" });
  assert.equal(res.statusCode, 200);
});

test("single-notification updates and deletes include the authenticated recipient", async (t) => {
  const filters = [];
  stubMethod(t, Notification, "findOneAndUpdate", async (filter) => {
    filters.push(filter);
    return null;
  });
  stubMethod(t, Notification, "findOneAndDelete", async (filter) => {
    filters.push(filter);
    return null;
  });

  const request = {
    params: { id: "notification-1" },
    user: { _id: "user-1" },
  };
  const updateResponse = makeResponse();
  await markNotificationAsRead(request, updateResponse);
  const deleteResponse = makeResponse();
  await deleteNotification(request, deleteResponse);

  assert.deepEqual(filters, [
    { _id: "notification-1", recipient: "user-1" },
    { _id: "notification-1", recipient: "user-1" },
  ]);
  assert.equal(updateResponse.statusCode, 404);
  assert.equal(deleteResponse.statusCode, 404);
});

test("organic claims and submitted certificate references are included in registration metadata", () => {
  const payload = buildProductRegistrationPayload({
    name: "Organic wheat",
    category: "Wheat",
    quantity: 10,
    harvestDate: new Date("2026-01-02T00:00:00.000Z"),
    location: "Farm",
    organicCertified: true,
    certificationNumber: "CERT-123",
    certificationVerified: false,
  });
  const changedClaimHash = hashPayload({ ...payload, organicCertified: false });
  const changedReferenceHash = hashPayload({ ...payload, certificationNumber: "CERT-456" });

  assert.equal(payload.certificationVerified, false);
  assert.notEqual(changedClaimHash, hashPayload(payload));
  assert.notEqual(changedReferenceHash, hashPayload(payload));
});

test("public farmer profile distinguishes a submitted reference from verified certification", async (t) => {
  const farmerId = new mongoose.Types.ObjectId().toString();
  let products = [{
    _id: "product-1",
    certificationNumber: "CERT-123",
    certificationVerified: false,
  }];
  const farmerQuery = {
    select() {
      return this;
    },
    async lean() {
      return { _id: farmerId, fullName: "Farmer", createdAt: new Date() };
    },
  };
  const productQuery = {
    select() {
      return this;
    },
    sort() {
      return this;
    },
    limit() {
      return this;
    },
    async lean() {
      return products;
    },
  };
  const reviewQuery = {
    select() {
      return this;
    },
    sort() {
      return this;
    },
    limit() {
      return this;
    },
    async lean() {
      return [];
    },
  };
  stubMethod(t, User, "findOne", () => farmerQuery);
  stubMethod(t, Product, "find", () => productQuery);
  stubMethod(t, Review, "find", () => reviewQuery);

  const response = {
    body: null,
    status() {
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  await getFarmerProfile({ params: { id: farmerId } }, response);

  assert.equal(response.body.farmer.certified, false);
  assert.equal(response.body.farmer.certificationSubmitted, true);

  products = [{ _id: "product-2", certificationNumber: "CERT-456", certificationVerified: true }];
  await getFarmerProfile({ params: { id: farmerId } }, response);
  assert.equal(response.body.farmer.certified, true);
});
