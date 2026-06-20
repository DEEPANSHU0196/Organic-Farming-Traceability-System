import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, ArrowRight, Star } from 'lucide-react';

const initialWishlist = [
  { id: 1, name: 'Organic Basmati Rice', price: '₹180/kg', originalPrice: '₹220/kg', rating: 4.9, reviews: 124, emoji: '🍚', farmer: 'Patel Agro', badge: 'Organic', inStock: true },
  { id: 2, name: 'Alphonso Mangoes', price: '₹320/kg', originalPrice: '₹380/kg', rating: 4.8, reviews: 89, emoji: '🥭', farmer: 'Konkan Orchards', badge: 'Premium', inStock: true },
  { id: 3, name: 'Cold-Pressed Mustard Oil', price: '₹340/5L', originalPrice: '₹400/5L', rating: 4.7, reviews: 56, emoji: '🫙', farmer: 'Haryana Mills', badge: 'Natural', inStock: false },
  { id: 4, name: 'Fresh Pomegranate', price: '₹120/kg', originalPrice: '₹150/kg', rating: 4.6, reviews: 41, emoji: '🍎', farmer: 'Nashik Farms', badge: 'Fresh', inStock: true },
  { id: 5, name: 'Turmeric Powder', price: '₹280/kg', originalPrice: '₹320/kg', rating: 4.9, reviews: 203, emoji: '🧡', farmer: 'Erode Spices', badge: 'Certified', inStock: true },
  { id: 6, name: 'A2 Cow Ghee', price: '₹950/500g', originalPrice: '₹1100/500g', rating: 5.0, reviews: 78, emoji: '🍯', farmer: 'Gir Gaushala', badge: 'A2', inStock: false },
];

export default function BuyerWishlist({ onBrowse }) {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [addedToCart, setAddedToCart] = useState(null);

  const removeItem = (id) => setWishlist((w) => w.filter((item) => item.id !== id));

  const addToCart = (id) => {
    setAddedToCart(id);
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
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <div className="text-6xl mb-4">💝</div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Your wishlist is empty</h3>
          <p className="text-slate-500 text-sm mb-6">Save products you love to buy them later</p>
          <button
            onClick={onBrowse}
            className="px-6 py-3 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
          >
            Discover Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {wishlist.map((item, i) => (
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
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center relative">
                <span className="text-6xl">{item.emoji}</span>
                {!item.inStock && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">Out of Stock</span>
                  </div>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-400 hover:text-red-600 hover:shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <Heart size={15} fill="currentColor" />
                </button>
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">{item.badge}</span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h4 className="font-semibold text-slate-800 text-sm leading-snug">{item.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">by {item.farmer}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star size={11} fill="#f59e0b" className="text-amber-400" />
                  <span className="text-xs text-slate-600">{item.rating} ({item.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-slate-800">{item.price}</span>
                  <span className="text-xs text-slate-400 line-through">{item.originalPrice}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart(item.id)}
                  disabled={!item.inStock}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: addedToCart === item.id ? '#dcfce7' : item.inStock ? '#0ea5e9' : '#f1f5f9',
                    color: addedToCart === item.id ? '#16a34a' : item.inStock ? 'white' : '#94a3b8',
                  }}
                >
                  <ShoppingCart size={13} />
                  {addedToCart === item.id ? 'Added to Cart ✓' : item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
