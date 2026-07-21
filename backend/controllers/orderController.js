const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Shipment = require("../models/Shipment");
const Notification = require("../models/Notification");
const { buildFarmerOrderView } = require("../utils/orderUtils");

const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      buyer: req.user._id,
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
    }).populate("product").populate("buyer");

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
      .populate("product", "productName price unit location")
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
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const product = await Product.findById(order.product);
    if (!product || product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only manage your own orders" });
    }

    order.status = status;
    await order.save();

    // Auto-create shipment and assign a transporter when accepted
    if (status === 'Accepted') {
      const transporter = await User.findOne({ role: 'transporter' });
      if (transporter) {
        // Check if shipment already exists to avoid duplicates
        const existingShipment = await Shipment.findOne({ order: order._id });
        if (!existingShipment) {
          const shipment = await Shipment.create({
            order: order._id,
            transporter: transporter._id,
            status: 'Assigned',
            currentLocation: product.location || 'Farm'
          });

          // Also set the transporter in the product's shipment traceability
          product.shipment.transporter = transporter._id;
          product.shipment.status = 'Pending';
          product.shipment.updates.push({
            stage: 'Order Accepted',
            status: 'Pending',
            date: new Date(),
            location: product.location || 'Farm',
            description: 'Transporter assigned: ' + transporter.fullName,
            icon: 'CheckCircle'
          });
          await product.save({ runValidators: false });

          // Send notification to transporter
          await Notification.create({
            recipient: transporter._id,
            type: 'new_delivery',
            title: '🚚 New Delivery Assignment',
            message: `You have a new delivery to pick up: ${product.productName} from ${product.location}. Buyer: ${order.buyer.fullName}`,
            data: {
              shipmentId: shipment._id,
              orderId: order._id,
              productId: product._id
            }
          });
        }
      }
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