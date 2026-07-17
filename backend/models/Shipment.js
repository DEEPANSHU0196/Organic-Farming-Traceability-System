const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    trackingId: String,

    currentLocation: String,

    status: {
      type: String,
      default: "Assigned",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Shipment",
    shipmentSchema
  );