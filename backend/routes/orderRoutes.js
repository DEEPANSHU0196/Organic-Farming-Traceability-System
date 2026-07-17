const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateFarmerOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.get("/my", protect, getMyOrders);
router.get("/farmer", protect, getFarmerOrders);
router.put("/farmer/:id", protect, updateFarmerOrderStatus);

module.exports = router;