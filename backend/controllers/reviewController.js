const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private (Buyer)
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment, buyerName } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if buyer has already reviewed
    const existingReview = await Review.findOne({ product: productId, buyer: req.user.id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      buyer: req.user.id,
      buyerName: buyerName || req.user.fullName || "Buyer",
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ success: false, message: "Failed to add review" });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to get reviews" });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to get all reviews" });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Buyer)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Make sure user owns review
    if (review.buyer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};
