import { motion } from 'motion/react';
import { Star, Send, MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useBuyer } from '../../contexts/BuyerContext';

export default function ReviewsRatings() {
  const { availableProducts, addReview, removeReview, getProductReviews, buyerProfile } = useBuyer();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const renderProductImage = (image, className) => {
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:image/'))) {
      return <img src={image} alt="Product" className={className} />;
    }

    return <span className={className}>{image || '🌾'}</span>;
  };

  const handleSubmitReview = () => {
    if (comment.trim()) {
      addReview(selectedProduct.id, {
        rating,
        comment,
        buyerName: buyerProfile?.name || 'You',
        productName: selectedProduct.name,
      });
      setComment('');
      setRating(5);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedProduct(null);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Ratings & Reviews</h1>
        <p className="text-accent-muted">Share your experience with products you purchased</p>
      </div>

      {selectedProduct ? (
        // Review Form
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-md border border-surface-alt p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Leave a Review</h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-accent-muted hover:text-primary transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Product Display */}
          <div className="bg-surface-alt rounded-lg p-4 mb-6 flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-lg bg-white flex items-center justify-center">
              {renderProductImage(selectedProduct.image, 'h-full w-full object-cover')}
            </div>
            <div>
              <h3 className="font-bold text-primary">{selectedProduct.name}</h3>
              <p className="text-sm text-accent-muted">{selectedProduct.category}</p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-emerald-500 text-4xl mb-4"
              >
                ✓
              </motion.div>
              <p className="text-primary font-semibold">Thank you for your review!</p>
              <p className="text-accent-muted text-sm">Your feedback helps other buyers</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Rating */}
              <div>
                <label className="text-sm font-semibold text-primary mb-3 block">Rating</label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        className="p-1 transition-colors"
                      >
                        <Star
                          size={32}
                          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      </motion.button>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-primary">{rating}.0</span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="text-sm font-semibold text-primary mb-2 block">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="w-full p-3 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500 resize-none"
                  rows="5"
                />
                <p className="text-xs text-accent-muted mt-2">{comment.length}/500 characters</p>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitReview}
                disabled={!comment.trim()}
                className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Submit Review
              </motion.button>
            </div>
          )}
        </motion.div>
      ) : (
        // Product List for Reviewing
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableProducts.map((product, idx) => {
            const productReviews = getProductReviews(product.id);
            const alreadyReviewed = productReviews.some(r => r.buyerName === buyerProfile?.name);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="h-40 bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center text-6xl">
                  {renderProductImage(product.image, 'h-full w-full object-cover')}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-primary mb-1">{product.name}</h3>
                    <p className="text-xs text-accent-muted">{product.category}</p>
                  </div>

                  {/* Current Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-primary">{product.rating}</span>
                    <span className="text-xs text-accent-muted">({product.reviews})</span>
                  </div>

                  {/* Reviews Stats */}
                  <div className="bg-surface-alt rounded-lg p-3">
                    <p className="text-xs text-accent-muted mb-1">Customer Reviews</p>
                    <p className="font-semibold text-primary">{productReviews.length} reviews</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {alreadyReviewed ? (
                      <div className="flex gap-2 w-full">
                        <button
                          className="flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 bg-gray-200 text-gray-600 cursor-not-allowed"
                          disabled
                        >
                          <MessageSquare size={16} />
                          Reviewed
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const myReview = productReviews.find(r => r.buyerName === buyerProfile?.name);
                            if (myReview) {
                              removeReview(myReview._id || myReview.id, product.id);
                            }
                          }}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Remove Review"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedProduct(product)}
                        className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        <MessageSquare size={16} />
                        Leave Review
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
