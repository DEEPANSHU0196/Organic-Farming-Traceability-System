import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Search, ShoppingBag, Heart,
  CreditCard, Star, Settings
} from 'lucide-react';
import { useState } from 'react';
import { useBuyer } from '../contexts/BuyerContext';
import DashboardLayout from '../shared/DashboardLayout';
import BuyerDashboardOverview from '../components/BuyerPortal/BuyerDashboardOverview';
import BrowseProducts from '../components/BuyerPortal/BrowseProducts';
import ShoppingCart from '../components/BuyerPortal/ShoppingCart';
import OrderTracking from '../components/BuyerPortal/OrderTracking';
import ReviewsRatings from '../components/BuyerPortal/ReviewsRatings';
import BuyerWishlist from '../components/BuyerPortal/BuyerWishlist';
import BuyerPayments from '../components/BuyerPortal/BuyerPayments';
import BuyerSettings from '../components/BuyerPortal/BuyerSettings';
import ProductDetails from '../components/BuyerPortal/ProductDetails';

const NAV_ITEMS = [
  { id: 'overview',  label: 'Dashboard',       icon: LayoutDashboard },
  { id: 'browse',    label: 'Browse Products',  icon: Search },
  { id: 'orders',    label: 'Orders',           icon: ShoppingBag },
  { id: 'wishlist',  label: 'Wishlist',         icon: Heart },
  { id: 'payments',  label: 'Payments',         icon: CreditCard },
  { id: 'reviews',   label: 'Reviews',          icon: Star },
  { id: 'settings',  label: 'Settings',         icon: Settings },
];

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { cart, placeOrder } = useBuyer();

  const pathSegment = location.pathname.split('/').pop() || 'overview';
  const activeSection = NAV_ITEMS.find(s => s.id === pathSegment)?.id || 'overview';

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSectionChange = (id) => navigate(`/buyer-dashboard/${id}`);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      placeOrder({ deliveryAddress: '123 Main St, New Delhi', paymentMethod: 'COD' });
      handleSectionChange('orders');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':  return <BuyerDashboardOverview onNavigate={handleSectionChange} />;
      case 'browse':    return <BrowseProducts onProductSelect={setSelectedProduct} />;
      case 'orders':    return <OrderTracking />;
      case 'wishlist':  return <BuyerWishlist onBrowse={() => handleSectionChange('browse')} />;
      case 'payments':  return <BuyerPayments />;
      case 'reviews':   return <ReviewsRatings />;
      case 'settings':  return <BuyerSettings />;
      default:          return <BuyerDashboardOverview onNavigate={handleSectionChange} />;
    }
  };

  return (
    <>
      <DashboardLayout
        role="buyer"
        navItems={NAV_ITEMS}
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onLogout={handleLogout}
      >
        {renderSection()}
      </DashboardLayout>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => {}}
        />
      )}
    </>
  );
}
