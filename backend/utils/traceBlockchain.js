const crypto = require("crypto");
const TraceBlock = require("../models/TraceBlock");

const GENESIS_HASH = "GENESIS";

const canonicalize = (value) => JSON.stringify(value, Object.keys(value || {}).sort());

const calculateHash = ({ productId, index, eventType, payload, actorId, actorRole, previousHash, timestamp }) => crypto
  .createHash("sha256")
  .update(canonicalize({
    productId: String(productId),
    index,
    eventType,
    payload: payload || {},
    actorId: actorId ? String(actorId) : null,
    actorRole: actorRole || null,
    previousHash,
    timestamp: new Date(timestamp).toISOString(),
  }))
  .digest("hex");

const appendTraceBlock = async ({ productId, eventType, payload = {}, actor } = {}) => {
  if (!productId || !eventType) throw new Error("Product and event type are required for a trace block");

  const previousBlock = await TraceBlock.findOne({ product: productId }).sort({ index: -1 });
  const index = previousBlock ? previousBlock.index + 1 : 0;
  const previousHash = previousBlock?.hash || GENESIS_HASH;
  const timestamp = new Date();
  const actorId = actor?._id || actor?.id;
  const actorRole = actor?.role;
  const hash = calculateHash({ productId, index, eventType, payload, actorId, actorRole, previousHash, timestamp });

  return TraceBlock.create({
    product: productId,
    index,
    eventType,
    payload,
    actorId,
    actorRole,
    previousHash,
    hash,
    timestamp,
  });
};

const verifyTraceChain = async (productId) => {
  const blocks = await TraceBlock.find({ product: productId }).sort({ index: 1 }).lean();
  let previousHash = GENESIS_HASH;
  let valid = true;

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const expectedHash = calculateHash(block);
    if (block.index !== index || block.previousHash !== previousHash || block.hash !== expectedHash) {
      valid = false;
      break;
    }
    previousHash = block.hash;
  }

  return {
    valid,
    blockCount: blocks.length,
    latestHash: blocks.at(-1)?.hash || null,
    blocks,
  };
};

module.exports = { appendTraceBlock, verifyTraceChain, calculateHash, GENESIS_HASH };
