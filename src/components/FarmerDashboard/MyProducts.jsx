import { motion } from 'motion/react';
import { Edit2, Trash2, Eye, MoreVertical, Plus, Search, X, Save } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';

export default function MyProducts() {
  const navigate = useNavigate();
  const { products, updateProduct, deleteProduct, loading, error } = useProducts();
  const [view, setView] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editFormData, setEditFormData] = useState(null);
  const [newProductData, setNewProductData] = useState({
    name: '',
    category: 'Wheat',
    quantity: '',
    unit: 'kg',
    price: '',
    description: '',
    certification: 'Organic',
  });

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

  const categories = ['All', 'Wheat', 'Rice', 'Mustard', 'Corn', 'Cotton'];

  // Calculate product status based on quantity
  const getProductStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 100) return 'Low Stock';
    return 'Active';
  };

  // Add status to products
  const productsWithStatus = (Array.isArray(products) ? products : []).map((p) => ({
    ...p,
    status: p.status || getProductStatus(p.quantity),
  }));

  const filteredProducts = productsWithStatus.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEditProduct = () => {
    if (!editFormData.name || !editFormData.quantity || !editFormData.price) {
      alert('Please fill all required fields');
      return;
    }
    updateProduct(editFormData.id, {
      name: editFormData.name,
      category: editFormData.category,
      quantity: parseInt(editFormData.quantity),
      price: parseFloat(editFormData.price),
      description: editFormData.description,
      unit: editFormData.unit,
      status: editFormData.status,
    });
    setShowEditModal(false);
    setEditFormData(null);
  };

  const handleQuickStatusChange = (product, newStatus) => {
    updateProduct(product.id, { ...product, status: newStatus });
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      setShowDetailModal(false);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleEditClick = (product) => {
    setEditFormData({ ...product });
    setShowEditModal(true);
  };

  const renderProductImage = (image, className) => {
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:image/'))) {
      return <img src={image} alt="Product" className={className} />;
    }

    return <span className={className}>{image || '🌾'}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Products</h1>
          <p className="text-accent-muted">Manage your listed products ({filteredProducts.length})</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/farmer-dashboard/add-product')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            <Plus size={18} />
            Add Product
          </motion.button>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md border border-surface-alt p-4 space-y-4">
        <div className="flex items-center gap-3 bg-surface-alt rounded-lg px-4 py-2 flex-1">
          <Search size={18} className="text-accent" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full text-primary"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-accent-muted mb-2 block">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-accent-muted mb-2 block">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-surface-alt bg-white p-8 text-center text-accent-muted">
          Loading your products...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="h-40 bg-gradient-to-br from-emerald-100 to-green-200 relative group overflow-hidden">
                {renderProductImage(product.image, 'h-full w-full object-cover')}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleViewDetails(product)}
                    className="p-2 bg-white rounded-full text-primary"
                  >
                    <Eye size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleEditClick(product)}
                    className="p-2 bg-white rounded-full text-primary"
                  >
                    <Edit2 size={20} />
                  </motion.button>
                </motion.div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-primary">{product.name}</h3>
                  <select
                    value={product.status}
                    onChange={(e) => handleQuickStatusChange(product, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${getStatusColor(product.status)}`}
                  >
                    <option value="Active">Active</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
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
                    onClick={() => handleEditClick(product)}
                    className="flex-1 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDeleteProduct(product.id)}
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
      {!loading && !error && view === 'list' && (
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-surface-alt hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {renderProductImage(product.image, 'w-12 h-12 rounded-lg object-cover')}
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
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleViewDetails(product)}
                          className="p-2 hover:bg-surface-alt rounded-lg transition-colors text-emerald-600"
                        >
                          <Eye size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleEditClick(product)}
                          className="p-2 hover:bg-surface-alt rounded-lg transition-colors text-amber-600"
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-surface-alt rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Product Details Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white flex items-center justify-between">
              <h2 className="text-2xl font-bold">Product Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="mb-6 flex flex-wrap justify-center gap-6">
                <div className="flex flex-col items-center">
                  {renderProductImage(selectedProduct.image, 'w-64 h-64 rounded-xl object-cover shadow-lg')}
                  <p className="mt-2 text-sm text-accent-muted font-medium">Product Image</p>
                </div>
                {selectedProduct.qrCode && (
                  <div className="flex flex-col items-center">
                    <img src={selectedProduct.qrCode} alt="QR Code" className="w-64 h-64 rounded-xl object-contain shadow-lg bg-white border border-surface-alt p-4" />
                    <p className="mt-2 text-sm text-primary font-bold">Traceability QR Code</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-accent-muted">Product Name</p>
                  <p className="font-bold text-primary">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-sm text-accent-muted">Category</p>
                  <p className="font-bold text-primary">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-accent-muted">Quantity</p>
                  <p className="font-bold text-primary">{selectedProduct.quantity} {selectedProduct.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-accent-muted">Price per Unit</p>
                  <p className="font-bold text-primary">₹{selectedProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm text-accent-muted">Total Value</p>
                  <p className="font-bold text-primary">₹{selectedProduct.quantity * selectedProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm text-accent-muted">Status</p>
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedProduct.status)}`}>
                    {selectedProduct.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-accent-muted mb-1">Description</p>
                <p className="text-primary">{selectedProduct.description}</p>
              </div>
              <div>
                <p className="text-sm text-accent-muted mb-1">Certification</p>
                <p className="font-semibold text-emerald-600">{selectedProduct.certification}</p>
              </div>
              <div className="flex gap-3 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    handleEditClick(selectedProduct);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Edit Product
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors font-medium"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Product</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-accent-muted mb-2 block">Product Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-accent-muted mb-2 block">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-accent-muted mb-2 block">Certification</label>
                  <select
                    value={editFormData.certification}
                    onChange={(e) => setEditFormData({ ...editFormData, certification: e.target.value })}
                    className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  >
                    <option value="Organic">Organic</option>
                    <option value="ISO 9001">ISO 9001</option>
                    <option value="NPOP">NPOP</option>
                    <option value="GlobalGAP">GlobalGAP</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-accent-muted mb-2 block">Quantity</label>
                  <input
                    type="number"
                    value={editFormData.quantity}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                    className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-accent-muted mb-2 block">Unit</label>
                  <select
                    value={editFormData.unit}
                    onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                    className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  >
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                    <option value="quintal">quintal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-accent-muted mb-2 block">Price per Unit</label>
                <input
                  type="number"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-accent-muted mb-2 block">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500 resize-none"
                  rows="3"
                />
              </div>
              <div>
                <label className="text-sm text-accent-muted mb-2 block">Product Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Active', 'Low Stock', 'Out of Stock'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, status: s })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                        editFormData.status === s
                          ? s === 'Active'
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : s === 'Low Stock'
                            ? 'bg-amber-100 border-amber-500 text-amber-700'
                            : 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-white border-surface-alt text-accent-muted hover:border-emerald-300'
                      }`}
                    >
                      {s === 'Active' ? '🟢' : s === 'Low Stock' ? '🟡' : '🔴'} {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleEditProduct}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-accent-muted mb-2 block">Product Name *</label>
                <input
                  type="text"
                  value={newProductData.name}
                  onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                  className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-accent-muted mb-2 block">Category</label>
                  <select
                    value={newProductData.category}
                    onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })}
                    className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-accent-muted mb-2 block">Certification</label>
                  <select
                    value={newProductData.certification}
                    onChange={(e) => setNewProductData({ ...newProductData, certification: e.target.value })}
                    className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  >
                    <option value="Organic">Organic</option>
                    <option value="ISO 9001">ISO 9001</option>
                    <option value="NPOP">NPOP</option>
                    <option value="GlobalGAP">GlobalGAP</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-accent-muted mb-2 block">Quantity *</label>
                  <input
                    type="number"
                    value={newProductData.quantity}
                    onChange={(e) => setNewProductData({ ...newProductData, quantity: e.target.value })}
                    className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm text-accent-muted mb-2 block">Unit</label>
                  <select
                    value={newProductData.unit}
                    onChange={(e) => setNewProductData({ ...newProductData, unit: e.target.value })}
                    className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  >
                    <option value="kg">kg</option>
                    <option value="ton">ton</option>
                    <option value="quintal">quintal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-accent-muted mb-2 block">Price per Unit (₹) *</label>
                <input
                  type="number"
                  value={newProductData.price}
                  onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                  className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm text-accent-muted mb-2 block">Description</label>
                <textarea
                  value={newProductData.description}
                  onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })}
                  className="w-full p-2 border border-surface-alt rounded-lg text-primary outline-none focus:border-emerald-500 resize-none"
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>
              <div className="flex gap-3 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleAddProduct}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Product
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors font-medium"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg border border-surface-alt"
        >
          <p className="text-4xl mb-4">📦</p>
          <p className="text-primary font-semibold mb-2">No products found</p>
          <p className="text-accent-muted mb-4">Try adjusting your filters or add a new product</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
          >
            Add Your First Product
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
