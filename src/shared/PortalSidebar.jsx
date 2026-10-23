import { motion, AnimatePresence } from 'motion/react';
import { X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BrandMark } from './ui';

export const ROLE_LABELS = {
  farmer: 'Farmer Portal',
  buyer: 'Buyer Portal',
  transporter: 'Transporter Portal',
  admin: 'Admin Portal',
};

export function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || 'U';
}

function SidebarContent({ role, items, activeSection, setActiveSection, onClose, onLogout, portalLinks }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.fullName || user?.name || 'User';
  const displayEmail = user?.email || '';

  return (
    <div className="portal-sidebar flex h-full flex-col bg-ink text-paper">
      <div className="flex items-center justify-between px-5 pb-6 pt-6">
        <button type="button" onClick={() => navigate('/')} className="flex items-center gap-2.5 text-left">
          <BrandMark size={34} dark />
          <span>
            <span className="block font-display text-lg font-semibold leading-none tracking-tight">AgroVerse</span>
            <span className="mt-1 block text-[11px] font-medium text-paper/50">{ROLE_LABELS[role]}</span>
          </span>
        </button>
        <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-lg p-2 text-paper/60 hover:bg-white/10 md:hidden">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Portal sections">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              data-tour={`nav-${item.id}`}
              onClick={() => { setActiveSection(item.id); onClose?.(); }}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[14px] font-medium transition-colors ${
                isActive ? 'text-ink' : 'text-paper/65 hover:bg-white/[0.06] hover:text-paper'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`sidebar-active-${role}`}
                  className="absolute inset-0 rounded-xl bg-paper"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              {Icon && <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} className={`relative ${isActive ? 'text-leaf' : ''}`} />}
              <span className="relative flex-1">{item.label}</span>
              {item.badge && (
                <span className={`relative rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? 'bg-leaf text-white' : 'bg-saffron/20 text-[#f0b968]'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {portalLinks.length > 0 && (
        <div className="mx-3 mt-4 border-t border-white/10 pt-4">
          <p className="px-3.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/40">Other portals</p>
          {portalLinks.map((portal) => {
            const PortalIcon = portal.icon;
            return (
              <button
                key={portal.path}
                type="button"
                onClick={() => { navigate(portal.path); onClose?.(); }}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm text-paper/60 transition-colors hover:bg-white/[0.06] hover:text-paper"
              >
                <PortalIcon size={16} />{portal.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="m-3 mt-4 rounded-2xl bg-white/[0.06] p-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf text-sm font-bold text-white">
            {getInitials(displayName)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{displayName}</span>
            <span className="block truncate text-[11px] text-paper/45">{displayEmail}</span>
          </span>
          <button
            type="button"
            onClick={() => { onLogout?.(); navigate('/'); }}
            title="Log out"
            aria-label="Log out"
            className="rounded-lg p-2 text-paper/55 transition-colors hover:bg-red-500/15 hover:text-red-300"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortalSidebar({ isOpen, onClose, portalLinks = [], items = [], ...rest }) {
  const props = { ...rest, items, portalLinks, onClose };
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 md:flex md:flex-col">
        <SidebarContent {...props} />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="sidebar-overlay"
              className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              key="sidebar-drawer"
              className="fixed left-0 top-0 z-50 h-screen w-72 md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <SidebarContent {...props} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
