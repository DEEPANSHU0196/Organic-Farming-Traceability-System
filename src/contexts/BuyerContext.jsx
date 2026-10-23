import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllProducts } from '../api/product';
import { fetchAllReviews, addReview as apiAddReview, deleteReview as apiDeleteReview } from '../api/review';
import { createOrder, fetchBuyerOrders } from '../api/order';
import { getMyShipments } from '../api/shipment';
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
  const [shipments, setShipments] = useState([]);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('buyerCart') || '[]'); } catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('buyerOrders') || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('buyerWishlist') || '[]'); } catch { return []; }
  });
  const [reviews, setReviews] = useState([]);
  const [buyerProfile, setBuyerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('buyerProfile');
      if (saved) return JSON.parse(saved);
    } catch { /* Ignore invalid saved profile data. */ }
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

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsRes, reviewsRes, ordersRes, shipmentsRes] = await Promise.all([
        fetchAllProducts(),
        fetchAllReviews(),
        fetchBuyerOrders().catch(() => ({ data: { orders: [] } })),
        getMyShipments().catch(() => ({ data: { shipments: [] } })),
      ]);
      const apiProducts = Array.isArray(productsRes?.data?.products) ? productsRes.data.products : [];
      setAvailableProducts(apiProducts.map(normalizeProduct));
      if (reviewsRes?.data?.success) setReviews(reviewsRes.data.reviews || []);
      if (ordersRes?.data?.success) {
        setOrders((ordersRes.data.orders || []).map((order) => ({
          id: order._id,
          status: order.status || 'Pending',
          createdAt: order.createdAt,
          deliveryDate: order.createdAt,
          items: [{
            ...order.product,
            id: order.product?._id,
            name: order.product?.productName,
            price: order.product?.price,
            quantity: order.quantity,
          }],
          totalAmount: (order.product?.price || 0) * (order.quantity || 1),
        })));
      }
      setShipments(Array.isArray(shipmentsRes?.data?.shipments) ? shipmentsRes.data.shipments : []);
    } catch (err) {
      console.error('Failed to load buyer data:', err);
      setError(err?.response?.data?.message || 'Unable to load data right now.');
      setAvailableProducts([]);
      setReviews([]);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) loadData();
  }, [authLoading]);

  // Pull-to-refresh in the dashboard broadcasts this event.
  useEffect(() => {
    const onRefresh = () => loadData();
    window.addEventListener('agroverse:refresh', onRefresh);
    return () => window.removeEventListener('agroverse:refresh', onRefresh);
  });

  useEffect(() => { localStorage.setItem('buyerCart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('buyerOrders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('buyerProfile', JSON.stringify(buyerProfile)); }, [buyerProfile]);
  useEffect(() => { localStorage.setItem('buyerWishlist', JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart = (product, quantity) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) => item.id === product.id
          ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...currentCart, { ...product, quantity }];
    });
  };
  const removeFromCart = (productId) => setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart((currentCart) => currentCart.map((item) => item.id === productId ? { ...item, quantity } : item));
  };
  const clearCart = () => setCart([]);

  const placeOrder = async (orderData) => {
    const responses = await Promise.all(cart.map((item) => createOrder({ product: item.id, quantity: item.quantity, ...orderData })));
    const newOrders = responses.map((response, index) => {
      const order = response.data.order;
      const cartItem = cart[index];
      return {
        id: order._id,
        status: order.status || 'Confirmed',
        createdAt: order.createdAt,
        deliveryDate: order.createdAt,
        items: [{ ...cartItem }],
        totalAmount: cartItem.price * cartItem.quantity,
      };
    });
    setOrders((currentOrders) => [...currentOrders, ...newOrders]);
    clearCart();
    return newOrders;
  };
  const updateOrderStatus = (orderId, status) => setOrders((currentOrders) => currentOrders.map((order) => order.id === orderId ? { ...order, status } : order));

  const addReview = async (productId, reviewData) => {
    const response = await apiAddReview({ productId, ...reviewData });
    const newReview = response.data.review;
    setReviews((currentReviews) => [...currentReviews, newReview]);
    return newReview;
  };
  const removeReview = async (reviewId) => {
    await apiDeleteReview(reviewId);
    setReviews((currentReviews) => currentReviews.filter((review) => review._id !== reviewId && review.id !== reviewId));
  };
  const getProductReviews = (productId) => reviews.filter((review) => review.product === productId || review.productId === productId);
  const updateBuyerProfile = (profileData) => setBuyerProfile(profileData);
  const searchProducts = (query) => {
    const normalizedQuery = query.toLowerCase();
    return availableProducts.filter((product) => product.name.toLowerCase().includes(normalizedQuery) || product.category.toLowerCase().includes(normalizedQuery) || product.description.toLowerCase().includes(normalizedQuery));
  };
  const filterProducts = (category, maxPrice, minRating) => availableProducts.filter((product) => (!category || product.category === category) && (!maxPrice || product.price <= maxPrice) && (!minRating || product.rating >= minRating));
  const toggleWishlist = (product) => setWishlist((currentWishlist) => currentWishlist.some((item) => item.id === product.id) ? currentWishlist.filter((item) => item.id !== product.id) : [...currentWishlist, product]);
  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

  return (
    <BuyerContext.Provider value={{ availableProducts, cart, orders, shipments, reviews, wishlist, buyerProfile, loading, error, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, updateOrderStatus, addReview, removeReview, getProductReviews, updateBuyerProfile, searchProducts, filterProducts, toggleWishlist, isInWishlist, refreshData: loadData }}>
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyer = () => {
  const context = useContext(BuyerContext);
  if (!context) throw new Error('useBuyer must be used within BuyerProvider');
  return context;
};