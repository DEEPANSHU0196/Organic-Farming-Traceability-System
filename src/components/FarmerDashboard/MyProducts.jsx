import { motion } from 'motion/react';
import { Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Premium Wheat',
    category: 'Wheat',
    quantity: 500,
    unit: 'kg',
    price: 2500,
    status: 'Active',
    listed: '15 days ago',
    orders: 12,
    image: '🌾',
  },
  {
    id: 2,
    name: 'Basmati Rice',
    category: 'Rice',
    quantity: 300,
    unit: 'kg',
    price: 4500,
    status: 'Active',
    listed: '8 days ago',
    orders: 8,
    image: '🍚',
  },
  {
    id: 3,
    name: 'Yellow Mustard',
    category: 'Mustard',
    quantity: 150,
    unit: 'kg',
    price: 5500,
    status: 'Low Stock',
    listed: '22 days ago',
    orders: 15,
    image: '🌱',
  },
  {
    id: 4,
    name: 'Organic Corn',
    category: 'Corn',
    quantity: 0,
    unit: 'kg',
    price: 1800,
    status: 'Out of Stock',
    listed: '45 days ago',
    orders: 5,
    image: '🌽',
  },
];

export default function MyProducts() {
  const [view, setView] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Products</h1>
          <p className="text-accent-muted">Manage your listed products</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'bg-surface-alt text-accent'}`}
          >
            ⊞
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-emerald-100 text-emerald-600' : 'bg-surface-alt text-accent'}`}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="h-40 bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center text-6xl relative group">
                {product.image}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
                >
                  <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white rounded-full text-primary">
                    <Eye size={20} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-white rounded-full text-primary">
                    <Edit2 size={20} />
                  </motion.button>
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-primary">{product.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>

                <p className="text-sm text-accent-muted mb-3">{product.category}</p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="bg-surface-alt p-2 rounded">
                    <p className="text-accent-muted text-xs">Quantity</p>
                    <p className="font-bold text-primary">{product.quantity} {product.unit}</p>
                  </div>
                  <div className="bg-surface-alt p-2 rounded">
                    <p className="text-accent-muted text-xs">Price</p>
                    <p className="font-bold text-primary">₹{product.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-accent-muted mb-4 pb-4 border-b border-surface-alt">
                  <span>{product.orders} orders</span>
                  <span>{product.listed}</span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt border-b border-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Orders</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-surface-alt hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.image}</span>
                        <span className="font-medium text-primary">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-accent-muted">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">
                      {product.quantity} {product.unit}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{product.orders}</td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
                      >
                        <MoreVertical size={18} className="text-accent" />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
