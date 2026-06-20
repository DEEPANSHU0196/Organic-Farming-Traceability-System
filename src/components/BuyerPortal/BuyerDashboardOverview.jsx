import { motion } from 'motion/react';
import { ShoppingBag, Package, Star, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Total Orders', value: '24', icon: ShoppingBag, change: '+3 this month', color: '#0ea5e9', bg: '#e0f2fe' },
  { label: 'Active Orders', value: '4', icon: Package, change: '2 in transit', color: '#22c55e', bg: '#dcfce7' },
  { label: 'Reviews Given', value: '18', icon: Star, change: 'Avg. 4.7 ⭐', color: '#f59e0b', bg: '#fef3c7' },
  { label: 'Total Spent', value: '₹48,200', icon: CreditCard, change: '+₹4,800 this month', color: '#8b5cf6', bg: '#ede9fe' },
];

const recentOrders = [
  { id: 'ORD-1021', product: 'Organic Wheat', qty: '50 kg', status: 'Delivered', date: 'Jun 15', amount: '₹2,500' },
  { id: 'ORD-1022', product: 'Fresh Tomatoes', qty: '20 kg', status: 'In Transit', date: 'Jun 18', amount: '₹800' },
  { id: 'ORD-1023', product: 'Basmati Rice', qty: '25 kg', status: 'Processing', date: 'Jun 20', amount: '₹1,875' },
  { id: 'ORD-1024', product: 'Mustard Oil', qty: '5 L', status: 'Delivered', date: 'Jun 12', amount: '₹600' },
];

const recommended = [
  { name: 'Fresh Spinach', price: '₹60/kg', rating: 4.8, farmer: 'Ramu Farms', emoji: '🥬', badge: 'Organic' },
  { name: 'Alphonso Mangoes', price: '₹320/kg', rating: 4.9, farmer: 'Konkan Orchards', emoji: '🥭', badge: 'Premium' },
  { name: 'Arhar Dal', price: '₹140/kg', rating: 4.6, farmer: 'Patel Agro', emoji: '🫘', badge: 'Local' },
];

const statusColors = {
  Delivered: { bg: '#dcfce7', text: '#16a34a' },
  'In Transit': { bg: '#dbeafe', text: '#2563eb' },
  Processing: { bg: '#fef9c3', text: '#ca8a04' },
};

export default function BuyerDashboardOverview({ onNavigate }) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, Ravi! 👋</h2>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your account today.</p>
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
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              <div className="text-xs font-medium mt-2" style={{ color: s.color }}>{s.change}</div>
            </motion.div>
          );
        })}
      </div>

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
            {recentOrders.map((order) => {
              const sc = statusColors[order.status] || { bg: '#f1f5f9', text: '#64748b' };
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{order.product}</p>
                    <p className="text-xs text-slate-500">{order.id} · {order.qty} · {order.date}</p>
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
            })}
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
            {recommended.map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-sky-50 transition-colors cursor-pointer group">
                <span className="text-2xl">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{p.badge}</span>
                  </div>
                  <p className="text-xs text-slate-500">{p.farmer} · ⭐ {p.rating}</p>
                </div>
                <p className="text-sm font-bold text-sky-600 flex-shrink-0">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
