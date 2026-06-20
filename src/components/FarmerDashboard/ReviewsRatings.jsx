import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ThumbsUp, MessageCircle, Send, TrendingUp, Award, Users, Filter } from 'lucide-react';

/* ─── Dummy Data ─────────────────────────────────────────── */
const REVIEWS_DATA = [
  {
    id: 1,
    buyer: 'Rajesh Kumar',
    rating: 5,
    date: '10 Jun 2026',
    review: 'Excellent quality wheat! The grains are clean, well-sorted and packed perfectly. Highly recommended for bulk purchases. Will definitely order again next season.',
    product: 'Premium Wheat',
    avatar: 'RK',
    avatarColor: 'from-emerald-400 to-green-600',
    helpful: 24,
    replied: false,
    type: 'positive',
  },
  {
    id: 2,
    buyer: 'Priya Sharma',
    rating: 4,
    date: '8 Jun 2026',
    review: 'Good quality rice, very fast delivery. Minor issue with packaging — one bag had a small tear — but the product itself was fresh and aromatic. Overall satisfied.',
    product: 'Basmati Rice',
    avatar: 'PS',
    avatarColor: 'from-sky-400 to-blue-500',
    helpful: 18,
    replied: true,
    replyText: 'Thank you Priya! We have improved our packaging process. Looking forward to your next order! 🙏',
    type: 'positive',
  },
  {
    id: 3,
    buyer: 'Amit Singh',
    rating: 5,
    date: '5 Jun 2026',
    review: 'Pure mustard oil — no mixing, no adulteration. Fresh and authentic taste. My family has been using it for two months now and we love it. A+++',
    product: 'Yellow Mustard',
    avatar: 'AS',
    avatarColor: 'from-amber-400 to-orange-500',
    helpful: 32,
    replied: false,
    type: 'positive',
  },
  {
    id: 4,
    buyer: 'Deepak Patel',
    rating: 3,
    date: '2 Jun 2026',
    review: 'Product quality is decent but packaging could be much better to prevent moisture entry. Two bags had slight dampness. Hope the farmer addresses this.',
    product: 'Organic Corn',
    avatar: 'DP',
    avatarColor: 'from-violet-400 to-purple-600',
    helpful: 12,
    replied: false,
    type: 'critical',
  },
  {
    id: 5,
    buyer: 'Sunita Mehra',
    rating: 5,
    date: '30 May 2026',
    review: 'Outstanding turmeric! Deep yellow color, strong aroma — clearly organically grown. Made my curries taste so much better. Will be a repeat customer.',
    product: 'Organic Turmeric',
    avatar: 'SM',
    avatarColor: 'from-rose-400 to-pink-600',
    helpful: 41,
    replied: false,
    type: 'positive',
  },
  {
    id: 6,
    buyer: 'Karan Mehta',
    rating: 2,
    date: '25 May 2026',
    review: 'Delivery was delayed by 5 days and there was no communication. Product quality is okay, but the logistics and updates need serious improvement.',
    product: 'Chana Dal',
    avatar: 'KM',
    avatarColor: 'from-slate-400 to-slate-600',
    helpful: 8,
    replied: false,
    type: 'critical',
  },
  {
    id: 7,
    buyer: 'Nisha Verma',
    rating: 4,
    date: '20 May 2026',
    review: 'Great toor dal — clean and uniform lentils. Cooked well and tasted fresh. Delivery was on time. Slightly pricier than market but quality justifies it.',
    product: 'Toor Dal',
    avatar: 'NV',
    avatarColor: 'from-teal-400 to-cyan-600',
    helpful: 15,
    replied: true,
    replyText: 'Thank you Nisha for the kind words! We take pride in quality over quantity. 🌾',
    type: 'positive',
  },
];

