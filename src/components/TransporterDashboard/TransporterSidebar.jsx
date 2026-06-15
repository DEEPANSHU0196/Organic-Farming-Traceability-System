import { motion } from 'motion/react';
import { Menu, X, Truck, LogOut } from 'lucide-react';

const sidebarItems = [
  { id: 'overview', icon: '📊', label: 'Dashboard' },
  { id: 'profile', icon: '👤', label: 'My Profile' },
  { id: 'assigned-deliveries', icon: '📦', label: 'Assigned Deliveries' },
  { id: 'update-status', icon: '🔄', label: 'Update Status' },
  { id: 'route-tracking', icon: '🗺️', label: 'Route Tracking' },
  { id: 'delivery-confirmation', icon: '✅', label: 'Confirmation' },
];

export default function TransporterSidebar({ sections, activeSection, setActiveSection, isOpen, onLogout, onClose }) {
  return (
    <>
      {/* Overlay for Mobile */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-35 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -288 }}
        animate={{ x: isOpen ? 0 : -288 }}
        transition={{ duration: 0.3 }}
        className="md:hidden fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex flex-col shadow-lg z-40"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Logistics Hub</div>
              <div className="text-xs text-slate-500">Transporter</div>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                onClose();
              }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left text-sm font-medium ${
                activeSection === item.id
                  ? 'bg-green-50 text-green-700 border-l-2 border-l-green-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 flex-col shadow-sm">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Logistics Hub</div>
              <div className="text-xs text-slate-500">Transporter</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left text-sm font-medium ${
                activeSection === item.id
                  ? 'bg-green-50 text-green-700 border-l-2 border-l-green-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-200">
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </aside>
    </>
  );
}
