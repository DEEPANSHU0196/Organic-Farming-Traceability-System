const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post(
  "/",
  protect,
  upload.single("image"),
  addProduct
);

router.get("/all", getAllProducts);

router.get("/", protect, getMyProducts);

router.get("/:id", protect, getProductById);

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateProduct
);

router.delete("/:id", protect, deleteProduct);

module.exports = router;