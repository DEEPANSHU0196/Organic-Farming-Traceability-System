const mongoose = require("mongoose");

const traceBlockSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    index: {
      type: Number,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actorRole: String,
    previousHash: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
      unique: true,
    },
    batchId: {
      type: String,
      index: true,
    },
    idempotencyKey: String,
    eventHash: String,
    blockchainStatus: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
      index: true,
    },
    transactionHash: String,
    blockNumber: Number,
    productRegistrationTransactionHash: String,
    productRegistrationBlockNumber: Number,
    blockchainAttempts: {
      type: Number,
      default: 0,
    },
    blockchainNextAttemptAt: Date,
    blockchainLastError: String,
    blockchainLockId: String,
    blockchainLockUntil: Date,
    nonce: {
      type: Number,
      required: true,
      default: 0,
    },
    difficulty: {
      type: Number,
      required: true,
      default: 2,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { versionKey: false }
);

traceBlockSchema.index({ product: 1, index: 1 }, { unique: true });
traceBlockSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
traceBlockSchema.index({ blockchainStatus: 1, blockchainNextAttemptAt: 1, timestamp: 1 });

module.exports = mongoose.model("TraceBlock", traceBlockSchema);
