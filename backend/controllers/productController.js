const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// =============================
// Upload Image From Buffer
// =============================
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// =============================
// Add New Product
// =============================
const addProduct = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await uploadFromBuffer(
        req.file.buffer
      );

      imageUrl = result.secure_url;
    }

    const {
      productName,
      category,
      quantity,
      price,
      location,
      description,
    } = req.body;

    const product = await Product.create({
      farmer: req.user._id,
      productName,
      category,
      quantity,
      price,
      location,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Products
// =============================
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmer", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Farmer Products
// =============================
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      farmer: req.user._id,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Product
// =============================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    ).populate("farmer", "fullName");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Product
// =============================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    if (
      product.farmer.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission",
      });
    }

    let imageUrl = product.image;

    if (req.file) {
      const result = await uploadFromBuffer(
        req.file.buffer
      );

      imageUrl = result.secure_url;
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          image: imageUrl,
        },
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Product
// =============================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    if (
      product.farmer.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};