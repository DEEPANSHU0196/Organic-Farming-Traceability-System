const express = require("express");
const router = express.Router();

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

router.post("/", protect, upload.single("image"), addProduct);
router.get("/", protect, getMyProducts);
router.get("/:id", protect, getProductById);
router.put("/:id", protect, upload.single("image"), updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;