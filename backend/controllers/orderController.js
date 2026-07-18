const Order = require("../models/Order");
const Product = require("../models/Product");
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

    res.status(200).json({ success: true, order: buildFarmerOrderView(await order.populate(["buyer", "product"])) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateFarmerOrderStatus,
};