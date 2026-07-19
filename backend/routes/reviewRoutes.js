const express = require("express");
const { addReview, getProductReviews, deleteReview, getAllReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, addReview).get(getAllReviews);
router.route("/product/:productId").get(getProductReviews);
router.route("/:id").delete(protect, deleteReview);

module.exports = router;
