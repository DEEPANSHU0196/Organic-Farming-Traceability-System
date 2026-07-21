import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Truck, Package, Users,
  Map, BarChart2, Settings
} from 'lucide-react';
import DashboardLayout from '../shared/DashboardLayout';
import ModernLogisticsDashboard from '../components/TransporterDashboard/ModernLogisticsDashboard';
import AssignedDeliveries from '../components/TransporterDashboard/AssignedDeliveries';
import VehicleManagement from '../components/TransporterDashboard/VehicleManagement';
import DriverManagement from '../components/TransporterDashboard/DriverManagement';
import RouteTracking from '../components/TransporterDashboard/RouteTracking';
import ReportsSection from '../components/TransporterDashboard/ReportsSection';
import TransporterSettings from '../components/TransporterDashboard/TransporterSettings';
import NotificationCenter from '../components/TransporterDashboard/NotificationCenter';

const NAV_ITEMS = [
  { id: 'overview',   label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'deliveries', label: 'Deliveries', icon: Package },
  { id: 'vehicles',   label: 'Vehicles',   icon: Truck },
  { id: 'drivers',    label: 'Drivers',    icon: Users },
  { id: 'routes',     label: 'Routes',     icon: Map },
  { id: 'reports',    label: 'Reports',    icon: BarChart2 },
  { id: 'settings',   label: 'Settings',   icon: Settings },
];

export default function TransporterDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const pathSegment = location.pathname.split('/').pop() || 'overview';
  const activeSection = NAV_ITEMS.find(s => s.id === pathSegment)?.id || 'overview';

  const handleSectionChange = (id) => navigate(`/transporter-dashboard/${id}`);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':   return <ModernLogisticsDashboard />;
      case 'deliveries': return <AssignedDeliveries />;
      case 'vehicles':   return <VehicleManagement />;
      case 'drivers':    return <DriverManagement />;
      case 'routes':     return <RouteTracking />;
      case 'reports':    return <ReportsSection />;
      case 'settings':   return <TransporterSettings />;
      default:           return <ModernLogisticsDashboard />;
    }
  };

  return (
    <DashboardLayout
      role="transporter"
      navItems={NAV_ITEMS}
      activeSection={activeSection}
      setActiveSection={handleSectionChange}
      onLogout={handleLogout}
    >
      {renderSection()}
    </DashboardLayout>
  );
}
