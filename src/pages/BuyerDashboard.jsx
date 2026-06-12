import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { useBuyer } from '../contexts/BuyerContext';
import BuyerSidebar from '../components/BuyerPortal/BuyerSidebar';
import BrowseProducts from '../components/BuyerPortal/BrowseProducts';
import ProductDetails from '../components/BuyerPortal/ProductDetails';
import ShoppingCart from '../components/BuyerPortal/ShoppingCart';
import OrderTracking from '../components/BuyerPortal/OrderTracking';
import ReviewsRatings from '../components/BuyerPortal/ReviewsRatings';
import BuyerProfile from '../components/BuyerPortal/BuyerProfile';

const buyerSections = [
  { id: 'browse', label: 'Browse Products' },
  { id: 'cart', label: 'Shopping Cart' },
  { id: 'orders', label: 'My Orders' },
  { id: 'reviews', label: 'My Reviews' },
  { id: 'profile', label: 'My Profile' },
];

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, closeSidebar, toggleSidebar } = useDashboard();
  const { cart, placeOrder } = useBuyer();

  const pathSegment = location.pathname.split('/').pop() || 'browse';
  const activeSection = buyerSections.find(s => s.id === pathSegment)?.id || 'browse';

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartNotification, setCartNotification] = useState(false);

  const handleSectionChange = (sectionId) => {
    navigate(`/buyer-dashboard/${sectionId}`);
    closeSidebar();
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = () => {
    setCartNotification(true);
    setTimeout(() => setCartNotification(false), 2000);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      const order = placeOrder({
        deliveryAddress: '123 Main St, New Delhi',
        paymentMethod: 'COD',
      });
      handleSectionChange('orders');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'browse':
        return <BrowseProducts onProductSelect={handleProductSelect} />;
      case 'cart':
        return <ShoppingCart onCheckout={handleCheckout} />;
      case 'orders':
        return <OrderTracking />;
      case 'reviews':
        return <ReviewsRatings />;
      case 'profile':
        return <BuyerProfile />;
      default:
        return <BrowseProducts onProductSelect={handleProductSelect} />;
    }
  };

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar */}
      <BuyerSidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-surface-alt px-4 md:px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
          {/* Left: Toggle Button + Title */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            {/* Toggle Sidebar Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="flex-shrink-0 p-2 hover:bg-surface-alt rounded-lg transition-colors"
              title="Toggle menu"
            >
              <Menu size={20} className="text-teal-600" />
            </motion.button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-surface-alt" />

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-primary truncate">Buyer Portal</h1>
              <p className="hidden sm:block text-xs text-accent-muted">Welcome back!</p>
            </div>
          </div>

          {/* Right: Cart + Notifications */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            {/* Cart Icon */}
            {cart.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => handleSectionChange('cart')}
                className="relative p-2 hover:bg-surface-alt rounded-lg transition-colors"
              >
                <div className="text-2xl">🛒</div>
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              </motion.button>
            )}

            {/* Notifications */}
            {cartNotification && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed top-20 right-6 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50"
              >
                <span>✓</span>
                <span>Added to cart!</span>
              </motion.div>
            )}

            {/* Notifications Bell */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="relative p-2 hover:bg-surface-alt rounded-lg transition-colors"
            >
              <Bell size={20} className="text-primary" />
              <span className="absolute top-1 right-1 bg-amber-500 w-2 h-2 rounded-full"></span>
            </motion.button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8"
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
