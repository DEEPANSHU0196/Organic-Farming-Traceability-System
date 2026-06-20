import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Eye, Truck, CheckCircle, Clock, XCircle, Package, User, MapPin } from 'lucide-react';

const ORDERS = [
  { id: 'ORD-7821', farmer: 'Ramesh Kumar', buyer: 'Green Valley Mart', product: 'Organic Wheat (50kg)', amount: '₹3,200', date: '20 Jun 2026', status: 'delivered', transporter: 'Manish Singh' },
  { id: 'ORD-7820', farmer: 'Sunita Devi', buyer: 'FreshMart Online', product: 'Basmati Rice (100kg)', amount: '₹8,500', date: '19 Jun 2026', status: 'in-transit', transporter: 'Ravi Transport' },
  { id: 'ORD-7819', farmer: 'Harpreet Singh', buyer: 'Spice Garden Ltd', product: 'Turmeric (20kg)', amount: '₹2,100', date: '18 Jun 2026', status: 'processing', transporter: 'Not assigned' },
  { id: 'ORD-7818', farmer: 'Priya Farms', buyer: 'Nature Basket', product: 'Cherry Tomatoes (30kg)', amount: '₹1,800', date: '18 Jun 2026', status: 'cancelled', transporter: 'N/A' },
  { id: 'ORD-7817', farmer: 'Anita Patel', buyer: 'HomeChef Foods', product: 'Spinach (15kg)', amount: '₹900', date: '17 Jun 2026', status: 'delivered', transporter: 'Fast Courier' },
  { id: 'ORD-7816', farmer: 'Devendra Yadav', buyer: 'Organic Hub', product: 'Mango (200kg)', amount: '₹14,000', date: '17 Jun 2026', status: 'in-transit', transporter: 'AgriTrans' },
  { id: 'ORD-7815', farmer: 'Kavita Sharma', buyer: 'City Fresh Store', product: 'Potato (100kg)', amount: '₹3,500', date: '16 Jun 2026', status: 'processing', transporter: 'Not assigned' },
  { id: 'ORD-7814', farmer: 'Mahesh Gupta', buyer: 'Veggie Direct', product: 'Onion (150kg)', amount: '₹4,200', date: '15 Jun 2026', status: 'delivered', transporter: 'QuickShip' },
];

const STATUS_STYLES = {
  delivered:   { label: 'Delivered',   bg: 'rgba(34,197,94,0.12)',    color: '#16a34a', icon: CheckCircle },
  'in-transit':{ label: 'In Transit',  bg: 'rgba(56,189,248,0.12)',   color: '#0369a1', icon: Truck },
  processing:  { label: 'Processing',  bg: 'rgba(251,146,60,0.12)',   color: '#c2410c', icon: Clock },
  cancelled:   { label: 'Cancelled',   bg: 'rgba(239,68,68,0.12)',    color: '#dc2626', icon: XCircle },
};

const TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'in-transit', label: 'In Transit' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = ORDERS.filter((o) => {
    const matchTab = activeTab === 'all' || o.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.farmer.toLowerCase().includes(q) ||
      o.buyer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Orders Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">Monitor all platform orders and their statuses</p>
        </div>
        <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-2 text-center">
          <p className="text-xl font-bold text-violet-700">{ORDERS.length}</p>
          <p className="text-[10px] text-violet-500">Total Orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex-1">
            <Search size={15} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, farmer, buyer or product..."
              className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0">
            <Filter size={14} />
            Filters
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Order ID', 'Farmer', 'Buyer', 'Product', 'Amount', 'Date', 'Status', 'Action'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order, i) => {
                const st = STATUS_STYLES[order.status];
                const StIcon = st.icon;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-bold text-violet-700 whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">
                          {order.farmer.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-700 whitespace-nowrap">{order.farmer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{order.buyer}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 max-w-[160px] truncate">{order.product}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800 whitespace-nowrap">{order.amount}</td>
                    <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">{order.date}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ background: st.bg, color: st.color }}>
                        <StIcon size={11} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 hover:bg-violet-50 rounded-lg transition-colors text-violet-600"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Package size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-2"
                style={{
                  background: STATUS_STYLES[selectedOrder.status].bg,
                  color: STATUS_STYLES[selectedOrder.status].color
                }}>
                {STATUS_STYLES[selectedOrder.status].label}
              </span>
            </div>
            <div className="p-5 space-y-4">
              {[
                { icon: User, label: 'Farmer', value: selectedOrder.farmer },
                { icon: User, label: 'Buyer', value: selectedOrder.buyer },
                { icon: Package, label: 'Product', value: selectedOrder.product },
                { icon: Truck, label: 'Transporter', value: selectedOrder.transporter },
                { icon: MapPin, label: 'Date', value: selectedOrder.date },
              ].map((row) => {
                const RI = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RI size={15} className="text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">{row.label}</p>
                      <p className="text-sm font-medium text-slate-800">{row.value}</p>
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">Order Amount</p>
                <p className="text-2xl font-bold text-slate-800">{selectedOrder.amount}</p>
              </div>
            </div>
            <div className="p-4 flex gap-3 border-t border-slate-100">
              <button className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                Mark Resolved
              </button>
              <button onClick={() => setSelectedOrder(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
