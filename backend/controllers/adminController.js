const Product = require("../models/Product");

// Get all products
const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmer", "fullName email");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve or Reject Product
const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    product.status = status;

    await product.save();

    res.status(200).json({
      success: true,
      message:
        "Product Status Updated",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllProductsAdmin,
  updateProductStatus,
};