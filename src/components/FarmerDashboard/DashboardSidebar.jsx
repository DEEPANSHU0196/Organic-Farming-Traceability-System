import { motion } from 'motion/react';
import { Menu, X, Leaf, LogOut } from 'lucide-react';

const sidebarItems = [
  { id: 'overview', icon: '📊', label: 'Dashboard' },
  { id: 'profile', icon: '👤', label: 'My Profile' },
  { id: 'add-product', icon: '➕', label: 'Add Product' },
  { id: 'my-products', icon: '🌾', label: 'My Products' },
  { id: 'orders', icon: '📦', label: 'Orders' },
  { id: 'shipment', icon: '🚚', label: 'Shipments' },
  { id: 'payments', icon: '💰', label: 'Payments' },
  { id: 'reviews', icon: '⭐', label: 'Reviews' },
  { id: 'ai-features', icon: '🤖', label: 'AI Features' },
  { id: 'blockchain', icon: '🔗', label: 'Blockchain' },
];

export default function DashboardSidebar({ sections, activeSection, setActiveSection, isOpen, onLogout, onClose }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-39"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 bg-primary text-white flex flex-col shadow-2xl z-40"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">AgriTrust</div>
              <div className="text-xs text-white/60">Farmer Portal</div>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                activeSection === item.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
              {activeSection === item.id && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto w-1 h-6 bg-white rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
