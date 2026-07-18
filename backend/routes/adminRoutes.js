const express = require("express");

const router = express.Router();

const {
  getAllProductsAdmin,
  updateProductStatus,
} = require("../controllers/adminController");

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


module.exports = router;