import { motion } from 'motion/react';
import { Star, ThumbsUp, MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';

const reviews = [
  {
    id: 1,
    buyer: 'Rajesh Kumar',
    rating: 5,
    date: '2025-12-10',
    review: 'Excellent quality wheat! Highly recommended for bulk purchases.',
    product: 'Premium Wheat',
    avatar: '👨‍💼',
    helpful: 24,
  },
  {
    id: 2,
    buyer: 'Priya Sharma',
    rating: 4,
    date: '2025-12-08',
    review: 'Good quality rice, fast delivery. Minor packaging issue but overall satisfied.',
    product: 'Basmati Rice',
    avatar: '👩‍💼',
    helpful: 18,
  },
  {
    id: 3,
    buyer: 'Amit Singh',
    rating: 5,
    date: '2025-12-05',
    review: 'Pure mustard oil. No mixing with other oils. Fresh and authentic!',
    product: 'Yellow Mustard',
    avatar: '👨‍🌾',
    helpful: 32,
  },
  {
    id: 4,
    buyer: 'Deepak Patel',
    rating: 4,
    date: '2025-12-02',
    review: 'Good product but packaging could be better to prevent moisture.',
    product: 'Organic Corn',
    avatar: '👨‍💼',
    helpful: 12,
  },
];

export default function ReviewsRatings() {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((r) => r.rating === rating).length
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Reviews & Ratings</h1>
        <p className="text-accent-muted">Customer feedback and product ratings</p>
      </div>

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt p-6 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Overall Rating */}
        <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
          <div className="text-5xl font-bold text-emerald-600 mb-2">{averageRating}</div>
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.floor(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-surface-alt'}
              />
            ))}
          </div>
          <p className="text-sm text-accent-muted">Based on {reviews.length} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 space-y-3">
          {[5, 4, 3, 2, 1].map((rating, idx) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
                {[...Array(5 - rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-surface-alt" />
                ))}
              </div>
              <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(ratingCounts[idx] / reviews.length) * 100}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
              <div className="w-8 text-right text-sm font-medium text-primary">{ratingCounts[idx]}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg shadow-md border border-surface-alt p-6"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="text-3xl">{review.avatar}</div>
                <div className="flex-1">
                  <p className="font-bold text-primary">{review.buyer}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-surface-alt'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-accent-muted">{review.date}</span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                {review.product}
              </span>
            </div>

            {/* Review Content */}
            <p className="text-accent-muted mb-4">{review.review}</p>

            {/* Review Actions */}
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleHelpful(review.id)}
                className={`flex items-center gap-2 transition-colors ${
                  helpfulReviews[review.id]
                    ? 'text-emerald-600'
                    : 'text-accent-muted hover:text-emerald-600'
                }`}
              >
                <ThumbsUp size={16} />
                <span>Helpful ({review.helpful + (helpfulReviews[review.id] ? 1 : 0)})</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setReplyingTo(review.id)}
                className="flex items-center gap-2 text-accent-muted hover:text-emerald-600 transition-colors"
              >
                <MessageCircle size={16} />
                <span>Reply</span>
              </motion.button>
            </div>

            {/* Reply Box */}
            {replyingTo === review.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-surface-alt rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    className="flex-1 p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500 resize-none"
                    rows="2"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleReply(review.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                  >
                    <Send size={14} />
                    Post Reply
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1.5 border border-surface-alt rounded-lg text-sm font-medium hover:bg-surface-alt transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