/* ─── Helpers ────────────────────────────────────────────── */
function StarRow({ rating, size = 16, interactive = false, onSet }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onSet?.(i)}
          className={`transition-colors ${interactive ? 'cursor-pointer' : ''} ${
            i <= (hover || rating)
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-200 fill-slate-200'
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Summary Card ───────────────────────────────────────── */
function SummaryCard({ reviews }) {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const avgFixed = avg.toFixed(1);
  const counts = [5, 4, 3, 2, 1].map((n) => reviews.filter((r) => r.rating === n).length);
  const total = reviews.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center py-8 px-6 bg-gradient-to-br from-emerald-50 to-green-50">
          <div className="text-6xl font-black text-emerald-600 leading-none mb-2">{avgFixed}</div>
          <StarRow rating={Math.round(avg)} size={20} />
          <p className="text-sm text-slate-500 mt-3 font-medium">out of 5.0</p>
          <p className="text-xs text-slate-400 mt-1">Based on {total} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="md:col-span-2 p-6 flex flex-col justify-center gap-3">
          {[5, 4, 3, 2, 1].map((star, idx) => {
            const count = counts[idx];
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 flex-shrink-0">
                  <span className="text-xs font-semibold text-slate-600 w-3">{star}</span>
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: idx * 0.08, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: pct > 60 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 w-6 text-right flex-shrink-0">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 border-t border-slate-100 divide-x divide-slate-100">
        {[
          { icon: Award, label: 'Avg Rating', value: avgFixed, color: '#22c55e' },
          { icon: Users, label: 'Total Reviews', value: total, color: '#38bdf8' },
          { icon: TrendingUp, label: 'Positive', value: `${Math.round((reviews.filter(r => r.rating >= 4).length / total) * 100)}%`, color: '#a78bfa' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex flex-col items-center py-4 gap-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-1" style={{ background: color + '18' }}>
              <Icon size={15} style={{ color }} />
            </div>
            <p className="text-lg font-bold text-slate-800">{value}</p>
            <p className="text-[11px] text-slate-400 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Single Review Card ─────────────────────────────────── */
function ReviewCard({ review, idx }) {
  const [liked, setLiked] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitted, setSubmitted] = useState(review.replied || false);
  const [submittedText, setSubmittedText] = useState(review.replyText || '');

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setSubmittedText(replyText.trim());
    setSubmitted(true);
    setReplying(false);
    setReplyText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm`}
          >
            {review.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm">{review.buyer}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <StarRow rating={review.rating} size={13} />
              <span className="text-xs text-slate-400">{review.date}</span>
            </div>
          </div>
        </div>
        {/* Product Badge */}
        <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          {review.product}
        </span>
      </div>

      {/* Review Text */}
      <p className="text-sm text-slate-600 leading-relaxed">{review.review}</p>

      {/* Farmer Reply */}
      {submitted && submittedText && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            You
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-800 mb-1">Your reply</p>
            <p className="text-sm text-emerald-700">{submittedText}</p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-slate-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            liked ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'
          }`}
        >
          <ThumbsUp size={14} className={liked ? 'fill-emerald-600' : ''} />
          Helpful ({review.helpful + (liked ? 1 : 0)})
        </motion.button>

        {!submitted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setReplying((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-600 transition-colors"
          >
            <MessageCircle size={14} />
            {replying ? 'Cancel' : 'Reply'}
          </motion.button>
        )}

        {/* Rating indicator chip */}
        <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          review.rating >= 4
            ? 'bg-emerald-100 text-emerald-700'
            : review.rating === 3
            ? 'bg-amber-100 text-amber-700'
            : 'bg-red-100 text-red-600'
        }`}>
          {review.rating >= 4 ? '😊 Positive' : review.rating === 3 ? '😐 Neutral' : '😔 Critical'}
        </span>
      </div>

      {/* Reply Box */}
      <AnimatePresence>
        {replying && !submitted && (
          <motion.div
            key="reply-box"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-1 space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a professional reply to this review..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none transition-all"
              />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={13} />
                  Post Reply
                </motion.button>
                <button
                  onClick={() => { setReplying(false); setReplyText(''); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Export ────────────────────────────────────────── */
const FILTER_TABS = [
  { id: 'all', label: 'All Reviews' },
  { id: 'positive', label: 'Positive (4–5 ★)' },
  { id: 'critical', label: 'Critical (1–3 ★)' },
];

export default function ReviewsRatings() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'positive') return REVIEWS_DATA.filter((r) => r.rating >= 4);
    if (activeFilter === 'critical') return REVIEWS_DATA.filter((r) => r.rating <= 3);
    return REVIEWS_DATA;
  }, [activeFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Reviews &amp; Ratings</h2>
          <p className="text-sm text-slate-500 mt-0.5">See what your buyers are saying about your products</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Filter size={13} />
          <span>{filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} shown</span>
        </div>
      </div>

      {/* Summary Card */}
      <SummaryCard reviews={REVIEWS_DATA} />

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <AnimatePresence mode="wait">
        {filteredReviews.length > 0 ? (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filteredReviews.map((review, idx) => (
              <ReviewCard key={review.id} review={review} idx={idx} />
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Star size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700">No reviews here yet</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xs">
              {activeFilter === 'positive'
                ? 'No 4★ or 5★ reviews yet. Keep up the great work!'
                : 'No critical reviews. Your buyers are satisfied!'}
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-5 px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              View All Reviews
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
