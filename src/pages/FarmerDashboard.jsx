import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Package, PlusCircle, ShoppingBag,
  CreditCard, Star, Settings, Truck, UserRound } from 'lucide-react';
import DashboardLayout from '../shared/DashboardLayout';
import DashboardOverview from '../components/FarmerDashboard/DashboardOverview';
import AddProductForm from '../components/FarmerDashboard/AddProductForm';
import MyProducts from '../components/FarmerDashboard/MyProducts';
import OrdersManagement from '../components/FarmerDashboard/OrdersManagement';
import PaymentsSection from '../components/FarmerDashboard/PaymentsSection';
import ReviewsRatings from '../components/FarmerDashboard/ReviewsRatings';
import FarmerSettings from '../components/FarmerDashboard/FarmerSettings';
import ShipmentTracking from '../components/FarmerDashboard/ShipmentTracking';
import FarmerProfile from '../components/FarmerDashboard/FarmerProfile';

const NAV_ITEMS = [
  { id: 'overview',     label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'my-products',  label: 'My Products',  icon: Package },
  { id: 'add-product',  label: 'Add Product',  icon: PlusCircle },
  { id: 'orders',       label: 'Orders',       icon: ShoppingBag },
  { id: 'shipments',    label: 'Shipments',    icon: Truck },
  { id: 'payments',     label: 'Payments',     icon: CreditCard },
  { id: 'reviews',      label: 'Reviews',      icon: Star },
  { id: 'profile',  label: 'My Profile',  icon: UserRound },
  { id: 'settings',     label: 'Settings',     icon: Settings },
];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const pathSegment = location.pathname.split('/').pop() || 'overview';
  const activeSection = NAV_ITEMS.find(s => s.id === pathSegment)?.id || 'overview';

  const handleSectionChange = (id) => navigate(`/farmer-dashboard/${id}`);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':    return <DashboardOverview />;
      case 'my-products': return <MyProducts />;
      case 'add-product': return <AddProductForm />;
      case 'orders':      return <OrdersManagement />;
      case 'shipments':   return <ShipmentTracking />;
      case 'payments':    return <PaymentsSection />;
      case 'reviews':     return <ReviewsRatings />;
      case 'profile':    return <FarmerProfile />;
      case 'settings':    return <FarmerSettings />;
      default:            return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout
      role="farmer"
      portalClassName="farmer-portal"
      navItems={NAV_ITEMS}
      activeSection={activeSection}
      setActiveSection={handleSectionChange}
      onLogout={handleLogout}
    >
      {renderSection()}
    </DashboardLayout>
  );
}
