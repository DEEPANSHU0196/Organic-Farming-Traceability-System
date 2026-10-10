const crypto = require("crypto");
const TraceBlock = require("../models/TraceBlock");
const { recordTraceEvent, hashPayload, hashTraceEvent } = require("./polygonTrace");

const GENESIS_HASH = "GENESIS";
const BLOCK_DIFFICULTY = 2;

const canonicalize = (value) => JSON.stringify(value, Object.keys(value || {}).sort());

const normalizeBlockData = (block = {}) => {
  const productId = block.productId ?? block.product ?? null;
  const actorId = block.actorId ?? block.actor ?? null;

  return {
    productId: productId ? String(productId) : null,
    index: Number(block.index ?? 0),
    eventType: block.eventType || "",
    payload: block.payload || {},
    actorId: actorId ? String(actorId) : null,
    actorRole: block.actorRole || null,
    previousHash: block.previousHash || GENESIS_HASH,
    timestamp: new Date(block.timestamp || Date.now()).toISOString(),
    nonce: Number(block.nonce ?? 0),
    difficulty: Number(block.difficulty ?? BLOCK_DIFFICULTY),
  };
};

const calculateHash = (blockData) => {
  const normalized = normalizeBlockData(blockData);

  return crypto
    .createHash("sha256")
    .update(canonicalize(normalized))
    .digest("hex");
};

const mineBlock = ({
  productId,
  index,
  eventType,
  payload = {},
  actorId,
  actorRole,
  previousHash = GENESIS_HASH,
  timestamp = new Date(),
  difficulty = BLOCK_DIFFICULTY,
  nonce = 0,
} = {}) => {
  if (!productId || !eventType) {
    throw new Error("Product and event type are required for a trace block");
  }

  const targetPrefix = "0".repeat(Number(difficulty) || BLOCK_DIFFICULTY);
  let attemptNonce = Number(nonce) || 0;
  let hash = "";

  while (!hash.startsWith(targetPrefix)) {
    attemptNonce += 1;
    hash = calculateHash({
      productId,
      index,
      eventType,
      payload,
      actorId,
      actorRole,
      previousHash,
      timestamp,
      nonce: attemptNonce,
      difficulty,
    });
  }

  return {
    productId: String(productId),
    index: Number(index),
    eventType,
    payload: payload || {},
    actorId: actorId ? String(actorId) : null,
    actorRole: actorRole || null,
    previousHash,
    timestamp: new Date(timestamp).toISOString(),
    nonce: attemptNonce,
    difficulty: Number(difficulty) || BLOCK_DIFFICULTY,
    hash,
  };
};

const validateBlockSequence = (blocks = []) => {
  let previousHash = GENESIS_HASH;
  let valid = true;
  const normalizedBlocks = blocks.map((block) => ({ ...block }));

  for (let index = 0; index < normalizedBlocks.length; index += 1) {
    const block = normalizedBlocks[index];
    const difficulty = Number(block.difficulty ?? BLOCK_DIFFICULTY);
    const targetPrefix = "0".repeat(difficulty);
    const expectedHash = calculateHash(block);

    if (
      Number(block.index) !== index ||
      (block.previousHash || GENESIS_HASH) !== previousHash ||
      block.hash !== expectedHash ||
      !block.hash.startsWith(targetPrefix)
    ) {
      valid = false;
      break;
    }

    previousHash = block.hash;
  }

  return {
    valid,
    blockCount: normalizedBlocks.length,
    latestHash: normalizedBlocks.at(-1)?.hash || null,
    blocks: normalizedBlocks,
  };
};

const appendTraceBlock = async ({ productId, eventType, payload = {}, actor, idempotencyKey } = {}) => {
  if (!productId || !eventType) throw new Error("Product and event type are required for a trace block");

  const finishTraceRecord = async (record) => {
    const onChainResult = await recordTraceEvent(record.toObject());
    const updatedRecord = await TraceBlock.findById(record._id).lean();
    return {
      ...(updatedRecord || record.toObject()),
      onChain: onChainResult,
    };
  };

  if (idempotencyKey) {
    const existingRecord = await TraceBlock.findOne({ idempotencyKey });
    if (existingRecord) return finishTraceRecord(existingRecord);
  }

  const previousBlock = await TraceBlock.findOne({ product: productId }).sort({ index: -1 });
  const index = previousBlock ? previousBlock.index + 1 : 0;
  const previousHash = previousBlock?.hash || GENESIS_HASH;
  const timestamp = new Date();
  const actorId = actor?._id || actor?.id;
  const actorRole = actor?.role;

  const minedBlock = mineBlock({
    productId,
    index,
    eventType,
    payload,
    actorId,
    actorRole,
    previousHash,
    timestamp,
    difficulty: BLOCK_DIFFICULTY,
  });

  const persisted = new TraceBlock({
    product: productId,
    index: minedBlock.index,
    eventType: minedBlock.eventType,
    payload: minedBlock.payload,
    actorId,
    actorRole,
    previousHash: minedBlock.previousHash,
    hash: minedBlock.hash,
    nonce: minedBlock.nonce,
    difficulty: minedBlock.difficulty,
    timestamp: minedBlock.timestamp,
    idempotencyKey,
  });

  const eventId = persisted._id.toString();
  persisted.eventHash = hashTraceEvent({
    productId,
    eventId,
    eventType,
    payload,
    actorId,
    actorRole,
    timestamp: minedBlock.timestamp,
  });
  persisted.batchId = hashPayload({
    productId: String(productId),
    index: minedBlock.index,
    blockHash: minedBlock.hash,
  });
  persisted.blockchainStatus = "pending";
  try {
    await persisted.save();
  } catch (error) {
    if (error.code !== 11000 || !idempotencyKey) throw error;
    const existingRecord = await TraceBlock.findOne({ idempotencyKey });
    if (!existingRecord) throw error;
    return finishTraceRecord(existingRecord);
  }

  return finishTraceRecord(persisted);
};

const verifyTraceChain = async (productId) => {
  const blocks = await TraceBlock.find({ product: productId }).sort({ index: 1 }).lean();
  return validateBlockSequence(blocks);
};

module.exports = {
  appendTraceBlock,
  verifyTraceChain,
  calculateHash,
  mineBlock,
  validateBlockSequence,
  GENESIS_HASH,
  BLOCK_DIFFICULTY,
};
