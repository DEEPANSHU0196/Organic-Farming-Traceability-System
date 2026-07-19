import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users, ShoppingCart, Package, TrendingUp, TrendingDown,
  CheckCircle, Clock, AlertTriangle, ArrowRight,
  BarChart3, Activity, Star, Truck
} from 'lucide-react';
import api from '../../api/axios';

const RECENT_APPROVALS = [
  { id: 1, name: 'Ramesh Kumar', type: 'Farmer', product: 'Organic Wheat', status: 'pending', time: '5 min ago' },
  { id: 2, name: 'Sunita Devi', type: 'Farmer', product: 'Basmati Rice', status: 'approved', time: '12 min ago' },
  { id: 3, name: 'Vikram Transport Co.', type: 'Transporter', product: 'Vehicle Registration', status: 'pending', time: '25 min ago' },
  { id: 4, name: 'Fresh Greens Ltd', type: 'Buyer', product: 'Bulk Order #B-2341', status: 'approved', time: '1 hr ago' },
  { id: 5, name: 'Harpreet Singh', type: 'Farmer', product: 'Turmeric Premium', status: 'rejected', time: '2 hr ago' },
];

const WEEKLY_DATA = [40, 65, 48, 72, 55, 88, 74];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function MiniBarChart() {
  const max = Math.max(...WEEKLY_DATA);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {WEEKLY_DATA.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: 'easeOut' }}
            style={{
              height: `${(v / max) * 56}px`,
              background: i === 6 ? '#a78bfa' : 'rgba(167,139,250,0.3)',
              borderRadius: '3px 3px 0 0',
              transformOrigin: 'bottom',
            }}
            className="w-full"
          />
          <span className="text-[9px] text-slate-400">{DAYS[i]}</span>
        </div>
      ))}
    </div>
  );
}

const STATUS_STYLES = {
  pending: { bg: 'rgba(251,146,60,0.12)', color: '#fb923c', label: 'Pending' },
  approved: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: 'Approved' },
  rejected: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Rejected' },
};

export default function AdminDashboardOverview({ onNavigate }) {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [counts, setCounts] = useState({ farmers: 0, buyers: 0, products: 0, revenue: 0, pendingApprovals: 0, activeOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get('/users'),
          api.get('/products/all'),
          api.get('/orders'),
        ]);

        const allUsers = usersRes?.data?.users || [];
        const allProducts = productsRes?.data?.products || [];
        const allOrders = ordersRes?.data?.orders || [];

        const farmersCount = allUsers.filter(u => u.role === 'farmer').length;
        const buyersCount = allUsers.filter(u => u.role === 'buyer' || u.role === 'consumer').length;
        const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const pendingProductsCount = allProducts.filter(p => p.status === 'pending').length;
        const activeOrdersCount = allOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

        setCounts({
          farmers: farmersCount,
          buyers: buyersCount,
          products: allProducts.length,
          revenue: totalRevenue,
          pendingApprovals: pendingProductsCount,
          activeOrders: activeOrdersCount
        });
      } catch (err) {
        console.error('Failed to fetch platform statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlatformStats();
  }, []);

  const stats = [
    { label: 'Total Farmers', value: String(counts.farmers), change: '+0%', up: true, icon: Users, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Active Buyers', value: String(counts.buyers), change: '+0%', up: true, icon: ShoppingCart, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
    { label: 'Products Listed', value: String(counts.products), change: '+0%', up: true, icon: Package, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { label: 'Revenue (₹)', value: `₹${counts.revenue.toLocaleString()}`, change: '+0%', up: true, icon: BarChart3, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
  ];

  const quickActions = [
    { label: 'Review Pending', icon: Clock, count: counts.pendingApprovals, color: '#fb923c', section: 'approvals' },
    { label: 'Reported Issues', icon: AlertTriangle, count: 0, color: '#ef4444', section: 'analytics' },
    { label: 'New Registrations', icon: Users, count: counts.farmers + counts.buyers, color: '#22c55e', section: 'farmers' },
    { label: 'Active Orders', icon: Truck, count: counts.activeOrders, color: '#38bdf8', section: 'orders' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #6d28d9 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Welcome back, Admin 👋</h2>
            <p className="text-white/70 text-sm mt-1">Here's what's happening on AgroVerse today.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm bg-white/15 rounded-xl px-4 py-2">
            <Activity size={15} />
            <span>Platform is running smoothly</span>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
              className="bg-white border border-slate-100 rounded-2xl p-5 cursor-default transition-shadow duration-200"
              style={{ boxShadow: hoveredStat === i ? '0 8px 24px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                   <Icon size={18} style={{ color: s.color }} />
                </div>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Middle Row: Quick Actions + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((qa) => {
              const Icon = qa.icon;
              return (
                <motion.button
                  key={qa.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate?.(qa.section)}
                  className="flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-200 text-left"
                  style={{ borderColor: qa.color + '30', background: qa.color + '08' }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: qa.color + '20' }}>
                    <Icon size={16} style={{ color: qa.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">{qa.count}</p>
                    <p className="text-xs text-slate-500">{qa.label}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Weekly Orders</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">This week</span>
          </div>
          <MiniBarChart />
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
            <div className="flex-1">
              <p className="text-xs text-slate-500">Total Orders</p>
              <p className="text-lg font-bold text-slate-800">442</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">Completed</p>
              <p className="text-lg font-bold text-emerald-600">386</p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-lg font-bold text-amber-600">56</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Approvals Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-800">Recent Approvals</h3>
          <button
            onClick={() => onNavigate?.('approvals')}
            className="text-xs font-semibold text-violet-600 flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {RECENT_APPROVALS.map((item) => {
            const st = STATUS_STYLES[item.status];
            return (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400 truncate">{item.product}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: 'rgba(167,139,250,0.12)', color: '#7c3aed' }}>
                  {item.type}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: st.bg, color: st.color }}>
                  {st.label}
                </span>
                <span className="text-xs text-slate-400 flex-shrink-0 hidden sm:block">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Farmer Satisfaction', value: 94, icon: '🌾', color: '#22c55e' },
          { label: 'On-time Deliveries', value: 87, icon: '🚚', color: '#38bdf8' },
          { label: 'Dispute Resolution', value: 98, icon: '⚖️', color: '#a78bfa' },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</span>
            </div>
            <p className="text-xs font-semibold text-slate-700 mb-2">{item.label}</p>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
