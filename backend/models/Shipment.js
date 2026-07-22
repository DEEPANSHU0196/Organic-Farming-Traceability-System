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

    driverName: {
      type: String,
      trim: true,
    },

    driverContactNumber: {
      type: String,
      trim: true,
    },

    vehicleNumber: {
      type: String,
      trim: true,
    },

    estimatedDeliveryDate: Date,

    currentLocation: String,

    status: {
      type: String,
      enum: [
        "Pending Acceptance",
        "Awaiting Driver Assignment",
        "Driver Assigned",
        "Picked Up from Farm",
        "In Transit",
        "Out for Delivery",
        "Delivered",
        "Rejected",
        "Assigned",
        "Picked",
        "Completed",
      ],
      default: "Pending Acceptance",
    },

    updates: [
      {
        status: String,
        location: String,
        notes: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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