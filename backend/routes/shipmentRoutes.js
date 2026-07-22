const express = require("express");
const router = express.Router();

const {
  createShipment,
  getMyShipments,
  updateShipment,
  assignDriver,
  getAvailableShipments,
  acceptShipmentRequest,
} = require("../controllers/shipmentController");

const { protect } = require("../middleware/authMiddleware");

// Create shipment
router.post(
  "/",
  protect,
  createShipment
);

// Get transporter shipments
router.get(
  "/my",
  protect,
  getMyShipments
);

// Get available open requests
router.get(
  "/available",
  protect,
  getAvailableShipments
);

// Update shipment
router.put(
  "/:id",
  protect,
  updateShipment
);

router.put(
  "/:id/assign-driver",
  protect,
  assignDriver
);

router.put(
  "/:id/accept",
  protect,
  acceptShipmentRequest
);

module.exports = router;