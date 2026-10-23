const express = require("express");

const router = express.Router();

const {
  getAllProductsAdmin,
  updateProductStatus,
} = require("../controllers/adminController");
const ContactMessage = require("../models/ContactMessage");

const {
  protect,
} = require("../middleware/authMiddleware");


// Admin Middleware

const adminOnly = (req, res, next) => {

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin Access Only",
    });
  }

  next();
};


// Get all products
router.get(
  "/products",
  protect,
  adminOnly,
  getAllProductsAdmin
);


// Update product status
router.put(
  "/products/:id",
  protect,
  adminOnly,
  updateProductStatus
);


// Contact form inbox
router.get("/messages", protect, adminOnly, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load messages" });
  }
});

router.put("/messages/:id", protect, adminOnly, async (req, res) => {
  try {
    const status = ["new", "read", "replied"].includes(req.body?.status) ? req.body.status : "read";
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not update message" });
  }
});

module.exports = router;