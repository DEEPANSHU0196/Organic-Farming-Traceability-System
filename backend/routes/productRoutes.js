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

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/test", (req, res) => {
  res.send("Products route working");
});

router.post("/", protect, authorizeRoles("farmer"), upload.single("image"), addProduct);
router.get("/all", protect, authorizeRoles("farmer", "buyer", "transporter", "admin"), getAllProducts);
router.get("/", protect, authorizeRoles("farmer"), getMyProducts);
router.get("/:id", protect, authorizeRoles("farmer", "buyer", "transporter", "admin"), getProductById);
router.put("/:id", protect, authorizeRoles("farmer", "admin"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorizeRoles("farmer", "admin"), deleteProduct);

module.exports = router;