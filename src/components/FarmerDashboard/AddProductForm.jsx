import { motion } from 'motion/react';
import { Upload, X, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';

export default function AddProductForm() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'kg',
    price: '',
    harvestDate: '',
    description: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Wheat', 'Rice', 'Corn', 'Mustard', 'Cotton', 'Sugarcane', 'Vegetables'];
  const units = ['kg', 'quintal', 'ton', 'liter', 'bundle'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add product to context (this saves to localStorage)
    addProduct({
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      price: parseFloat(formData.price),
      harvestDate: formData.harvestDate,
      description: formData.description,
      image: imagePreview, // Save the preview image as data URL
    });

    // Show success message
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      quantity: '',
      unit: 'kg',
      price: '',
      harvestDate: '',
      description: '',
      image: null,
    });
    setImagePreview(null);
    setIsSubmitting(false);

    // Redirect to My Products after 2 seconds
    setTimeout(() => {
      navigate('/farmer-dashboard/my-products');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Add New Product</h1>
        <p className="text-accent-muted">List your agricultural products for buyers to discover</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
        >
          <Check size={20} className="text-green-600" />
          <div>
            <p className="font-medium">Product added successfully!</p>
            <p className="text-sm">Redirecting to My Products...</p>
          </div>
        </motion.div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md border border-surface-alt p-6 lg:p-8 max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Premium Wheat"
              className="w-full px-4 py-2.5 border border-surface-alt rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-surface-alt rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Quantity *</label>
            <input
              type="number"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Enter quantity"
              className="w-full px-4 py-2.5 border border-surface-alt rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Unit *</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2.5 border border-surface-alt rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Price per Unit (₹) *</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Enter price"
              className="w-full px-4 py-2.5 border border-surface-alt rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Harvest Date *</label>
            <input
              type="date"
              required
              value={formData.harvestDate}
              onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
              className="w-full px-4 py-2.5 border border-surface-alt rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-primary mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your product, farming methods, quality, etc."
            rows="4"
            className="w-full px-4 py-2.5 border border-surface-alt rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-primary mb-4">Product Image</label>
          <div className="border-2 border-dashed border-surface-alt rounded-lg p-8 text-center hover:border-emerald-500 transition-colors">
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="h-48 object-cover rounded-lg" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <X size={18} />
                </motion.button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto text-accent-muted mb-3" size={32} />
                <p className="text-primary font-medium mb-1">Drag and drop your image</p>
                <p className="text-accent-muted text-sm mb-4">or click to browse</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors"
                >
                  Select Image
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Product to Marketplace
        </motion.button>
      </motion.form>
    </div>
  );
}
