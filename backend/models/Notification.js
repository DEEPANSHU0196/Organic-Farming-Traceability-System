const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "new_order",
        "order_accepted",
        "order_rejected",
        "shipment_request",
        "driver_assigned",
        "shipment_status_updated",
        "new_delivery",
        "delivery_accepted",
        "delivery_rejected",
        "delivery_completed",
        "order_update",
        "shipment_claimed",
      ],
      default: "order_update",
    },

    title: String,

    message: String,

    data: {
      shipmentId: mongoose.Schema.Types.ObjectId,
      orderId: mongoose.Schema.Types.ObjectId,
      productId: mongoose.Schema.Types.ObjectId,
    },

    read: {
      type: Boolean,
      default: false,
    },

    readAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
