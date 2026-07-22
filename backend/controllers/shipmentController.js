const Shipment = require("../models/Shipment");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Notification = require("../models/Notification");

const SHIPMENT_STATUSES = [
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
];

const shipmentPopulate = [
  { path: "transporter", select: "fullName email phone" },
  {
    path: "order",
    populate: [
      { path: "buyer", select: "fullName email phone address" },
      { path: "product", populate: { path: "farmer", select: "fullName email phone address" } },
    ],
  },
];

const notifyParticipants = async (shipment, type, title, message) => {
  const recipients = [shipment.order?.buyer?._id, shipment.order?.product?.farmer?._id].filter(Boolean);
  if (recipients.length) {
    await Notification.insertMany(recipients.map((recipient) => ({
      recipient,
      type,
      title,
      message,
      data: { shipmentId: shipment._id, orderId: shipment.order?._id, productId: shipment.order?.product?._id },
    })));
  }
};

const createShipment = async (req, res) => {
  try {
    if (req.user.role !== "transporter") {
      return res.status(403).json({ success: false, message: "Only transporters can create shipments" });
    }
    const order = await Order.findById(req.body.order).populate("product");
    if (!order || order.status !== "Accepted by Farmer") {
      return res.status(400).json({ success: false, message: "Only accepted orders can be assigned for shipment" });
    }
    const shipment = await Shipment.findOneAndUpdate(
      { order: order._id },
      { $setOnInsert: {
        order: order._id,
        transporter: req.user._id,
        trackingId: `TRK-${order._id.toString().slice(-8).toUpperCase()}`,
        currentLocation: order.product?.location || "Farm",
        status: "Awaiting Driver Assignment",
      } },
      { new: true, upsert: true }
    ).populate(shipmentPopulate);

    res.status(201).json({ success: true, shipment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAvailableShipments = async (req, res) => {
  try {
    if (req.user.role !== "transporter") {
      return res.status(403).json({ success: false, message: "Only transporters can view available shipments" });
    }
    const shipments = await Shipment.find({ transporter: null, status: "Pending Acceptance" })
      .populate(shipmentPopulate)
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, shipments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const acceptShipmentRequest = async (req, res) => {
  try {
    if (req.user.role !== "transporter") {
      return res.status(403).json({ success: false, message: "Only transporters can accept shipments" });
    }
    
    const shipment = await Shipment.findById(req.params.id).populate("order");
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }
    if (shipment.transporter) {
      return res.status(400).json({ success: false, message: "This shipment has already been claimed" });
    }

    shipment.transporter = req.user._id;
    shipment.status = "Awaiting Driver Assignment";
    
    // Sync with product traceability
    if (shipment.order) {
      const product = await Product.findById(shipment.order.product?._id || shipment.order.product);
      if (product) {
        product.shipment.transporter = req.user._id;
        product.shipment.status = "Awaiting Driver Assignment";
        product.shipment.updates.push({
          stage: "Transporter Assigned",
          status: "Awaiting Driver Assignment",
          date: new Date(),
          location: product.shipment.currentLocation || "Farm",
          description: `Transporter claimed: ${req.user.fullName}`,
          icon: "CheckCircle"
        });
        await product.save({ runValidators: false });
      }
    }
    
    await shipment.save();
    
    // Notify farmer and buyer
    await notifyParticipants(
      await shipment.populate(shipmentPopulate),
      "shipment_claimed",
      "Transporter Claimed Delivery",
      `${req.user.fullName} has accepted the delivery request and will assign a driver soon.`
    );
    
    res.status(200).json({ success: true, shipment: await shipment.populate(shipmentPopulate) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getMyShipments = async (req, res) => {
  try {
    let filter = { transporter: req.user._id };
    if (req.user.role === "buyer") {
      filter = { order: { $in: await Order.find({ buyer: req.user._id }).distinct("_id") } };
    } else if (req.user.role === "farmer") {
      const productIds = await Product.find({ farmer: req.user._id }).distinct("_id");
      filter = { order: { $in: await Order.find({ product: { $in: productIds } }).distinct("_id") } };
    }

    const shipments = await Shipment.find(filter).populate(shipmentPopulate).sort({ updatedAt: -1 });

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
      const allowedRoles = ["transporter", "farmer", "buyer"];
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Unauthorized to update shipment status" });
      }

      if (!SHIPMENT_STATUSES.includes(req.body.status)) {
        return res.status(400).json({ success: false, message: "Invalid shipment status" });
      }

      if (req.user.role === "farmer" && req.body.status !== "Picked Up from Farm") {
        return res.status(403).json({ success: false, message: "Farmers can only confirm handover (Picked Up from Farm)" });
      }
      if (req.user.role === "buyer" && req.body.status !== "Delivered") {
        return res.status(403).json({ success: false, message: "Buyers can only confirm receipt (Delivered)" });
      }
      if (req.user.role === "transporter" && !["In Transit", "Out for Delivery", "Rejected"].includes(req.body.status)) {
        return res.status(403).json({ success: false, message: "Transporters can only update to In Transit, Out for Delivery, or Rejected" });
      }

      let query = { _id: req.params.id };
      if (req.user.role === "transporter") {
        query.transporter = req.user._id;
      } else if (req.user.role === "buyer") {
        const orders = await Order.find({ buyer: req.user._id }).distinct("_id");
        query.order = { $in: orders };
      } else if (req.user.role === "farmer") {
        const products = await Product.find({ farmer: req.user._id }).distinct("_id");
        const orders = await Order.find({ product: { $in: products } }).distinct("_id");
        query.order = { $in: orders };
      }

      const shipment = await Shipment.findOneAndUpdate(
        query,
        req.body,
        { new: true }
      ).populate(shipmentPopulate);

    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    // Sync with product traceability timeline
    if (shipment && shipment.order) {
      const order = shipment.order;
      if (order) {
        const product = await Product.findById(order.product?._id || order.product);
        if (product) {
          product.shipment.status = shipment.status;
          product.shipment.currentLocation = shipment.currentLocation || req.body.location || product.shipment.currentLocation;
          
          let stageDesc = 'Shipment update';
          let iconName = 'Truck';
          
          if (shipment.status === 'Picked Up from Farm') {
            stageDesc = 'Order Picked Up';
            iconName = 'Package';
          }
          if (shipment.status === 'In Transit') {
            stageDesc = 'In Transit';
            iconName = 'Truck';
          }
          if (shipment.status === 'Out for Delivery') {
            stageDesc = 'Out for Delivery';
            iconName = 'Truck';
          }
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

    const buyerId = shipment.order?.buyer?._id || shipment.order?.buyer;
    const farmerId = shipment.order?.product?.farmer?._id || shipment.order?.product?.farmer;
    await Notification.insertMany([buyerId, farmerId].filter(Boolean).map((recipient) => ({
      recipient,
      type: "shipment_status_updated",
      title: "Shipment status updated",
      message: `Shipment ${shipment.trackingId || ""} is now ${shipment.status}${req.body.currentLocation ? ` at ${req.body.currentLocation}` : ""}.`,
      data: { shipmentId: shipment._id, orderId: shipment.order?._id, productId: shipment.order?.product?._id },
    })));
    if (shipment.status === "Delivered") {
      await Order.findByIdAndUpdate(shipment.order._id, { status: "Completed" });
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

const assignDriver = async (req, res) => {
  try {
    if (req.user.role !== "transporter") {
      return res.status(403).json({ success: false, message: "Only transporters can assign drivers" });
    }
    const { driverName, driverContactNumber, vehicleNumber, estimatedDeliveryDate } = req.body;
    if (!driverName || !driverContactNumber || !vehicleNumber || !estimatedDeliveryDate) {
      return res.status(400).json({ success: false, message: "Driver name, contact, vehicle number, and estimated delivery date are required" });
    }
    const shipment = await Shipment.findOneAndUpdate(
      { _id: req.params.id, transporter: req.user._id },
      {
        $set: { driverName, driverContactNumber, vehicleNumber, estimatedDeliveryDate, status: "Driver Assigned" },
        $push: { updates: { status: "Driver Assigned", notes: "Driver assigned by transporter" } },
      },
      { new: true }
    ).populate(shipmentPopulate);
    if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });

    const buyerId = shipment.order?.buyer?._id || shipment.order?.buyer;
    const farmerId = shipment.order?.product?.farmer?._id || shipment.order?.product?.farmer;
    await Notification.insertMany([buyerId, farmerId].filter(Boolean).map((recipient) => ({
      recipient,
      type: "driver_assigned",
      title: "Driver assigned to your shipment",
      message: `${driverName} (${driverContactNumber}) will deliver your order in vehicle ${vehicleNumber}.`,
      data: { shipmentId: shipment._id, orderId: shipment.order?._id, productId: shipment.order?.product?._id },
    })));
    return res.status(200).json({ success: true, shipment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createShipment,
  getMyShipments,
  updateShipment,
  assignDriver,
  getAvailableShipments,
  acceptShipmentRequest,
};