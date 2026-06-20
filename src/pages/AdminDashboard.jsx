import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShoppingCart, Package,
  ClipboardList, CheckCircle, BarChart3, Settings
} from 'lucide-react';
import DashboardLayout from '../shared/DashboardLayout';
import AdminDashboardOverview from '../components/AdminPortal/AdminDashboardOverview';
import FarmersManagement from '../components/AdminPortal/FarmersManagement';
import BuyersManagement from '../components/AdminPortal/BuyersManagement';
import ProductModeration from '../components/AdminPortal/ProductModeration';
import AdminOrders from '../components/AdminPortal/AdminOrders';
import PendingApprovals from '../components/AdminPortal/PendingApprovals';
import PlatformAnalytics from '../components/AdminPortal/PlatformAnalytics';
import AdminSettings from '../components/AdminPortal/AdminSettings';

const NAV_ITEMS = [
  { id: 'overview',   label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'farmers',    label: 'Farmers',    icon: Users },
  { id: 'buyers',     label: 'Buyers',     icon: ShoppingCart },
  { id: 'products',   label: 'Products',   icon: Package },
  { id: 'orders',     label: 'Orders',     icon: ClipboardList },
  { id: 'approvals',  label: 'Approvals',  icon: CheckCircle },
  { id: 'analytics',  label: 'Analytics',  icon: BarChart3 },
  { id: 'settings',   label: 'Settings',   icon: Settings },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegment = location.pathname.split('/').pop() || 'overview';
  const activeSection = NAV_ITEMS.find(s => s.id === pathSegment)?.id || 'overview';

  const handleSectionChange = (id) => navigate(`/admin-dashboard/${id}`);
  const handleLogout = () => navigate('/');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':  return <AdminDashboardOverview onNavigate={handleSectionChange} />;
      case 'farmers':   return <FarmersManagement />;
      case 'buyers':    return <BuyersManagement />;
      case 'products':  return <ProductModeration />;
      case 'orders':    return <AdminOrders />;
      case 'approvals': return <PendingApprovals />;
      case 'analytics': return <PlatformAnalytics />;
      case 'settings':  return <AdminSettings />;
      default:          return <AdminDashboardOverview onNavigate={handleSectionChange} />;
    }
  };

  return (
    <DashboardLayout
      role="admin"
      navItems={NAV_ITEMS}
      activeSection={activeSection}
      setActiveSection={handleSectionChange}
      onLogout={handleLogout}
    >
      {renderSection()}
    </DashboardLayout>
  );
}
