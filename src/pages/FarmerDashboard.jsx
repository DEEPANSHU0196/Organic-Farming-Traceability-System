import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDashboard } from '../contexts/DashboardContext';
import DashboardSidebar from '../components/FarmerDashboard/DashboardSidebar';
import DashboardNavbar from '../components/FarmerDashboard/DashboardNavbar';
import DashboardOverview from '../components/FarmerDashboard/DashboardOverview';
import FarmerProfile from '../components/FarmerDashboard/FarmerProfile';
import AddProductForm from '../components/FarmerDashboard/AddProductForm';
import MyProducts from '../components/FarmerDashboard/MyProducts';
import OrdersManagement from '../components/FarmerDashboard/OrdersManagement';
import ShipmentTracking from '../components/FarmerDashboard/ShipmentTracking';
import PaymentsSection from '../components/FarmerDashboard/PaymentsSection';
import ReviewsRatings from '../components/FarmerDashboard/ReviewsRatings';
import AIFeatures from '../components/FarmerDashboard/AIFeatures';
import BlockchainVerification from '../components/FarmerDashboard/BlockchainVerification';

const dashboardSections = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'profile', label: 'My Profile' },
  { id: 'add-product', label: 'Add Product' },
  { id: 'my-products', label: 'My Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'shipment', label: 'Shipments' },
  { id: 'payments', label: 'Payments' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'ai-features', label: 'AI Features' },
  { id: 'blockchain', label: 'Blockchain' },
];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useDashboard();
  
  // Get section from URL pathname, default to 'overview'
  const pathSegment = location.pathname.split('/').pop() || 'overview';
  const activeSection = dashboardSections.find(s => s.id === pathSegment)?.id || 'overview';

  // Handle navigation when sidebar item is clicked
  const handleSectionChange = (sectionId) => {
    navigate(`/farmer-dashboard/${sectionId}`);
    closeSidebar();
  };

  // Handle logout - redirect to home
  const handleLogout = () => {
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'profile':
        return <FarmerProfile />;
      case 'add-product':
        return <AddProductForm />;
      case 'my-products':
        return <MyProducts />;
      case 'orders':
        return <OrdersManagement />;
      case 'shipment':
        return <ShipmentTracking />;
      case 'payments':
        return <PaymentsSection />;
      case 'reviews':
        return <ReviewsRatings />;
      case 'ai-features':
        return <AIFeatures />;
      case 'blockchain':
        return <BlockchainVerification />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-surface">
      {/* Sidebar Drawer */}
      <DashboardSidebar
        sections={dashboardSections}
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        isOpen={sidebarOpen}
        onLogout={handleLogout}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <DashboardNavbar
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          onLogout={handleLogout}
        />

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
    </div>
  );
}
