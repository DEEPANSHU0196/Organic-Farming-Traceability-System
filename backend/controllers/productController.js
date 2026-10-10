const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const QRCode = require("qrcode");
const { appendTraceBlock, verifyTraceChain } = require("../utils/traceBlockchain");
const { verifyOnChainTrace } = require("../utils/polygonTrace");


// ======================
// CLOUDINARY HELPERS
// ======================

const ensureCloudinaryConfig = () => {

  const hasConfig =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasConfig) {
    throw new Error(
      "Cloudinary credentials are missing."
    );
  }
};

const uploadFromBuffer = (buffer) => {

  return new Promise((resolve, reject) => {

    ensureCloudinaryConfig();

    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "products",
        },
        (error, result) => {

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    streamifier
      .createReadStream(buffer)
      .pipe(stream);

  });

};

const uploadFromBodyImage = async (image) => {

  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  ensureCloudinaryConfig();

  const result =
    await cloudinary.uploader.upload(
      image,
      {
        folder: "products",
      }
    );

  return result.secure_url;
};

const getFrontendBaseUrl = () =>
  process.env.FRONTEND_URL || "http://localhost:5175";

const buildTraceabilityUrl = (productId) =>
  new URL(`/trace/${productId}`, getFrontendBaseUrl()).toString();

const generateTraceabilityAssets = async (product) => {
  const traceUrl = buildTraceabilityUrl(product._id);
  const qrCode = await QRCode.toDataURL(traceUrl);
  const traceabilityId = `TRACE-${product._id}`;

  // Use findByIdAndUpdate to avoid triggering full schema validation
  await Product.findByIdAndUpdate(
    product._id,
    { qrCode, traceabilityId },
    { runValidators: false }
  );

  return {
    qrCode,
    traceabilityId,
    traceUrl,
  };
};


// ======================
// ADD PRODUCT
// ======================

const addProduct = async (req, res) => {

  try {

    let imageUrl = "";

    if (req.file) {

      const result =
        await uploadFromBuffer(
          req.file.buffer
        );

      imageUrl =
        result.secure_url;

    } else if (req.body.image) {

      imageUrl =
        await uploadFromBodyImage(
          req.body.image
        );
    }

    const farmerId =
      req.user?._id ||
      req.user?.id;

    if (!farmerId) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated",
      });
    }

    const product =
      await Product.create({

        farmer: farmerId,

        name:
          req.body.name ||
          req.body.productName,

        category:
          req.body.category,

        quantity:
          req.body.quantity,

        price:
          req.body.price,

        location:
          req.body.location,

        description:
          req.body.description,

        harvestDate:
          req.body.harvestDate,

        image:
          imageUrl,

      });

    await generateTraceabilityAssets(product);

    await appendTraceBlock({
      productId: product._id,
      eventType: "PRODUCT_REGISTERED",
      payload: {
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        harvestDate: product.harvestDate,
        location: product.location,
      },
      actor: req.user,
      idempotencyKey: `product-registration:${product._id}`,
    });

    const savedProduct = await Product.findById(product._id);

    res.status(201).json({
      success: true,
      message:
        "Product Added Successfully",
      product: savedProduct,
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
// GET ALL PRODUCTS
// ======================

const getAllProducts = async (
  req,
  res
) => {

  try {

    const products =
      await Product.find()
      .populate(
        "farmer",
        "fullName email phone address"
      );

    res.status(200).json({
      success: true,
      products,
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
// GET MY PRODUCTS
// ======================

const getMyProducts = async (
  req,
  res
) => {

  try {

    const products =
      await Product.find({
        farmer:
          req.user._id,
      });

    res.status(200).json({
      success: true,
      products,
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
// GET SINGLE PRODUCT
// ======================

const getProductById = async (
  req,
  res
) => {

  try {

    const product =
      await Product.findById(
        req.params.id
      )
      .populate(
        "farmer",
        "fullName email phone address"
      );

    if (!product) {

      return res.status(404).json({
        success: false,
        message:
          "Product Not Found",
      });

    }

    res.status(200).json({
      success: true,
      product,
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
// PUBLIC TRACEABILITY
// ======================

const getProductTrace =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        )
        .populate(
          "farmer",
          "fullName email phone address"
        )
        .populate(
          "shipment.transporter",
          "fullName email phone address role"
        );

      if (!product) {

        return res.status(404).json({
          success: false,
          message:
            "Product Not Found",
        });

      }

      const blockchain = await verifyTraceChain(product._id);
      const onChainVerification = await verifyOnChainTrace(product._id, blockchain.blocks);

      res.status(200).json({
        success: true,
        product,
        blockchain,
        onChainVerification,
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
// UPDATE PRODUCT
// ======================

const updateProduct =
  async (req, res) => {

    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {

        return res.status(404).json({
          success: false,
          message:
            "Product Not Found",
        });

      }

      let imageUrl =
        product.image;

      if (req.file) {

        const result =
          await uploadFromBuffer(
            req.file.buffer
          );

        imageUrl =
          result.secure_url;
      }

      const updated =
        await Product.findByIdAndUpdate(

          req.params.id,

          {
            ...req.body,

            name:
              req.body.name ||
              req.body.productName ||
              product.name,

            image:
              imageUrl,
          },

          {
            new: true,
          }

        );

      res.status(200).json({
        success: true,
        product:
          updated,
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
// DELETE PRODUCT
// ======================

const deleteProduct =
  async (req, res) => {

    try {

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Product Deleted",
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
  addProduct,
  getAllProducts,
  getMyProducts,
  getProductById,
  getProductTrace,
  updateProduct,
  deleteProduct,
  generateTraceabilityAssets,
};