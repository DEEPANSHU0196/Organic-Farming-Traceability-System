const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateFarmerOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.get("/my", protect, getMyOrders);
router.get("/farmer", protect, authorizeRoles("farmer"), getFarmerOrders);
router.get("/", protect, authorizeRoles("admin"), getAllOrders);
router.put("/farmer/:id", protect, authorizeRoles("farmer"), updateFarmerOrderStatus);

module.exports = router;