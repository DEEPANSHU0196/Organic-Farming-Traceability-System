import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, LogIn, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';

const portals = [
  { id: 'farmer', label: 'Farmer Portal', icon: Sprout, color: 'from-emerald-600 to-green-700', path: 'farmer-dashboard' },
  { id: 'login', label: 'Login', icon: LogIn, color: 'from-amber-600 to-yellow-700' },
  { id: 'buyers', label: 'Buyers', icon: ShoppingCart, color: 'from-teal-600 to-cyan-700' },
  { id: 'transporter', label: 'Transporter', icon: Truck, color: 'from-orange-600 to-red-700' },
  { id: 'admin', label: 'Admin', icon: ShieldCheck, color: 'from-indigo-600 to-violet-700' },
];

export default function PortalButtons({ onPortalSelect }) {
  const [activePortal, setActivePortal] = useState(null);
  const [hoveredPortal, setHoveredPortal] = useState(null);
  const [navigating, setNavigating] = useState(false);

  const handlePortalClick = (portal) => {
    if (portal.path) {
      setNavigating(true);
      setTimeout(() => {
        setActivePortal(null);
        onPortalSelect && onPortalSelect(portal.path);
      }, 500);
    } else {
      setActivePortal(activePortal === portal.id ? null : portal.id);
    }
  };

  return (
    <div className="w-full">
      {/* Portal Navigation */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {portals.map((portal, index) => {
          const Icon = portal.icon;
          const isActive = activePortal === portal.id;
          const isHovered = hoveredPortal === portal.id;

          return (
            <motion.button
              key={portal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.08, ease: 'easeOut' }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePortalClick(portal)}
              onMouseEnter={() => setHoveredPortal(portal.id)}
              onMouseLeave={() => setHoveredPortal(null)}
              className={`
                relative group flex items-center gap-2.5 px-5 py-2.5 rounded-full
                text-[15px] font-medium tracking-tight cursor-pointer
                transition-all duration-300 ease-out select-none
                ${isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/90 text-primary border border-surface-alt hover:bg-surface-alt/60 hover:border-accent/20'
                }
              `}
              id={`portal-btn-${portal.id}`}
            >
              {/* Glow effect on hover */}
              <motion.span
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${portal.color} opacity-0 blur-xl -z-10`}
                animate={{ opacity: isHovered && !isActive ? 0.15 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Icon */}
              <span className={`flex items-center justify-center w-5 h-5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-accent'}`}
                />
              </span>

              {/* Label */}
              <span className="relative">
                {portal.label}
                {isActive && (
                  <motion.span
                    layoutId="active-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-white/40 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </span>

              {/* Active indicator dot */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-1.5 h-1.5 rounded-full bg-gold-light ml-0.5"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Active Portal Feedback */}
      <AnimatePresence mode="wait">
        {activePortal && (
          <motion.div
            key={activePortal}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="overflow-hidden"
          >
            <div className="bg-surface/80 backdrop-blur-sm border border-surface-alt rounded-2xl px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <p className="text-sm text-primary/80">
                  {navigating ? 'Loading ' : 'Navigating to '}
                  <span className="font-semibold text-primary">{portals.find(p => p.id === activePortal)?.label}</span>
                </p>
              </div>
              {!navigating && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const portal = portals.find(p => p.id === activePortal);
                    if (portal?.path) {
                      handlePortalClick(portal);
                    }
                  }}
                  className="flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider hover:text-primary transition-colors cursor-pointer"
                >
                  {activePortal === 'farmer' ? 'Enter' : 'Coming Soon'}
                  <span className="text-lg leading-none">→</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
