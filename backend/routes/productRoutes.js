const express = require("express");
const router = express.Router();
const authorize = require("../middleware/roleMiddleware");

const {
  addProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

console.log("addProduct:", typeof addProduct);
console.log("getMyProducts:", typeof getMyProducts);
console.log("getProductById:", typeof getProductById);
console.log("updateProduct:", typeof updateProduct);
console.log("deleteProduct:", typeof deleteProduct);
console.log("protect:", typeof protect);
console.log("upload:", typeof upload);
console.log("upload.single:", typeof upload.single);

// Test route
router.get("/test", (req, res) => {
  res.send("Products route working");
});

// Only farmers can add products
router.post(
  "/",
  protect,
  authorize("farmer"),
  upload.single("image"),
  addProduct
);

// Only farmers can view their products
router.get(
  "/",
  protect,
  authorize("farmer"),
  getMyProducts
);

// Anyone logged in can view one product
router.get(
  "/:id",
  protect,
  getProductById
);

// Only farmers can update
router.put(
  "/:id",
  protect,
  authorize("farmer"),
  upload.single("image"),
  updateProduct
);

// Only farmers can delete
router.delete(
  "/:id",
  protect,
  authorize("farmer"),
  deleteProduct
);

module.exports = router;