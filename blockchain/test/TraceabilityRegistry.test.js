const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TraceabilityRegistry", function () {
  async function deployRegistry() {
    const [owner, writer, stranger] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("TraceabilityRegistry");
    const registry = await factory.deploy();
    await registry.waitForDeployment();
    return { registry, owner, writer, stranger };
  }

  it("registers products in a batch and exposes their verification data", async function () {
    const { registry, owner } = await deployRegistry();
    const productIds = ["mongo-product-1", "mongo-product-2"];
    const metadataHashes = [ethers.id("metadata-1"), ethers.id("metadata-2")];

    await expect(registry.registerProducts(productIds, metadataHashes))
      .to.emit(registry, "ProductRegistered")
      .withArgs(productIds[0], metadataHashes[0], owner.address, anyTimestamp());

    expect(await registry.isProductRegistered(productIds[0])).to.equal(true);
    expect(await registry.isProductRegistered("missing-product")).to.equal(false);
    expect(await registry.getProduct(productIds[1])).to.deep.equal([
      metadataHashes[1],
      owner.address,
      await registrationTimestamp(registry, productIds[1]),
    ]);
  });

  it("reverts a duplicate inside a batch without partially registering products", async function () {
    const { registry } = await deployRegistry();

    await expect(
      registry.registerProducts(["duplicate", "duplicate"], [ethers.id("a"), ethers.id("b")]),
    ).to.be.revertedWithCustomError(registry, "ProductAlreadyRegistered");
    expect(await registry.isProductRegistered("duplicate")).to.equal(false);
  });

  it("allows only the owner to authorize writers and only writers to mutate records", async function () {
    const { registry, owner, writer, stranger } = await deployRegistry();

    await expect(registry.connect(stranger).setAuthorizedWriter(writer.address, true))
      .to.be.revertedWithCustomError(registry, "Unauthorized");
    await expect(registry.connect(stranger).registerProducts(["p"], [ethers.id("p")]))
      .to.be.revertedWithCustomError(registry, "Unauthorized");

    await expect(registry.setAuthorizedWriter(writer.address, true))
      .to.emit(registry, "WriterAuthorizationChanged")
      .withArgs(writer.address, true);
    await registry.connect(writer).registerProducts(["writer-product"], [ethers.id("metadata")]);
    expect((await registry.getProduct("writer-product")).registeredBy).to.equal(writer.address);

    await registry.setAuthorizedWriter(writer.address, false);
    await expect(registry.connect(writer).registerProducts(["after-revoke"], [ethers.id("x")]))
      .to.be.revertedWithCustomError(registry, "Unauthorized");
    expect(owner.address).to.equal(await registry.owner());
  });

  it("appends immutable trace events and verifies them publicly by product and event ID", async function () {
    const { registry, owner, stranger } = await deployRegistry();
    const productId = "mongo-product-3";
    const eventId = "shipment-event-1";
    const eventType = "SHIPMENT_UPDATED";
    const dataHash = ethers.id("warehouse-a");
    await registry.registerProducts([productId], [ethers.id("product-metadata")]);

    await expect(registry.appendTraceEvent(productId, eventId, eventType, dataHash))
      .to.emit(registry, "TraceEventAppended")
      .withArgs(productId, eventId, eventType, dataHash, owner.address, anyTimestamp());

    expect(await registry.getTraceCount(productId)).to.equal(1);
    expect(await registry.eventIdUsed(eventId)).to.equal(true);
    const storedEvent = await registry.getTraceEvent(productId, 0);
    expect(storedEvent.eventId).to.equal(eventId);
    expect(storedEvent.eventType).to.equal(eventType);
    expect(storedEvent.dataHash).to.equal(dataHash);
    expect(storedEvent.actor).to.equal(owner.address);

    const [verifiedProductId, verifiedEvent] = await registry.connect(stranger).getTraceEventById(eventId);
    expect(verifiedProductId).to.equal(productId);
    expect(verifiedEvent.eventId).to.equal(eventId);
    await expect(registry.connect(stranger).appendTraceEvent(productId, "public-write", "EDIT", dataHash))
      .to.be.revertedWithCustomError(registry, "Unauthorized");
    expect(await registry.getTraceCount(productId)).to.equal(1);
  });

  it("enforces globally unique event IDs and rejects events for unknown products", async function () {
    const { registry } = await deployRegistry();
    const hash = ethers.id("payload");
    await registry.registerProducts(["product-a", "product-b"], [hash, hash]);

    await registry.appendTraceEvent("product-a", "global-event-id", "CREATED", hash);
    await expect(registry.appendTraceEvent("product-b", "global-event-id", "CREATED", hash))
      .to.be.revertedWithCustomError(registry, "EventIdAlreadyUsed");
    await expect(registry.appendTraceEvent("unknown", "new-event-id", "CREATED", hash))
      .to.be.revertedWithCustomError(registry, "ProductNotRegistered");
    await expect(registry.getTraceEventById("not-recorded"))
      .to.be.revertedWithCustomError(registry, "EmptyEventId");
  });

  it("rejects invalid batch lengths, empty identifiers, and duplicate product registration", async function () {
    const { registry } = await deployRegistry();

    await expect(registry.registerProducts(["one"], []))
      .to.be.revertedWithCustomError(registry, "InvalidArrayLength");
    await expect(registry.registerProducts([""], [ethers.id("metadata")]))
      .to.be.revertedWithCustomError(registry, "EmptyProductId");
    await registry.registerProducts(["registered"], [ethers.id("metadata")]);
    await expect(registry.registerProducts(["registered"], [ethers.id("other")]))
      .to.be.revertedWithCustomError(registry, "ProductAlreadyRegistered");
    await expect(registry.appendTraceEvent("registered", "", "CREATED", ethers.id("data")))
      .to.be.revertedWithCustomError(registry, "EmptyEventId");
  });
    it("rejects a duplicate request for the same product and event ID", async function () {
    const { registry } = await deployRegistry();
    const hash = ethers.id("payload");
    await registry.registerProducts(["p1"], [hash]);
    await registry.appendTraceEvent("p1", "evt-1", "CREATED", hash);

    await expect(registry.appendTraceEvent("p1", "evt-1", "CREATED", hash))
      .to.be.revertedWithCustomError(registry, "EventIdAlreadyUsed");
    expect(await registry.getTraceCount("p1")).to.equal(1);
  });

  it("keeps events in insertion order for one product", async function () {
    const { registry } = await deployRegistry();
    const hash = ethers.id("payload");
    await registry.registerProducts(["p1"], [hash]);
    await registry.appendTraceEvent("p1", "evt-1", "CREATED", hash);
    await registry.appendTraceEvent("p1", "evt-2", "SHIPPED", hash);

    expect(await registry.getTraceCount("p1")).to.equal(2);
    expect((await registry.getTraceEvent("p1", 0)).eventId).to.equal("evt-1");
    expect((await registry.getTraceEvent("p1", 1)).eventId).to.equal("evt-2");
  });

  it("reverts when reading an out-of-range trace index", async function () {
    const { registry } = await deployRegistry();
    await registry.registerProducts(["p1"], [ethers.id("m")]);

    await expect(registry.getTraceEvent("p1", 5))
      .to.be.revertedWithCustomError(registry, "TraceEventNotFound");
  });

  it("rejects an empty event type and a zero-address writer", async function () {
    const { registry } = await deployRegistry();
    const hash = ethers.id("payload");
    await registry.registerProducts(["p1"], [hash]);

    await expect(registry.appendTraceEvent("p1", "evt-x", "", hash))
      .to.be.revertedWithCustomError(registry, "EmptyEventType");
    await expect(registry.setAuthorizedWriter(ethers.ZeroAddress, true))
      .to.be.revertedWithCustomError(registry, "InvalidAddress");
  });
    it("rejects an event with an empty product ID", async function () {
    const { registry } = await deployRegistry();
    await expect(registry.appendTraceEvent("", "evt-1", "CREATED", ethers.id("d")))
      .to.be.revertedWithCustomError(registry, "EmptyProductId");
  });

  it("reverts when reading an unregistered product", async function () {
    const { registry } = await deployRegistry();
    await expect(registry.getProduct("not-registered"))
      .to.be.revertedWithCustomError(registry, "ProductNotRegistered");
  });
});

function anyTimestamp() {
  return (value) => value > 0;
}

async function registrationTimestamp(registry, productId) {
  const product = await registry.getProduct(productId);
  return product.registeredAt;
}