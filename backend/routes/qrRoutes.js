const express = require("express");

const router =
  express.Router();

const {
  generateProductQR,
  getProductQR,
} = require(
  "../controllers/qrController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);


// Generate QR
router.post(
  "/generate/:id",
  protect,
  generateProductQR
);


// Get QR
router.get(
  "/:id",
  protect,
  getProductQR
);


module.exports =
  router;