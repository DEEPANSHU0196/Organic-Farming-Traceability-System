import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
} from 'lucide-react';

const ProductModeration = () => {
  const [products] = useState([
    {
      id: 1,
      name: 'Organic Tomatoes',
      farmer: 'Rajesh Kumar',
      category: 'Vegetables',
      status: 'Pending',
      submittedDate: 'Today',
      image: '🍅',
    },
    {
      id: 2,
      name: 'Fresh Milk',
      farmer: 'Priya Singh',
      category: 'Dairy',
      status: 'Pending',
      submittedDate: 'Today',
      image: '🥛',
    },
    {
      id: 3,
      name: 'Basmati Rice',
      farmer: 'Amit Patel',
      category: 'Grains',
      status: 'Pending',
      submittedDate: 'Yesterday',
      image: '🌾',
    },
    {
      id: 4,
      name: 'Apple Box',
      farmer: 'Deepa Verma',
      category: 'Fruits',
      status: 'Pending',
      submittedDate: 'Yesterday',
      image: '🍎',
    },
  ]);

  const getStatusIcon = (status) => {
    if (status === 'Pending') {
      return (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
          <AlertCircle className="w-3 h-3" />
          <span>Pending</span>
        </div>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
        Approved
      </span>
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
              Recently added products awaiting approval
            </p>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
            4 Pending
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
          >
            {/* Product Image */}
            <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mb-4 text-6xl">
              {product.image}
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{product.name}</h4>
                <p className="text-xs text-slate-500 mt-1">by {product.farmer}</p>
              </div>

              {/* Category and Status */}
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  {product.category}
                </span>
                {getStatusIcon(product.status)}
              </div>

              {/* Date */}
              <p className="text-xs text-slate-500">
                Submitted {product.submittedDate}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-all duration-200">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all duration-200">
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-all duration-200">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 text-center">
        <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          View All Pending Products →
        </button>
      </div>
    </div>
  );
};

export default ProductModeration;
