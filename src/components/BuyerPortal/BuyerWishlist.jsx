import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, ArrowRight, Star } from 'lucide-react';
import { useBuyer } from '../../contexts/BuyerContext';
import EmptyState from '../../shared/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function BuyerWishlist({ onBrowse }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useBuyer();
  const [addedToCart, setAddedToCart] = useState(null);

  const removeItem = (product) => toggleWishlist(product);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Wishlist</h2>
          <p className="text-slate-500 text-sm mt-1">{wishlist.length} items saved for later</p>
        </div>
        {wishlist.length === 0 && (
          <button
            onClick={onBrowse}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
          >
            Browse Products <ArrowRight size={14} />
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white">
          <EmptyState
            icon={Heart}
            title="Nothing saved yet"
            body="Tap the heart on any product to keep it here for later."
            actionLabel="Discover produce"
            onAction={onBrowse || (() => navigate('/buyer-dashboard/browse'))}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {wishlist.map((item, i) => {
            const inStock = item.quantity > 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.06 }}
                layout
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Product image area */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center relative h-48 overflow-hidden">
                  {typeof item.image === 'string' && (item.image.startsWith('http') || item.image.startsWith('data:')) ? (
                    <img src={item.image} alt={item.name} className="max-h-full object-contain" />
                  ) : (
                    <span className="text-6xl">{item.image || '🌾'}</span>
                  )}
                  
                  {!inStock && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">Out of Stock</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeItem(item)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:text-red-700 hover:shadow-md transition-all opacity-100"
                  >
                    <Heart size={15} fill="currentColor" />
                  </button>
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">{item.certification || item.badge || 'Organic'}</span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-slate-800 text-sm leading-snug truncate">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">by {item.farmerName || item.farmer || 'Verified Farmer'}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star size={11} fill="#f59e0b" className="text-amber-400" />
                    <span className="text-xs text-slate-600">{item.rating || 4.5} ({item.reviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-slate-800">₹{item.price}/{item.unit}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAddToCart(item)}
                    disabled={!inStock}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: addedToCart === item.id ? '#dcfce7' : inStock ? '#0ea5e9' : '#f1f5f9',
                      color: addedToCart === item.id ? '#16a34a' : inStock ? 'white' : '#94a3b8',
                    }}
                  >
                    <ShoppingCart size={13} />
                    {addedToCart === item.id ? 'Added to Cart ✓' : inStock ? 'Add to Cart' : 'Out of Stock'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
