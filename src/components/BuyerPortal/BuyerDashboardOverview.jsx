import { motion } from 'motion/react';
import { AnimatedNumber } from '../../shared/ui';
import { ShoppingBag, Package, Star, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBuyer } from '../../contexts/BuyerContext';
import backgroundPhoto from '../../assets/background.png';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const statusColors = {
  Delivered: { bg: '#dcfce7', text: '#16a34a' },
  Completed: { bg: '#dcfce7', text: '#16a34a' },
  'In Transit': { bg: '#dbeafe', text: '#2563eb' },
  Processing: { bg: '#fef9c3', text: '#ca8a04' },
  Pending: { bg: '#fef9c3', text: '#ca8a04' },
  Confirmed: { bg: '#dbeafe', text: '#2563eb' },
};

export default function BuyerDashboardOverview({ onNavigate }) {
  const { user } = useAuth();
  const { orders, reviews, availableProducts } = useBuyer();
  const displayName = user?.fullName || user?.name || 'there';

  // --- Compute Stats ---
  const activeOrdersCount = orders.filter(o => !['Delivered', 'Completed'].includes(o.status)).length;
  const totalSpent = orders
    .filter(o => ['Delivered', 'Completed'].includes(o.status))
    .reduce((sum, o) => sum + (o.totalAmount || (o.price ? o.price * o.quantity : 0) || 0), 0);

  const avgReview = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1) 
    : 0;

  const stats = [
    { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, change: '', color: '#0ea5e9', bg: '#e0f2fe' },
    { label: 'Active Orders', value: activeOrdersCount.toString(), icon: Package, change: '', color: '#22c55e', bg: '#dcfce7' },
    { label: 'Reviews Given', value: reviews.length.toString(), icon: Star, change: reviews.length > 0 ? `Avg. ${avgReview} ⭐` : '', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: CreditCard, change: '', color: '#8b5cf6', bg: '#ede9fe' },
  ];

  // --- Compute Recent Orders ---
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
    .slice(0, 4)
    .map(o => {
      let productNames = o.productName || 'Order';
      let totalQty = o.quantity ? `${o.quantity} ${o.unit || ''}` : '';
      
      if (o.items && o.items.length > 0) {
        productNames = o.items.map(i => i.name || i.productName).join(', ');
        totalQty = o.items.map(i => `${i.quantity} ${i.unit || ''}`).join(', ');
      }

      return {
        id: o.id,
        product: productNames,
        qty: totalQty,
        status: o.status || 'Pending',
        date: new Date(o.createdAt || o.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: `₹${(o.totalAmount || (o.price ? o.price * o.quantity : 0)).toLocaleString()}`
      };
    });

  // --- Compute Recommended ---
  // Just grabbing the top 3 highest rated or first 3 products available
  const recommended = [...availableProducts]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)
    .map(p => ({
      name: p.name,
      price: `₹${p.price}/${p.unit}`,
      rating: p.rating || 0,
      farmer: p.farmerName || 'Farmer',
      emoji: p.image || '🌾',
      badge: p.certification || 'Verified'
    }));

  return (
    <div className="buyer-overview space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1b4332] p-6 text-white shadow-xl">
        <img src={backgroundPhoto} alt="Fresh farmland" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b4332]/95 to-[#2d6a4f]/55" />
        <div className="relative">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e9c46a]">Fresh, verified, traceable</p>
          <h2 className="text-2xl font-bold text-white">Welcome back, {displayName}! 👋</h2>
          <p className="mt-1 text-sm text-white/75">See what is moving from trusted farms to your table today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <TrendingUp size={14} className="text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-800"><AnimatedNumber value={s.value} /></div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              {s.change && <div className="text-xs font-medium mt-2" style={{ color: s.color }}>{s.change}</div>}
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/70 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div><h3 className="font-semibold text-slate-800">Your buying pulse</h3><p className="mt-1 text-xs text-slate-500">Completed spend across the last six months</p></div>
          <div className="rounded-xl bg-sky-100 p-2 text-sky-600"><TrendingUp size={18} /></div>
        </div>
        <div className="h-44"><Line data={{ labels: Array.from({ length: 6 }, (_, index) => new Date(new Date().getFullYear(), new Date().getMonth() - 5 + index, 1).toLocaleDateString('en-US', { month: 'short' })), datasets: [{ label: 'Spend', data: Array.from({ length: 6 }, (_, index) => { const month = new Date().getMonth() - (5 - index); return orders.filter((order) => ['Delivered', 'Completed'].includes(order.status) && new Date(order.createdAt || order.date || 0).getMonth() === (month + 12) % 12).reduce((sum, order) => sum + (order.totalAmount || (order.price ? order.price * order.quantity : 0) || 0), 0); }), borderColor: '#0284c7', backgroundColor: 'rgba(14, 165, 233, 0.14)', fill: true, tension: 0.42, pointRadius: 4, pointBackgroundColor: '#0284c7', pointBorderColor: '#fff', pointBorderWidth: 2 }] }} options={{ responsive: true, maintainAspectRatio: false, animation: { duration: 1100, easing: 'easeOutQuart' }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ₹${Number(context.raw).toLocaleString()}` } } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } } }} /></div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
            <button
              onClick={() => onNavigate('orders')}
              className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500 text-sm">No recent orders.</div>
            ) : (
              recentOrders.map((order) => {
                const sc = statusColors[order.status] || { bg: '#f1f5f9', text: '#64748b' };
                return (
                  <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                      📦
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{order.product}</p>
                      <p className="text-xs text-slate-500 truncate">{order.id} · {order.qty} · {order.date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-800">{order.amount}</p>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: sc.bg, color: sc.text }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recommended */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recommended</h3>
            <button
              onClick={() => onNavigate('browse')}
              className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              Browse <ArrowRight size={13} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {recommended.length === 0 ? (
               <div className="py-4 text-center text-slate-500 text-sm">No products available.</div>
            ) : (
              recommended.map((p) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-sky-50 transition-colors cursor-pointer group">
                  {p.emoji.startsWith('http') || p.emoji.startsWith('data:') ? <img src={p.emoji} alt="" className="h-12 w-12 rounded-xl object-cover" /> : <span className="text-2xl">{p.emoji}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{p.badge}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{p.farmer} · ⭐ {p.rating.toFixed(1)}</p>
                  </div>
                  <p className="text-sm font-bold text-sky-600 flex-shrink-0">{p.price}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
