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
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { versionKey: false }
);

traceBlockSchema.index({ product: 1, index: 1 }, { unique: true });

module.exports = mongoose.model("TraceBlock", traceBlockSchema);
