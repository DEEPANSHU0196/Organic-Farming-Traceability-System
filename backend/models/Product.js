const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    unit: {
      type: String,
      default: "kg",
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    certification: {
      type: String,
      default: "Organic",
    },

    harvestDate: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    blockchainHash: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);