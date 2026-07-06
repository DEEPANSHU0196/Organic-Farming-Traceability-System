const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// Get Logged-in User Profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

module.exports = router;