import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Bell, Search, User, Settings, LogOut, X, ChevronDown, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ROLE_CONFIG = {
  farmer: {
    accent: '#22c55e',
    label: 'Farmer Portal',
    initials: 'JD',
    name: 'Jatin Deswal',
    email: 'jatin@agrofarm.com',
    gradient: 'from-emerald-500 to-green-600',
    notifications: [
      { id: 1, title: 'Order #1234 completed', time: '2 hours ago', unread: true, icon: '✅' },
      { id: 2, title: 'New buyer inquiry on Wheat', time: '5 hours ago', unread: true, icon: '💬' },
      { id: 3, title: 'Shipment #567 out for delivery', time: '1 day ago', unread: false, icon: '🚚' },
      { id: 4, title: 'Payment received ₹12,400', time: '2 days ago', unread: false, icon: '💰' },
    ],
  },
  buyer: {
    accent: '#38bdf8',
    label: 'Buyer Portal',
    initials: 'RA',
    name: 'Ravi Arora',
    email: 'ravi@example.com',
    gradient: 'from-sky-400 to-blue-500',
    notifications: [
      { id: 1, title: 'Order #AB-789 shipped', time: '1 hour ago', unread: true, icon: '📦' },
      { id: 2, title: 'New arrivals: Organic Tomatoes', time: '3 hours ago', unread: true, icon: '🍅' },
      { id: 3, title: 'Your review was liked', time: '1 day ago', unread: false, icon: '⭐' },
    ],
  },
  transporter: {
    accent: '#fb923c',
    label: 'Transporter Portal',
    initials: 'MS',
    name: 'Manish Singh',
    email: 'manish@logistics.com',
    gradient: 'from-orange-400 to-amber-500',
    notifications: [
      { id: 1, title: 'New delivery assigned — Route 12', time: '30 min ago', unread: true, icon: '🗺️' },
      { id: 2, title: 'Delivery #D-456 confirmed', time: '2 hours ago', unread: true, icon: '✅' },
      { id: 3, title: 'Vehicle inspection due tomorrow', time: '5 hours ago', unread: false, icon: '🚛' },
    ],
  },
  admin: {
    accent: '#a78bfa',
    label: 'Admin Portal',
    initials: 'AD',
    name: 'Admin User',
    email: 'admin@agritrust.com',
    gradient: 'from-violet-500 to-purple-600',
    notifications: [
      { id: 1, title: 'New farmer registration', time: '5 min ago', unread: true, icon: '👨‍🌾' },
      { id: 2, title: 'Suspicious activity detected', time: '15 min ago', unread: true, icon: '⚠️' },
      { id: 3, title: 'Product pending approval', time: '1 hour ago', unread: false, icon: '📋' },
      { id: 4, title: 'Monthly analytics ready', time: '3 hours ago', unread: false, icon: '📊' },
    ],
  },
};

export default function PortalNavbar({ role = 'farmer', onToggleSidebar, onLogout, pageTitle }) {
  const navigate = useNavigate();
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.farmer;
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = config.notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-4 sticky top-0 z-30 flex-shrink-0 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
        >
          <Menu size={20} className="text-slate-600" />
        </motion.button>

        {/* Logo on mobile */}
        <div className="md:hidden flex items-center gap-2">
          <Leaf size={18} style={{ color: config.accent }} />
          <span className="font-bold text-slate-800 text-sm">AgroVerse</span>
        </div>

        {/* Search bar — desktop */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm group focus-within:border-slate-300 focus-within:bg-white transition-all duration-200">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
          {searchVal && (
            <button onClick={() => setSearchVal('')} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Bell size={18} className="text-slate-600" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                style={{ background: config.accent }}
              >
                {unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: config.accent + '22', color: config.accent }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {config.notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 font-medium leading-snug">{n.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                      {n.unread && (
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: config.accent }} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button
                    className="text-xs font-semibold transition-colors"
                    style={{ color: config.accent }}
                  >
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
            >
              {config.initials}
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-700">{config.name.split(' ')[0]}</span>
            <ChevronDown size={14} className="hidden md:block text-slate-400" />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold mb-2`}
                  >
                    {config.initials}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{config.name}</p>
                  <p className="text-xs text-slate-500">{config.email}</p>
                  <span
                    className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5"
                    style={{ background: config.accent + '22', color: config.accent }}
                  >
                    {config.label}
                  </span>
                </div>
                <div className="p-2 space-y-0.5">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    <User size={15} className="text-slate-500" />
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    <Settings size={15} className="text-slate-500" />
                    Settings
                  </button>
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
