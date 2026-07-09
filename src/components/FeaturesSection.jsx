import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import {
  Package, TrendingUp, CreditCard,
  Search, ShoppingBag, Clock,
  Truck, Map, BarChart3,
  Users, CheckCircle, LineChart,
  ChevronRight,
} from 'lucide-react';

const PORTALS = [
  {
    id: 'farmer',
    emoji: '🌾',
    title: 'Farmer Portal',
    subtitle: 'Grow & Sell Smarter',
    accent: '#22c55e',
    accentLight: 'rgba(34,197,94,0.10)',
    accentBorder: 'rgba(34,197,94,0.20)',
    gradient: 'from-emerald-500 to-green-700',
    features: [
      { icon: Package,    label: 'Product Management',  desc: 'List and manage your farm produce with ease' },
      { icon: TrendingUp, label: 'Order Tracking',       desc: 'Real-time status on every incoming order' },
      { icon: CreditCard, label: 'Payments',             desc: 'Secure and fast payment settlement' },
    ],
    path: '/farmer-dashboard',
  },
  {
    id: 'buyer',
    emoji: '🛒',
    title: 'Buyer Portal',
    subtitle: 'Source Fresh, Buy Confident',
    accent: '#38bdf8',
    accentLight: 'rgba(56,189,248,0.10)',
    accentBorder: 'rgba(56,189,248,0.20)',
    gradient: 'from-sky-400 to-blue-600',
    features: [
      { icon: Search,     label: 'Browse Products',  desc: 'Discover verified produce from local farmers' },
      { icon: ShoppingBag,label: 'Place Orders',     desc: 'One-click ordering with transparent pricing' },
      { icon: Clock,      label: 'Order History',    desc: 'Full history with receipts and tracking' },
    ],
    path: '/buyer-dashboard',
  },
  {
    id: 'transporter',
    emoji: '🚚',
    title: 'Transporter Portal',
    subtitle: 'Move More, Earn More',
    accent: '#fb923c',
    accentLight: 'rgba(251,146,60,0.10)',
    accentBorder: 'rgba(251,146,60,0.20)',
    gradient: 'from-orange-400 to-amber-600',
    features: [
      { icon: Truck,     label: 'Delivery Tracking',     desc: 'Track all assigned deliveries in real time' },
      { icon: Map,       label: 'Route Management',      desc: 'Optimised routes to save fuel and time' },
      { icon: BarChart3, label: 'Logistics Dashboard',   desc: 'Earnings, vehicles, and driver analytics' },
    ],
    path: '/transporter-dashboard',
  },
  {
    id: 'admin',
    emoji: '🛡️',
    title: 'Admin Portal',
    subtitle: 'Govern the Ecosystem',
    accent: '#a78bfa',
    accentLight: 'rgba(167,139,250,0.10)',
    accentBorder: 'rgba(167,139,250,0.20)',
    gradient: 'from-violet-500 to-purple-700',
    features: [
      { icon: Users,        label: 'User Management',      desc: 'Approve, suspend or manage all users' },
      { icon: CheckCircle,  label: 'Product Approvals',    desc: 'Review and publish farmer listings' },
      { icon: LineChart,    label: 'Analytics Dashboard',  desc: 'Platform-wide KPIs and growth metrics' },
    ],
    path: '/admin-dashboard',
  },
];

function PortalCard({ portal, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 cursor-default"
      style={{
        borderColor: hovered ? portal.accentBorder : 'rgba(0,0,0,0.07)',
        boxShadow: hovered
          ? `0 20px 60px ${portal.accent}22, 0 4px 16px rgba(0,0,0,0.06)`
          : '0 2px 8px rgba(0,0,0,0.05)',
        background: hovered ? portal.accentLight : '#fff',
      }}
    >
      {/* Card Header */}
      <div
        className="px-7 pt-8 pb-6"
        style={{ background: hovered ? portal.accentLight : 'transparent' }}
      >
        {/* Emoji icon with gradient bg */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center text-2xl shadow-md mb-5 transition-transform duration-300 ${hovered ? 'scale-110' : ''}`}
        >
          {portal.emoji}
        </div>
        <h3 className="text-xl font-bold text-primary font-display">{portal.title}</h3>
        <p className="text-sm mt-1 font-medium" style={{ color: portal.accent }}>{portal.subtitle}</p>
      </div>

      {/* Feature List */}
      <div className="flex-1 px-7 pb-7 space-y-4">
        {portal.features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div key={feat.label} className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
                style={{
                  background: hovered ? portal.accentLight : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${hovered ? portal.accentBorder : 'transparent'}`,
                }}
              >
                <Icon size={16} style={{ color: hovered ? portal.accent : '#738273' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">{feat.label}</p>
                <p className="text-xs text-accent-muted mt-0.5 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA row */}
      <div
        className="px-7 py-4 border-t flex items-center justify-between transition-all duration-200"
        style={{
          borderColor: hovered ? portal.accentBorder : 'rgba(0,0,0,0.06)',
          background: hovered ? `${portal.accent}08` : 'transparent',
        }}
      >
        <span className="text-xs font-semibold text-accent-muted">Explore Portal</span>
        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} style={{ color: portal.accent }} />
        </motion.div>
      </div>

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, ${portal.accent}, transparent)` }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  );
}

export default function FeaturesSection() {
  const { user, isAuthenticated } = useAuth();
  const normalizedRole = user?.role === 'consumer' || user?.role === 'buyer' ? 'buyer' : user?.role;
  const visiblePortals = !isAuthenticated
    ? PORTALS
    : PORTALS.filter((portal) => portal.id === normalizedRole);

  return (
    <section id="features" className="relative py-24 px-6 sm:px-8 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-surface/60 to-white pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 mb-5">
              ✦ Platform Features
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-primary font-display tracking-tight leading-tight mb-5">
              One Platform,<br />
              <span className="text-accent">Four Powerful Portals</span>
            </h2>
            <p className="text-base sm:text-lg text-accent-muted max-w-2xl mx-auto leading-relaxed">
              AgroVerse brings the entire agricultural supply chain under one roof — purpose-built tools for every stakeholder in the ecosystem.
            </p>
          </motion.div>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visiblePortals.map((portal, i) => (
            <PortalCard key={portal.id} portal={portal} index={i} />
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-accent-muted"
        >
          {['100% Frontend Simulated', 'Mobile Responsive', 'Zero Setup Required', 'Instant Navigation'].map((item, i) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
