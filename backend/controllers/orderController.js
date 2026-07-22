const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Shipment = require("../models/Shipment");
const Notification = require("../models/Notification");
const { buildFarmerOrderView } = require("../utils/orderUtils");

const createOrder = async (req, res) => {
  try {
    const { product: productId, quantity, notes } = req.body;
    const product = await Product.findById(productId).populate("farmer", "fullName email");
    const requestedQuantity = Number(quantity);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive whole number" });
    }
    if (requestedQuantity > Number(product.quantity || 0)) {
      return res.status(400).json({ success: false, message: "Requested quantity is not available" });
    }

    const order = await Order.create({
      product: product._id,
      quantity: requestedQuantity,
      buyer: req.user._id,
      notes,
      status: "Pending Farmer Approval",
    });

    await Notification.create({
      recipient: product.farmer._id,
      type: "new_order",
      title: "New order awaiting approval",
      message: `${req.user.fullName || "A buyer"} placed an order for ${requestedQuantity} unit(s) of ${product.name || product.productName || "your product"}.`,
      data: { orderId: order._id, productId: product._id },
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
    }).populate("product").populate("buyer").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFarmerOrders = async (req, res) => {
  try {
    const farmerProducts = await Product.find({ farmer: req.user._id }).select("_id");
    const productIds = farmerProducts.map((product) => product._id);

    const orders = await Order.find({ product: { $in: productIds } })
      .populate("buyer", "fullName email phone address")
      .populate("product", "name productName price unit location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: orders.map(buildFarmerOrderView),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateFarmerOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const requestedStatus = status === "Accepted" ? "Accepted by Farmer" : status === "Rejected" ? "Rejected by Farmer" : status;

    if (!["Accepted by Farmer", "Rejected by Farmer"].includes(requestedStatus)) {
      return res.status(400).json({ success: false, message: "Status must be Accepted by Farmer or Rejected by Farmer" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const product = await Product.findById(order.product);
    if (!product || product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only manage your own orders" });
    }

    if (order.status !== "Pending Farmer Approval" && order.status !== "Pending") {
      return res.status(409).json({ success: false, message: "This order has already been reviewed" });
    }

    if (requestedStatus === "Accepted by Farmer" && Number(order.quantity) > Number(product.quantity || 0)) {
      return res.status(400).json({ success: false, message: "Product quantity is no longer available" });
    }

    order.status = requestedStatus;
    order.rejectionReason = requestedStatus === "Rejected by Farmer" ? (rejectionReason || "Product is unavailable") : "";
    await order.save();

    const buyer = await User.findById(order.buyer).select("fullName");

    if (requestedStatus === "Rejected by Farmer") {
      await Notification.create({
        recipient: order.buyer,
        type: "order_rejected",
        title: "Order rejected by farmer",
        message: `Your order for ${product.name || product.productName || "the product"} was rejected. Reason: ${order.rejectionReason}`,
        data: { orderId: order._id, productId: product._id },
      });
    }

    // Create one shipment request after acceptance and notify the transporter.
    if (requestedStatus === "Accepted by Farmer") {
      product.quantity = Math.max(0, Number(product.quantity || 0) - Number(order.quantity));
      await product.save({ runValidators: false });
      // Create open market shipment request and notify all transporters
      const transporters = await User.find({ role: 'transporter' });
      if (transporters && transporters.length > 0) {
        // Check if shipment already exists to avoid duplicates
        const existingShipment = await Shipment.findOne({ order: order._id });
        if (!existingShipment) {
          const shipment = await Shipment.create({
            order: order._id,
            transporter: null, // Open for claiming
            trackingId: `TRK-${order._id.toString().slice(-8).toUpperCase()}`,
            status: 'Pending Acceptance',
            currentLocation: product.location || 'Farm'
          });

          // Also set the status in the product's shipment traceability
          product.shipment.status = 'Pending';
          product.shipment.updates.push({
            stage: 'Order Accepted',
            status: 'Pending',
            date: new Date(),
            location: product.location || 'Farm',
            description: 'Awaiting Transporter Acceptance',
            icon: 'CheckCircle'
          });
          await product.save({ runValidators: false });

          // Broadcast notification to all transporters
          const notifications = transporters.map(transporter => ({
            recipient: transporter._id,
            type: 'shipment_request',
            title: 'New delivery request available',
            message: `A delivery request is available for ${product.name || product.productName || 'produce'} from ${product.location || 'the farm'}. Buyer: ${buyer?.fullName || 'Buyer'}.`,
            data: {
              shipmentId: shipment._id,
              orderId: order._id,
              productId: product._id
            }
          }));
          await Notification.insertMany(notifications);
        }
      }
    }

    if (requestedStatus === "Accepted by Farmer") {
      await Notification.create({
        recipient: order.buyer,
        type: "order_accepted",
        title: "Order accepted by farmer",
        message: "Your order has been accepted and is waiting for shipment assignment.",
        data: { orderId: order._id, productId: product._id },
      });
    }

    res.status(200).json({ success: true, order: buildFarmerOrderView(await order.populate(["buyer", "product"])) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "fullName email phone address")
      .populate("product", "productName price unit location farmer")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateFarmerOrderStatus,
  getAllOrders,
};