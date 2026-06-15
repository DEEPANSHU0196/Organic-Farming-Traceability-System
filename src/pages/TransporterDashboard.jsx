import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDashboard } from '../contexts/DashboardContext';
import TransporterSidebar from '../components/TransporterDashboard/TransporterSidebar';
import ModernLogisticsDashboard from '../components/TransporterDashboard/ModernLogisticsDashboard';
import TransporterProfile from '../components/TransporterDashboard/TransporterProfile';
import AssignedDeliveries from '../components/TransporterDashboard/AssignedDeliveries';
import UpdateShipmentStatus from '../components/TransporterDashboard/UpdateShipmentStatus';
import RouteTracking from '../components/TransporterDashboard/RouteTracking';
import DeliveryConfirmation from '../components/TransporterDashboard/DeliveryConfirmation';

const dashboardSections = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'profile', label: 'My Profile' },
  { id: 'assigned-deliveries', label: 'Assigned Deliveries' },
  { id: 'update-status', label: 'Update Status' },
  { id: 'route-tracking', label: 'Route Tracking' },
  { id: 'delivery-confirmation', label: 'Confirmation' },
];

export default function TransporterDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, closeSidebar } = useDashboard();

  const pathSegment = location.pathname.split('/').pop() || 'overview';
  const activeSection = dashboardSections.find(s => s.id === pathSegment)?.id || 'overview';

  const handleSectionChange = (sectionId) => {
    navigate(`/transporter-dashboard/${sectionId}`);
    closeSidebar();
  };

  const handleLogout = () => {
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <TransporterProfile />;
      case 'assigned-deliveries':
        return <AssignedDeliveries />;
      case 'update-status':
        return <UpdateShipmentStatus />;
      case 'route-tracking':
        return <RouteTracking />;
      case 'delivery-confirmation':
        return <DeliveryConfirmation />;
      case 'overview':
      default:
        return <ModernLogisticsDashboard />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-slate-50 overflow-hidden"
    >
      {/* Sidebar - Fixed */}
      <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 shadow-sm z-40 hidden md:block overflow-y-auto">
        <TransporterSidebar
          sections={dashboardSections}
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          isOpen={true}
          onLogout={handleLogout}
          onClose={closeSidebar}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed z-40">
        <TransporterSidebar
          sections={dashboardSections}
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          isOpen={sidebarOpen}
          onLogout={handleLogout}
          onClose={closeSidebar}
        />
      </div>

      {/* Main Content - Takes remaining width */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-72">
        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderSection()}
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
}
