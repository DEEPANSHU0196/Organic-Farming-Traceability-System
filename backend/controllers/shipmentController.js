const Shipment = require("../models/Shipment");
const Product = require("../models/Product");
const Order = require("../models/Order");

const createShipment = async (req, res) => {
  try {
    const shipment = await Shipment.create(req.body);

    res.status(201).json({
      success: true,
      shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ transporter: req.user._id })
      .populate({
        path: 'order',
        populate: [
          { path: 'buyer', select: 'fullName email phone address' },
          { path: 'product', populate: { path: 'farmer', select: 'fullName email phone address' } }
        ]
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      shipments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('order');

    // Sync with product traceability timeline
    if (shipment && shipment.order) {
      const order = await Order.findById(shipment.order);
      if (order) {
        const product = await Product.findById(order.product);
        if (product) {
          product.shipment.status = shipment.status;
          product.shipment.currentLocation = shipment.currentLocation || req.body.location || product.shipment.currentLocation;
          
          let stageDesc = 'Shipment update';
          let iconName = 'Truck';
          
          if (shipment.status === 'Picked Up') stageDesc = 'Order Picked Up';
          if (shipment.status === 'In Transit') stageDesc = 'In Transit';
          if (shipment.status === 'Delivered') {
            stageDesc = 'Delivered to Buyer';
            iconName = 'CheckCircle';
          }
          
          product.shipment.updates.push({
            stage: stageDesc,
            status: shipment.status,
            date: new Date(),
            location: product.shipment.currentLocation,
            description: req.body.notes || 'Status updated to ' + shipment.status,
            icon: iconName
          });
          
          await product.save({ runValidators: false });
        }
      }
    }

    res.status(200).json({
      success: true,
      shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createShipment,
  getMyShipments,
  updateShipment,
};