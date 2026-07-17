const express = require("express");
const router = express.Router();

const {
  createShipment,
  getMyShipments,
  updateShipment,
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

// Update shipment
router.put(
  "/:id",
  protect,
  updateShipment
);

module.exports = router;