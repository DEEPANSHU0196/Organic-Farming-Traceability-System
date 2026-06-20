import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart2, TrendingUp, Package, Truck, Clock, Download, Calendar } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', deliveries: 32, revenue: 24000, onTime: 91 },
  { month: 'Feb', deliveries: 28, revenue: 21000, onTime: 88 },
  { month: 'Mar', deliveries: 45, revenue: 33750, onTime: 93 },
  { month: 'Apr', deliveries: 38, revenue: 28500, onTime: 90 },
  { month: 'May', deliveries: 52, revenue: 39000, onTime: 94 },
  { month: 'Jun', deliveries: 41, revenue: 30750, onTime: 92 },
];

const max = Math.max(...monthlyData.map(d => d.deliveries));

const topRoutes = [
  { from: 'Delhi', to: 'Jaipur', trips: 28, avgTime: '5.5h', revenue: '₹18,400' },
  { from: 'Chandigarh', to: 'Delhi', trips: 22, avgTime: '4.0h', revenue: '₹14,300' },
  { from: 'Lucknow', to: 'Kanpur', trips: 19, avgTime: '1.5h', revenue: '₹7,600' },
  { from: 'Mumbai', to: 'Pune', trips: 16, avgTime: '3.0h', revenue: '₹12,000' },
];

export default function ReportsSection() {
  const [period, setPeriod] = useState('6m');

  const totalDeliveries = monthlyData.reduce((a, d) => a + d.deliveries, 0);
  const totalRevenue = monthlyData.reduce((a, d) => a + d.revenue, 0);
  const avgOnTime = Math.round(monthlyData.reduce((a, d) => a + d.onTime, 0) / monthlyData.length);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">Performance overview for your logistics operations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-xl p-1">
            {['1m', '3m', '6m', '1y'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${period === p ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Deliveries', value: totalDeliveries, icon: Package, color: '#fb923c', bg: '#ffedd5', suffix: '' },
          { label: 'Revenue', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, icon: TrendingUp, color: '#22c55e', bg: '#dcfce7', suffix: '' },
          { label: 'On-Time Rate', value: `${avgOnTime}%`, icon: Clock, color: '#0ea5e9', bg: '#e0f2fe', suffix: '' },
          { label: 'Active Vehicles', value: 4, icon: Truck, color: '#8b5cf6', bg: '#ede9fe', suffix: '' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: kpi.bg }}>
                <Icon size={17} style={{ color: kpi.color }} />
              </div>
              <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800">Monthly Deliveries</h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar size={12} />
            Last 6 months
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">{d.deliveries}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.deliveries / max) * 100}%` }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                className="w-full rounded-t-lg relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #fb923c, #f97316)', minHeight: 8 }}
              >
                <div className="absolute inset-0 bg-white/10" />
              </motion.div>
              <span className="text-xs text-slate-500">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Routes */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Top Routes</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {topRoutes.map((r, i) => (
            <div key={r.from + r.to} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{r.from} → {r.to}</p>
                <p className="text-xs text-slate-500 mt-0.5">Avg. {r.avgTime} · {r.trips} trips</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{r.revenue}</p>
                <p className="text-xs text-slate-500">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
