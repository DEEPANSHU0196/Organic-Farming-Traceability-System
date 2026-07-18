import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllProducts } from '../api/product';
import { useAuth } from './AuthContext';

const BuyerContext = createContext();

const normalizeProduct = (product) => {
  const id = product._id || product.id;
  return {
    id,
    _id: id,
    farmerId: product.farmer?._id || product.farmerId || 'farm-unknown',
    farmerName: product.farmer?.fullName || product.farmerName || 'Verified Farmer',
    farmLocation: product.location || product.farmLocation || 'India',
    name: product.productName || product.name || 'Unnamed Product',
    category: product.category || 'Unknown',
    quantity: Number(product.quantity || 0),
    unit: product.unit || 'kg',
    price: Number(product.price || 0),
    image: product.image || '🌾',
    description: product.description || 'Fresh produce from a verified farmer.',
    certification: product.certification || 'Organic',
    rating: product.rating || 4.5,
    reviews: product.reviews || 12,
    origin: product.origin || product.location || 'India',
    history: product.history || [],
  };
};

export const BuyerProvider = ({ children }) => {
  const { user } = useAuth();
  const [availableProducts, setAvailableProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [buyerProfile, setBuyerProfile] = useState({
    name: user?.fullName || user?.name || 'Amit Sharma',
    email: user?.email || 'amit.sharma@agri.com',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'New Delhi, India',
    savedAddresses: [
      { id: 1, name: 'Home', address: 'New Delhi, India' },
      { id: 2, name: 'Office', address: 'Gurgaon, India' },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('buyerCart');
    const savedOrders = localStorage.getItem('buyerOrders');
    const savedReviews = localStorage.getItem('buyerReviews');
    const savedProfile = localStorage.getItem('buyerProfile');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart:', error);
      }
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error parsing orders:', error);
      }
    }

    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Error parsing reviews:', error);
      }
    }

    if (savedProfile) {
      try {
        setBuyerProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing profile:', error);
      }
    }
  }, []);

  useEffect(() => {
    setBuyerProfile((prev) => ({
      ...prev,
      name: user?.fullName || user?.name || prev.name || 'Amit Sharma',
      email: user?.email || prev.email || 'amit.sharma@agri.com',
      phone: user?.phone || prev.phone || '+91 98765 43210',
      address: user?.address || prev.address || 'New Delhi, India',
    }));
  }, [user?.fullName, user?.email, user?.phone, user?.address]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetchAllProducts();
        const apiProducts = Array.isArray(response?.data?.products) ? response.data.products : [];
        setAvailableProducts(apiProducts.map(normalizeProduct));
      } catch (err) {
        console.error('Failed to load buyer products:', err);
        setError(err?.response?.data?.message || 'Unable to load products right now.');
        setAvailableProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('buyerCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('buyerOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('buyerReviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('buyerProfile', JSON.stringify(buyerProfile));
  }, [buyerProfile]);

  const addToCart = (product, quantity) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map((item) =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      items: cart,
      totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map((order) =>
      order.id === orderId
        ? { ...order, status }
        : order
    ));
  };

  const addReview = (productId, review) => {
    const product = availableProducts.find((item) => item.id === productId);
    const newReview = {
      id: `REV-${Date.now()}`,
      productId,
      productName: product?.name || review.productName || 'Product',
      ...review,
      createdAt: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);

    setAvailableProducts(availableProducts.map((product) => {
      if (product.id === productId) {
        const productReviews = reviews.filter((r) => r.productId === productId).concat([newReview]);
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        return { ...product, rating: avgRating, reviews: productReviews.length };
      }
      return product;
    }));
  };

  const getProductReviews = (productId) => {
    return reviews.filter((review) => review.productId === productId);
  };

  const updateBuyerProfile = (profileData) => {
    setBuyerProfile(profileData);
  };

  const searchProducts = (query) => {
    return availableProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterProducts = (category, maxPrice, minRating) => {
    return availableProducts.filter((product) => {
      const categoryMatch = !category || product.category === category;
      const priceMatch = !maxPrice || product.price <= maxPrice;
      const ratingMatch = !minRating || product.rating >= minRating;
      return categoryMatch && priceMatch && ratingMatch;
    });
  };

  return (
    <BuyerContext.Provider
      value={{
        availableProducts,
        cart,
        orders,
        reviews,
        buyerProfile,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        addReview,
        getProductReviews,
        updateBuyerProfile,
        searchProducts,
        filterProducts,
      }}
    >
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyer = () => {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyer must be used within BuyerProvider');
  }
  return context;
};
