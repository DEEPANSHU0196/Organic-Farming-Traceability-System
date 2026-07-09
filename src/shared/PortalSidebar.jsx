import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut, Leaf, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Role config: accent color class, icon emoji, portal label
const ROLE_CONFIG = {
  farmer: {
    accent: '#22c55e',
    accentBg: 'rgba(34,197,94,0.15)',
    accentHover: 'rgba(34,197,94,0.08)',
    label: 'Farmer Portal',
    avatar: '🌾',
    gradient: 'from-emerald-500 to-green-600',
  },
  buyer: {
    accent: '#38bdf8',
    accentBg: 'rgba(56,189,248,0.15)',
    accentHover: 'rgba(56,189,248,0.08)',
    label: 'Buyer Portal',
    avatar: '🛒',
    gradient: 'from-sky-400 to-blue-500',
  },
  transporter: {
    accent: '#fb923c',
    accentBg: 'rgba(251,146,60,0.15)',
    accentHover: 'rgba(251,146,60,0.08)',
    label: 'Transporter Portal',
    avatar: '🚚',
    gradient: 'from-orange-400 to-amber-500',
  },
  admin: {
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.15)',
    accentHover: 'rgba(167,139,250,0.08)',
    label: 'Admin Portal',
    avatar: '🛡️',
    gradient: 'from-violet-500 to-purple-600',
  },
};

export default function PortalSidebar({
  role = 'farmer',
  items = [],
  activeSection,
  setActiveSection,
  isOpen,
  onClose,
  onLogout,
  userName = 'User',
  userEmail = 'user@agritrust.com',
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.farmer;
  const displayName = user?.fullName || user?.name || userName || 'User';
  const displayEmail = user?.email || userEmail || 'user@agritrust.com';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'U';

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div
      className="flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg, #0d1f12 0%, #122018 50%, #0d1a10 100%)' }}
    >
      {/* Logo Header */}
      <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${config.accent}33, ${config.accent}66)`, border: `1px solid ${config.accent}44` }}
          >
            <Leaf className="w-5 h-5" style={{ color: config.accent }} />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight leading-none">AgroVerse</div>
            <div className="text-xs mt-0.5 font-medium" style={{ color: config.accent + 'cc' }}>{config.label}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X size={16} className="text-white/60" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
              onClick={() => {
                setActiveSection(item.id);
                onClose?.();
              }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left group relative"
              style={{
                background: isActive ? config.accentBg : 'transparent',
                border: isActive ? `1px solid ${config.accent}33` : '1px solid transparent',
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId={`sidebar-indicator-${role}`}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{ background: config.accent }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: isActive ? config.accentBg : 'rgba(255,255,255,0.05)',
                  color: isActive ? config.accent : 'rgba(255,255,255,0.55)',
                }}
              >
                {Icon && <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />}
              </div>

              {/* Label */}
              <span
                className="text-sm font-medium transition-colors duration-200 flex-1"
                style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)' }}
              >
                {item.label}
              </span>

              {/* Badge */}
              {item.badge && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: config.accent + '33', color: config.accent }}
                >
                  {item.badge}
                </span>
              )}

              {/* Active chevron */}
              {isActive && (
                <ChevronRight size={14} style={{ color: config.accent + '99' }} className="flex-shrink-0" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-4 space-y-2 flex-shrink-0">
        {/* User info */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.04]">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">{displayName}</div>
            <div className="text-white/40 text-[10px] truncate">{displayEmail}</div>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171',
          }}
        >
          <LogOut size={15} />
          Logout
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible */}
      <div className="hidden md:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <motion.div
        className="fixed left-0 top-0 h-screen w-64 z-50 md:hidden"
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <SidebarContent />
      </motion.div>
    </>
  );
}
