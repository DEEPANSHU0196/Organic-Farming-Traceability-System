const express = require("express");

const router = express.Router();

const {
  generateProductQR
} = require("../controllers/qrController");

const {
  protect
} = require("../middleware/authMiddleware");


// Generate Product QR

router.post(
  "/generate/:id",
  protect,
  generateProductQR
);


module.exports = router;