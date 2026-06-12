import React, { createContext, useContext, useState, useEffect } from 'react';

const BuyerContext = createContext();

// Default available products from farmers
const defaultAvailableProducts = [
  {
    id: '1',
    farmerId: 'farm-1',
    farmerName: 'Rajesh Deswal',
    farmLocation: 'Hisar, Haryana',
    name: 'Premium Wheat',
    category: 'Wheat',
    quantity: 500,
    unit: 'kg',
    price: 2500,
    image: '🌾',
    description: 'High-quality premium wheat grown with natural farming methods',
    certification: 'Organic',
    rating: 4.5,
    reviews: 23,
    origin: 'Hisar, Haryana - Natural cultivated soil',
    history: [
      { date: '2026-01-15', event: 'Planting', details: 'Seeds planted in organic soil' },
      { date: '2026-03-20', event: 'Growth', details: 'Early growth phase, no pesticides used' },
      { date: '2026-05-10', event: 'Harvested', details: 'Ready for market' },
      { date: '2026-06-01', event: 'Listed', details: 'Available for purchase' },
    ],
  },
  {
    id: '2',
    farmerId: 'farm-2',
    farmerName: 'Priya Singh',
    farmLocation: 'Punjab',
    name: 'Basmati Rice',
    category: 'Rice',
    quantity: 300,
    unit: 'kg',
    price: 4500,
    image: '🍚',
    description: 'Premium basmati rice with excellent aroma and taste',
    certification: 'ISO 9001',
    rating: 4.8,
    reviews: 45,
    origin: 'Punjab - Premium rice fields',
    history: [
      { date: '2026-02-01', event: 'Planting', details: 'Basmati seeds planted' },
      { date: '2026-04-15', event: 'Growth', details: 'Rice plants in flowering stage' },
      { date: '2026-05-25', event: 'Harvested', details: 'Hand-picked premium rice' },
      { date: '2026-06-02', event: 'Processed', details: 'Milled and polished' },
      { date: '2026-06-05', event: 'Listed', details: 'Available for purchase' },
    ],
  },
  {
    id: '3',
    farmerId: 'farm-1',
    farmerName: 'Rajesh Deswal',
    farmLocation: 'Hisar, Haryana',
    name: 'Yellow Mustard',
    category: 'Mustard',
    quantity: 150,
    unit: 'kg',
    price: 5500,
    image: '🌱',
    description: 'Pure mustard seeds for oil extraction',
    certification: 'Organic',
    rating: 4.6,
    reviews: 18,
    origin: 'Hisar, Haryana - Premium mustard seeds',
    history: [
      { date: '2026-01-20', event: 'Planting', details: 'Mustard seeds planted' },
      { date: '2026-03-30', event: 'Growth', details: 'Flowering stage' },
      { date: '2026-05-05', event: 'Harvested', details: 'Seeds collected' },
      { date: '2026-06-03', event: 'Listed', details: 'Available for purchase' },
    ],
  },
  {
    id: '4',
    farmerId: 'farm-3',
    farmerName: 'Amit Kumar',
    farmLocation: 'Madhya Pradesh',
    name: 'Organic Soybean',
    category: 'Soybean',
    quantity: 200,
    unit: 'kg',
    price: 3200,
    image: '🫘',
    description: 'Organic soybean with high protein content',
    certification: 'NPOP',
    rating: 4.7,
    reviews: 32,
    origin: 'Madhya Pradesh - Certified organic farms',
    history: [
      { date: '2026-02-10', event: 'Planting', details: 'Organic soybean planted' },
      { date: '2026-04-20', event: 'Growth', details: 'Pod formation stage' },
      { date: '2026-05-30', event: 'Harvested', details: 'Beans harvested and dried' },
      { date: '2026-06-04', event: 'Listed', details: 'Available for purchase' },
    ],
  },
];

export const BuyerProvider = ({ children }) => {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [buyerProfile, setBuyerProfile] = useState({
    name: 'Amit Sharma',
    email: 'amit.sharma@agri.com',
    phone: '+91 98765 43210',
    address: 'New Delhi, India',
    savedAddresses: [
      { id: 1, name: 'Home', address: 'New Delhi, India' },
      { id: 2, name: 'Office', address: 'Gurgaon, India' },
    ],
  });

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('availableProducts');
    const savedCart = localStorage.getItem('buyerCart');
    const savedOrders = localStorage.getItem('buyerOrders');
    const savedReviews = localStorage.getItem('buyerReviews');
    const savedProfile = localStorage.getItem('buyerProfile');

    if (savedProducts) {
      try {
        setAvailableProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error parsing products:', error);
        setAvailableProducts(defaultAvailableProducts);
      }
    } else {
      setAvailableProducts(defaultAvailableProducts);
    }

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

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('availableProducts', JSON.stringify(availableProducts));
  }, [availableProducts]);

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

  // Cart operations
  const addToCart = (product, quantity) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order operations
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
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status }
        : order
    ));
  };

  // Review operations
  const addReview = (productId, review) => {
    const newReview = {
      id: `REV-${Date.now()}`,
      productId,
      ...review,
      createdAt: new Date().toISOString(),
    };
    setReviews([...reviews, newReview]);

    // Update product rating
    setAvailableProducts(availableProducts.map(product => {
      if (product.id === productId) {
        const productReviews = reviews.filter(r => r.productId === productId).concat([newReview]);
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        return { ...product, rating: avgRating, reviews: productReviews.length };
      }
      return product;
    }));
  };

  const getProductReviews = (productId) => {
    return reviews.filter(review => review.productId === productId);
  };

  // Profile operations
  const updateBuyerProfile = (profileData) => {
    setBuyerProfile(profileData);
  };

  // Search operations
  const searchProducts = (query) => {
    return availableProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filterProducts = (category, maxPrice, minRating) => {
    return availableProducts.filter(product => {
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
