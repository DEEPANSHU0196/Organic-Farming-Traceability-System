import { useState } from 'react';
import { motion } from 'motion/react';
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
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      {/* Sidebar */}
      <DashboardSidebar
        sections={dashboardSections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <DashboardNavbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
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
