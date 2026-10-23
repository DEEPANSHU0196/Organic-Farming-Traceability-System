import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../contexts/ToastContext';
import { X, ShoppingCart, Star, MapPin, Leaf, Check, Calendar, Heart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuyer } from '../../contexts/BuyerContext';

export default function ProductDetails({ product, onClose, onAddToCart }) {
  const { addToCart, getProductReviews, toggleWishlist, isInWishlist } = useBuyer();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const productReviews = getProductReviews(product.id);

  const renderProductImage = (image, className) => {
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:image/'))) {
      return <img src={image} alt="Product" className={className} />;
    }

    return <span className={className}>{image || '🌾'}</span>;
  };

  const [added, setAdded] = useState(false);
  const toast = useToast();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onAddToCart?.();
    setAdded(true);
    toast(`${quantity} × ${product.name} added to your cart`, { title: 'Added to cart' });
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg p-8 flex flex-col items-center justify-center min-h-80">
              <div className="mb-4 w-full flex items-center justify-center overflow-hidden rounded-2xl">
                {renderProductImage(product.image, 'max-h-80 w-auto object-contain')}
              </div>
              <div className="flex items-center gap-2 text-center">
                <Leaf size={16} className="text-emerald-600" />
                <span className="font-semibold text-emerald-700">{product.certification}</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              {/* Farmer Info */}
              <div className="bg-surface-alt rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" />
                  Farm Information
                </h3>
                <p className="text-sm text-accent-muted mb-1">{product.farmerName}</p>
                <p className="text-sm font-medium text-primary">{product.farmLocation}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-primary">{product.rating}</span>
                </div>
                <p className="text-sm text-accent-muted">({product.reviews} reviews)</p>
              </div>

              {/* Price & Availability */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-accent-muted mb-1">Price per {product.unit}</p>
                  <p className="text-3xl font-bold text-emerald-600">₹{product.price}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check size={16} className="text-emerald-600" />
                  <span className="text-primary">
                    {product.quantity} {product.unit} available
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border border-surface-alt rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="px-4 py-2 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-accent-muted ml-2">
                    Total: ₹{product.price * quantity}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  animate={added ? { scale: [1, 1.06, 1] } : {}}
                  className={`relative flex-1 min-w-[140px] overflow-hidden px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-white ${added ? 'bg-leaf' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span key="added" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} className="flex items-center gap-2">
                        <Check size={20} strokeWidth={3} /> Added
                      </motion.span>
                    ) : (
                      <motion.span key="add" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} className="flex items-center gap-2">
                        <ShoppingCart size={20} /> Add to Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/trace/${product.id || product._id}`)}
                  className="px-6 py-3 border-2 border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={18} />
                  Traceability
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWishlist(product)}
                  className="p-3 border-2 border-surface-alt rounded-lg text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center"
                >
                  <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-surface-alt pt-6">
            <div className="flex gap-4 mb-6 border-b border-surface-alt">
              {['details', 'origin', 'history', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-emerald-500'
                      : 'text-accent-muted hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Description</h4>
                  <p className="text-accent-muted">{product.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-accent-muted mb-1">Category</p>
                    <p className="font-semibold text-primary">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-accent-muted mb-1">Unit</p>
                    <p className="font-semibold text-primary">{product.unit}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Origin Tab */}
            {activeTab === 'origin' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-surface-alt rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <MapPin size={18} className="text-emerald-600" />
                    Product Origin
                  </h4>
                  <p className="text-accent-muted">{product.origin}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-700">
                    ✓ Directly sourced from farmers
                  </p>
                  <p className="text-sm text-emerald-700">
                    ✓ {product.certification} certified
                  </p>
                  <p className="text-sm text-emerald-700">
                    ✓ No middlemen involved
                  </p>
                </div>
                {product.qrCode && (
                  <div className="bg-white border border-surface-alt rounded-lg p-4 flex flex-col items-center mt-4">
                    <h4 className="font-semibold text-primary mb-3">Traceability QR Code</h4>
                    <img src={product.qrCode} alt="Traceability QR Code" className="w-40 h-40 object-contain border border-surface-alt rounded-lg p-2 shadow-sm" />
                    <p className="text-xs text-accent-muted mt-2 text-center max-w-xs">
                      Scan this QR code to verify the product's origin and complete journey.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2 mb-4">
                  <Calendar size={18} className="text-emerald-600" />
                  Product Journey
                </h4>
                <div className="space-y-3">
                  {product.history.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2"></div>
                        {idx < product.history.length - 1 && (
                          <div className="w-0.5 h-12 bg-emerald-200 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-accent-muted">{event.date}</p>
                        <p className="font-semibold text-primary">{event.event}</p>
                        <p className="text-sm text-accent-muted">{event.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h4 className="font-semibold text-primary mb-4">
                  Customer Reviews ({productReviews.length})
                </h4>
                {productReviews.length > 0 ? (
                  <div className="space-y-4">
                    {productReviews.slice(0, 5).map(review => (
                      <div key={review.id} className="border border-surface-alt rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-primary">{review.buyerName}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-accent-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-accent-muted">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-accent-muted">No reviews yet. Be the first to review!</p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
