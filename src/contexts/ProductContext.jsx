import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProducts, createProduct, updateProductById, deleteProductById } from '../api/product';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

const normalizeProduct = (product) => {
  const id = product._id || product.id;
  return {
    id,
    _id: id,
    name: product.productName || product.name || 'Unnamed Product',
    category: product.category || 'Unknown',
    quantity: Number(product.quantity || 0),
    unit: product.unit || 'kg',
    price: Number(product.price || 0),
    description: product.description || '',
    certification: product.certification || 'Organic',
    image: product.image || '🌾',
    orders: product.orders || 0,
    listed: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Recently added',
    createdAt: product.createdAt || new Date().toISOString(),
    location: product.location || '',
    harvestDate: product.harvestDate || '',
  };
};

const buildPayload = (product) => {
  if (product?.image instanceof File) {
    const formData = new FormData();
    formData.append('productName', product.name || '');
    formData.append('category', product.category || '');
    formData.append('quantity', Number(product.quantity || 0));
    formData.append('price', Number(product.price || 0));
    formData.append('description', product.description || '');
    formData.append('location', product.location || '');
    formData.append('unit', product.unit || 'kg');
    formData.append('harvestDate', product.harvestDate || '');
    formData.append('image', product.image);
    return formData;
  }

  return {
    productName: product.name,
    category: product.category,
    quantity: Number(product.quantity),
    price: Number(product.price),
    description: product.description,
    location: product.location || '',
    image: product.image || '',
    unit: product.unit || 'kg',
    harvestDate: product.harvestDate || '',
  };
};

const defaultOrders = [
  {
    id: 'ORD-001',
    customerName: 'Amit Kumar',
    productName: 'Premium Wheat',
    quantity: 50,
    unit: 'kg',
    price: 1250,
    status: 'Pending',
    date: new Date().toISOString(),
  },
  {
    id: 'ORD-002',
    customerName: 'Priya Singh',
    productName: 'Basmati Rice',
    quantity: 25,
    unit: 'kg',
    price: 1625,
    status: 'Completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const ProductProvider = ({ children }) => {
  // Wait for AuthContext to finish reading from localStorage before fetching.
  // This prevents a race condition where the API fires before the token is
  // confirmed to exist, especially on hard refresh with React StrictMode.
  const { loading: authLoading } = useAuth();
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem('products');
      return savedProducts ? JSON.parse(savedProducts) : [];
    } catch (error) {
      console.error('Error parsing products from localStorage:', error);
      return [];
    }
  });
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('orders');
      return savedOrders ? JSON.parse(savedOrders) : defaultOrders;
    } catch (error) {
      console.error('Error parsing orders from localStorage:', error);
      return defaultOrders;
    }
  });
  const [farmer, setFarmer] = useState(() => {
    try {
      const savedFarmer = localStorage.getItem('farmer');
      return savedFarmer ? JSON.parse(savedFarmer) : {
        name: 'Rajesh Deswal',
        email: 'rajesh.deswal@agritrust.com',
        phone: '+91 98765 43210',
        farmName: 'Deswal Agriculture Farm',
        farmLocation: 'Hisar, Haryana',
      };
    } catch (error) {
      console.error('Error parsing farmer from localStorage:', error);
      return {
        name: 'Rajesh Deswal',
        email: 'rajesh.deswal@agritrust.com',
        phone: '+91 98765 43210',
        farmName: 'Deswal Agriculture Farm',
        farmLocation: 'Hisar, Haryana',
      };
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('farmer', JSON.stringify(farmer));
  }, [farmer]);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchProducts();
      const apiProducts = Array.isArray(response?.data?.products) ? response.data.products : [];
      setProducts(apiProducts.map(normalizeProduct));
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err?.response?.data?.message || 'Unable to load products right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Don't fetch until AuthContext has finished its initialization effect.
    // authLoading is true on the very first render and turns false once
    // AuthContext's useEffect has run and resolved the stored token.
    if (authLoading) return;
    refreshProducts();
  }, [authLoading, refreshProducts]);

  const addProduct = async (product) => {
    try {
      const response = await createProduct(buildPayload(product));
      const createdProduct = normalizeProduct(response?.data?.product || response?.data || {});
      setProducts((prev) => [createdProduct, ...prev]);
      return createdProduct;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const response = await updateProductById(id, buildPayload({ ...updatedData, name: updatedData.name, category: updatedData.category, quantity: updatedData.quantity, price: updatedData.price, description: updatedData.description, location: updatedData.location || '', image: updatedData.image || '', unit: updatedData.unit || 'kg' }));
      const updated = normalizeProduct(response?.data?.product || response?.data || {});
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteProductById(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const addOrder = (order) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...order,
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  };

  const updateOrder = (id, updatedData) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, ...updatedData } : o)));
  };

  const updateFarmer = (farmerData) => {
    setFarmer(farmerData);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        orders,
        farmer,
        loading,
        error,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrder,
        updateFarmer,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
