const express = require("express");

const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  getProductTrace,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
} = require("../middleware/authMiddleware");

const upload =
  require("../middleware/upload");


// ======================
// ADD PRODUCT
// ======================

router.post(
  "/",
  protect,
  upload.single("image"),
  addProduct
);


// ======================
// GET ALL PRODUCTS
// ======================

router.get(
  "/all",
  getAllProducts
);


// ======================
// PUBLIC TRACEABILITY
// (KEEP THIS ABOVE /:id)
// ======================

router.get(
  "/trace/:id",
  getProductTrace
);


// ======================
// GET MY PRODUCTS
// ======================

router.get(
  "/",
  protect,
  getMyProducts
);


// ======================
// GET SINGLE PRODUCT
// ======================

router.get(
  "/:id",
  protect,
  getProductById
);


// ======================
// UPDATE PRODUCT
// ======================

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateProduct
);


// ======================
// DELETE PRODUCT
// ======================

router.delete(
  "/:id",
  protect,
  deleteProduct
);


module.exports = router;