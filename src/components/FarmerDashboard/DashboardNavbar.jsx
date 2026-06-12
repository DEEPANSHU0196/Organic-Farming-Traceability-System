import { motion } from 'motion/react';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function DashboardNavbar({ onToggleSidebar, sidebarOpen, onLogout }) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const notifications = [
    { id: 1, message: 'Order #1234 completed', time: '2 hours ago' },
    { id: 2, message: 'New buyer interested in your wheat', time: '5 hours ago' },
    { id: 3, message: 'Shipment #567 out for delivery', time: '1 day ago' },
  ];

  return (
    <nav className="bg-white border-b border-surface-alt px-4 md:px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
      {/* Left: Menu + Title + Search */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        {/* Toggle Sidebar Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="flex-shrink-0 p-2 hover:bg-surface-alt rounded-lg transition-colors"
          title="Toggle menu"
        >
          <Menu size={20} className="text-primary" />
        </motion.button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-surface-alt" />

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-surface-alt rounded-lg px-4 py-2 flex-1 min-w-48">
          <Search size={18} className="text-accent-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-accent-muted"
          />
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 hover:bg-surface-alt rounded-lg transition-colors"
          >
            <Bell size={20} className="text-primary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          {notificationOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-surface-alt z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-surface-alt font-medium text-sm">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 border-b border-surface-alt/50 hover:bg-surface-alt transition-colors cursor-pointer">
                    <p className="text-sm text-primary">{notif.message}</p>
                    <p className="text-xs text-accent-muted mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-surface-alt">
                <button className="text-xs text-accent hover:text-primary transition-colors font-medium">
                  View All Notifications
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </motion.button>

          {profileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-surface-alt z-50"
            >
              <div className="p-4 border-b border-surface-alt">
                <p className="text-sm font-medium text-primary">Jatin Deswal</p>
                <p className="text-xs text-accent-muted">jatin@farm.com</p>
              </div>
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-surface-alt rounded transition-colors">
                  <User size={16} />
                  Edit Profile
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-surface-alt rounded transition-colors">
                  <Settings size={16} />
                  Settings
                </button>
                <hr className="my-2 border-surface-alt" />
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}
