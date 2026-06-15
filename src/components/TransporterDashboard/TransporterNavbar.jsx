import { motion } from 'motion/react';
import { Menu, LogOut, Bell, Settings } from 'lucide-react';

export default function TransporterNavbar({ activeSection, onMenuClick, onLogout }) {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30"
    >
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Menu and Title */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-gray-600" />
          </motion.button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{activeSection || 'Dashboard'}</h1>
            <p className="text-xs md:text-sm text-gray-500">Logistics Management System</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block"
          >
            <Settings size={20} />
          </motion.button>

          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
