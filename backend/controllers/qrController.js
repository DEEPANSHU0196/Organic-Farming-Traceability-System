const QRCode = require("qrcode");
const Product = require("../models/Product");


const getFrontendBaseUrl = () =>
  process.env.FRONTEND_URL || "http://localhost:5175";


// ======================
// GENERATE PRODUCT QR
// ======================

const generateProductQR = async (
  req,
  res
) => {
  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    // Frontend trace page URL
    const traceUrl =
      new URL(
        `/trace/${product._id}`,
        getFrontendBaseUrl()
      ).toString();

    // Generate QR image
    const qrCode =
      await QRCode.toDataURL(
        traceUrl
      );

    // Save into DB
    product.qrCode =
      qrCode;

    product.traceabilityId =
      `TRACE-${product._id}`;

    await product.save();

    res.status(200).json({
      success: true,
      message:
        "QR Generated Successfully",

      traceabilityId:
        product.traceabilityId,

      traceUrl,

      qrCode,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};



// ======================
// GET QR DETAILS
// ======================

const getProductQR = async (
  req,
  res
) => {
  try {

    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      traceabilityId:
        product.traceabilityId,

      qrCode:
        product.qrCode,

      traceUrl:
        new URL(
          `/trace/${product._id}`,
          getFrontendBaseUrl()
        ).toString(),
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};



module.exports = {
  generateProductQR,
  getProductQR,
};