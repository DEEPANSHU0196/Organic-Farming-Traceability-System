import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllProducts } from '../api/product';
import { fetchAllReviews, addReview as apiAddReview, deleteReview as apiDeleteReview } from '../api/review';
import { createOrder, fetchBuyerOrders } from '../api/order';
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
    qrCode: product.qrCode || '',
    traceabilityId: product.traceabilityId || '',
  };
};

export const BuyerProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [availableProducts, setAvailableProducts] = useState([]);

  // Lazy initializers — read from localStorage on first render, before any effect fires.
  // This prevents the save-effect from overwriting stored data before the load-effect reads it.
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('buyerCart') || '[]'); }
    catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('buyerOrders') || '[]'); }
    catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('buyerWishlist') || '[]'); }
    catch { return []; }
  });
  const [reviews, setReviews] = useState([]);
  const [buyerProfile, setBuyerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('buyerProfile');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { name: '', email: '', phone: '', address: '', savedAddresses: [] };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    if (!user) return;
    setBuyerProfile((prev) => ({
      ...prev,
      name: user?.fullName || user?.name || prev.name || '',
      email: user?.email || prev.email || '',
      phone: user?.phone || prev.phone || '',
      address: user?.address || prev.address || '',
    }));
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [productsRes, reviewsRes, ordersRes] = await Promise.all([
          fetchAllProducts(),
          fetchAllReviews(),
          fetchBuyerOrders().catch(() => ({ data: { orders: [] } }))
        ]);
        
        const apiProducts = Array.isArray(productsRes?.data?.products) ? productsRes.data.products : [];
        setAvailableProducts(apiProducts.map(normalizeProduct));
        
        if (reviewsRes?.data?.success) {
          setReviews(reviewsRes.data.reviews || []);
        }
        if (ordersRes?.data?.success) {
          // Format API orders to match local UI structure
          const apiOrders = (ordersRes.data.orders || []).map(o => ({
            id: o._id,
            status: o.status || 'Pending',
            createdAt: o.createdAt,
            deliveryDate: o.createdAt, // Just dummy date for now
            items: [{
              ...o.product,
              id: o.product._id,
              name: o.product.productName,
              price: o.product.price,
              quantity: o.quantity
            }],
            totalAmount: (o.product?.price || 0) * (o.quantity || 1)
          }));
          setOrders(apiOrders);
        }
      } catch (err) {
        console.error('Failed to load buyer data:', err);
        setError(err?.response?.data?.message || 'Unable to load data right now.');
        setAvailableProducts([]);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    // Don't fetch until AuthContext has finished its initialization effect.
    // authLoading is true on the very first render; once it turns false the
    // token is confirmed in localStorage and the interceptor will attach it.
    if (!authLoading) {
      loadData();
    }
  }, [authLoading]);

  useEffect(() => {
    localStorage.setItem('buyerCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('buyerOrders', JSON.stringify(orders));
  }, [orders]);

  // Reviews are stored on server, don't persist them via localStorage here anymore

  useEffect(() => {
    localStorage.setItem('buyerProfile', JSON.stringify(buyerProfile));
  }, [buyerProfile]);

  useEffect(() => {
    localStorage.setItem('buyerWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

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

  const placeOrder = async (orderData) => {
    try {
      // Create an order for each item in the cart via API
      const orderPromises = cart.map(item => 
        createOrder({
          product: item.id,
          quantity: item.quantity,
          ...orderData
        })
      );
      
      const responses = await Promise.all(orderPromises);
      
      const newOrders = responses.map((res, idx) => {
        const o = res.data.order;
        const cartItem = cart[idx];
        return {
          id: o._id,
          status: o.status || 'Confirmed',
          createdAt: o.createdAt,
          deliveryDate: o.createdAt,
          items: [{
            ...cartItem
          }],
          totalAmount: cartItem.price * cartItem.quantity
        };
      });

      setOrders([...orders, ...newOrders]);
      setCart([]);
      return newOrders;
    } catch (err) {
      console.error('Failed to place order:', err);
      throw err;
    }
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map((order) =>
      order.id === orderId
        ? { ...order, status }
        : order
    ));
  };

  const addReview = async (productId, reviewData) => {
    try {
      const payload = {
        productId,
        ...reviewData
      };
      const response = await apiAddReview(payload);
      const newReview = response.data.review;
      
      setReviews([...reviews, newReview]);

      // Update local product rating stats immediately
      setAvailableProducts(availableProducts.map((product) => {
        if (product.id === productId) {
          const productReviews = reviews.filter((r) => r.product === productId).concat([newReview]);
          const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
          return { ...product, rating: avgRating, reviews: productReviews.length };
        }
        return product;
      }));
      return newReview;
    } catch (error) {
      console.error('Failed to add review:', error);
      throw error;
    }
  };

  const removeReview = async (reviewId, productId) => {
    try {
      await apiDeleteReview(reviewId);
      const updatedReviews = reviews.filter((r) => r._id !== reviewId && r.id !== reviewId);
      setReviews(updatedReviews);

      // Update local product rating stats immediately
      setAvailableProducts(availableProducts.map((product) => {
        if (product.id === productId) {
          const productReviews = updatedReviews.filter((r) => r.product === productId);
          const avgRating = productReviews.length > 0 
            ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length 
            : 0;
          return { ...product, rating: avgRating, reviews: productReviews.length };
        }
        return product;
      }));
    } catch (error) {
      console.error('Failed to remove review:', error);
      throw error;
    }
  };

  const getProductReviews = (productId) => {
    return reviews.filter((review) => review.product === productId || review.productId === productId);
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

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <BuyerContext.Provider
      value={{
        availableProducts,
        cart,
        orders,
        reviews,
        wishlist,
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
        removeReview,
        getProductReviews,
        updateBuyerProfile,
        searchProducts,
        filterProducts,
        toggleWishlist,
        isInWishlist,
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
