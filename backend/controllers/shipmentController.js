const Shipment = require("../models/Shipment");

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
    const shipments = await Shipment.find();

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
    const shipment =
      await Shipment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

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