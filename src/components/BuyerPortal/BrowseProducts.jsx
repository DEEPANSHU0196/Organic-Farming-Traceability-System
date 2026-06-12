import { motion } from 'motion/react';
import { Search, Filter, Star, MapPin, Leaf } from 'lucide-react';
import { useState } from 'react';
import { useBuyer } from '../../contexts/BuyerContext';

export default function BrowseProducts({ onProductSelect }) {
  const { availableProducts, filterProducts, searchProducts } = useBuyer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Wheat', 'Rice', 'Mustard', 'Soybean', 'Corn', 'Cotton'];

  let filteredProducts = availableProducts;

  if (searchQuery) {
    filteredProducts = searchProducts(searchQuery);
  } else {
    filteredProducts = filterProducts(
      selectedCategory !== 'All' ? selectedCategory : null,
      maxPrice,
      minRating
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Browse Products</h1>
        <p className="text-accent-muted">Discover products directly from farmers</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md border border-surface-alt p-4">
        <div className="flex items-center gap-3 bg-surface-alt rounded-lg px-4 py-3">
          <Search size={20} className="text-accent" />
          <input
            type="text"
            placeholder="Search by product name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-primary placeholder-accent-muted"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md border border-surface-alt p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-primary flex items-center gap-2">
            <Filter size={18} />
            Filters
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-accent hover:text-primary transition-colors text-sm"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-surface-alt"
          >
            {/* Category */}
            <div>
              <label className="text-sm text-accent-muted mb-2 block font-semibold">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-sm text-accent-muted mb-2 block font-semibold">
                Max Price: ₹{maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm text-accent-muted mb-2 block font-semibold">
                Minimum Rating: {minRating.toFixed(1)} ⭐
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onProductSelect(product)}
            >
              {/* Product Image */}
              <div className="h-40 bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center text-6xl relative overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="group-hover:scale-110 transition-transform duration-300"
                >
                  {product.image}
                </motion.div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-primary">{product.rating}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">{product.name}</h3>
                  <p className="text-xs text-accent-muted flex items-center gap-1">
                    <MapPin size={12} />
                    {product.farmerName} - {product.farmLocation}
                  </p>
                </div>

                <p className="text-sm text-accent-muted">{product.category}</p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface-alt p-2 rounded">
                    <p className="text-xs text-accent-muted">Price</p>
                    <p className="font-bold text-primary">₹{product.price}</p>
                  </div>
                  <div className="bg-surface-alt p-2 rounded">
                    <p className="text-xs text-accent-muted">Available</p>
                    <p className="font-bold text-primary">{product.quantity} {product.unit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-accent-muted">
                  <Leaf size={12} className="text-emerald-600" />
                  <span>{product.certification}</span>
                  <span>•</span>
                  <span>{product.reviews} reviews</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductSelect(product);
                  }}
                  className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-accent-muted text-lg">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
