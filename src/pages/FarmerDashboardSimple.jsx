import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Home,
  Package,
  Plus,
  ShoppingCart,
  DollarSign,
  Star,
  Settings,
  ChevronDown,
} from 'lucide-react';
import DashboardContent from '../components/DashboardContent';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'products', label: 'My Products', icon: Package },
  { id: 'add-product', label: 'Add Product', icon: Plus },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'payments', label: 'Payments', icon: DollarSign },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, message: 'New order received for your wheat', time: '2 hours ago' },
    { id: 2, message: 'Payment of ₹15,000 received', time: '5 hours ago' },
    { id: 3, message: 'Customer left a 5-star review', time: '1 day ago' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 lg:hidden z-40"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -288 }}
        animate={{ x: sidebarOpen ? 0 : -288 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:relative w-72 h-screen bg-slate-900 text-white flex flex-col shadow-xl z-50 lg:z-0"
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold text-white text-lg">
              A
            </div>
            <div>
              <h1 className="text-lg font-bold">AgriTrust</h1>
              <p className="text-xs text-slate-400">Farmer Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1 h-6 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2 flex-1 max-w-md">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, products..."
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-200 font-semibold text-sm text-slate-900">
                    Notifications
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        whileHover={{ backgroundColor: '#f8f9fa' }}
                        className="px-4 py-3 border-b border-slate-100 last:border-0 cursor-pointer"
                      >
                        <p className="text-sm text-slate-900">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  FM
                </div>
                <ChevronDown size={16} className="text-slate-600" />
              </motion.button>

              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
                >
                  <div className="p-4 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-900">Farmer Mehta</p>
                    <p className="text-xs text-slate-500">farmer@agritrust.com</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                      My Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                      Settings
                    </button>
                    <hr className="my-2" />
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors">
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8 max-w-7xl mx-auto w-full"
          >
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'products' && (
              <div className="text-center py-12">
                <p className="text-slate-600">My Products page - coming soon</p>
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <p className="text-slate-600">Orders page - coming soon</p>
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="text-center py-12">
                <p className="text-slate-600">Payments page - coming soon</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-slate-600">Reviews page - coming soon</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
