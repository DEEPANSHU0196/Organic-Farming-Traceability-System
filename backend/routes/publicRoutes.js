const express = require("express");
const router = express.Router();
const {
  getPlatformStats,
  submitContactMessage,
  getMandi,
  getFarmerProfile,
} = require("../controllers/publicController");

router.get("/stats", getPlatformStats);
router.post("/contact", submitContactMessage);
router.get("/mandi", getMandi);
router.get("/farmers/:id", getFarmerProfile);

module.exports = router;
