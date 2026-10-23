const Product = require("../models/Product");
const Notification = require("../models/Notification");

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

    // Let the farmer know the outcome without blocking the response on it.
    const decision = String(status).toLowerCase();
    if (decision === "approved" || decision === "rejected") {
      Notification.create({
        recipient: product.farmer,
        type: decision === "approved" ? "product_approved" : "product_rejected",
        title: decision === "approved" ? "Batch approved" : "Batch needs changes",
        message: decision === "approved"
          ? `${product.name} is now live on the marketplace.`
          : `${product.name} was not approved. Check the details and resubmit.`,
        data: { productId: product._id },
      }).catch((err) => console.log("Approval notification failed:", err.message));
    }

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