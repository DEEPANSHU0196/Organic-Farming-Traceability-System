import React, { useState, useEffect } from 'react';
import { SkeletonCards } from '../../shared/ui';
import { CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

const CATEGORY_EMOJIS = {
  vegetables: '🥦', fruits: '🍎', dairy: '🥛', grains: '🌾',
  spices: '🌶️', organic: '🌿', default: '🌱',
};

const ProductModeration = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/all');
        if (response?.data?.success) {
          const allProducts = (response.data.products || []).map(p => ({
            id: p._id,
            name: p.productName || 'Unknown Product',
            farmer: p.farmerName || p.farmer?.fullName || 'Verified Farmer',
            category: p.category || 'General',
            status: p.status === 'approved' ? 'Approved' : 'Pending',
            submittedDate: new Date(p.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
            image: p.image || CATEGORY_EMOJIS[(p.category || '').toLowerCase()] || CATEGORY_EMOJIS.default,
          }));
          setProducts(allProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const pendingCount = products.filter(p => p.status === 'Pending').length;

  const handleApprove = async (id) => {
    try {
      await api.put(`/products/${id}`, { status: 'approved' });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    } catch (err) {
      console.error('Failed to approve product:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/products/${id}`, { status: 'rejected' });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    } catch (err) {
      console.error('Failed to reject product:', err);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Pending') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
          <AlertCircle className="w-3 h-3" />
          <span>Pending</span>
        </div>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Rejected</span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Approved</span>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Product Moderation</h3>
            <p className="text-sm text-slate-500 mt-1">
              All products listed on the platform
            </p>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
            {loading ? '...' : `${pendingCount} Pending`}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="p-6"><SkeletonCards count={4} label="Loading products" /></div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center text-slate-400">No products found in the database.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
            >
              <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mb-4 text-6xl overflow-hidden">
                {(typeof product.image === 'string' && (product.image.startsWith('http://') || product.image.startsWith('https://') || product.image.startsWith('data:image/'))) ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{product.image}</span>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{product.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">by {product.farmer}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {product.category}
                  </span>
                  {getStatusIcon(product.status)}
                </div>
                <p className="text-xs text-slate-500">Submitted {product.submittedDate}</p>
                {product.status === 'Pending' && (
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => handleApprove(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-all duration-200">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 text-center">
        <p className="text-sm text-slate-500">{products.length} total products in system</p>
      </div>
    </div>
  );
};

export default ProductModeration;
