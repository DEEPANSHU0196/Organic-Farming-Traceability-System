import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Download, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';

const transactions = [
  { id: 'TXN-8821', product: 'Organic Wheat (50kg)', date: 'Jun 20, 2026', amount: 2500, type: 'debit', status: 'Success', method: 'UPI', orderId: 'ORD-1023' },
  { id: 'TXN-8820', product: 'Fresh Tomatoes (20kg)', date: 'Jun 18, 2026', amount: 800, type: 'debit', status: 'Success', method: 'Net Banking', orderId: 'ORD-1022' },
  { id: 'TXN-8815', product: 'Refund — Basmati Rice', date: 'Jun 14, 2026', amount: 1800, type: 'credit', status: 'Refunded', method: 'UPI', orderId: 'ORD-1019' },
  { id: 'TXN-8810', product: 'Mustard Oil (5L)', date: 'Jun 12, 2026', amount: 600, type: 'debit', status: 'Success', method: 'Credit Card', orderId: 'ORD-1018' },
  { id: 'TXN-8804', product: 'Arhar Dal (10kg)', date: 'Jun 08, 2026', amount: 1400, type: 'debit', status: 'Success', method: 'UPI', orderId: 'ORD-1015' },
  { id: 'TXN-8799', product: 'A2 Cow Ghee (500g)', date: 'Jun 05, 2026', amount: 950, type: 'debit', status: 'Pending', method: 'Wallet', orderId: 'ORD-1012' },
  { id: 'TXN-8790', product: 'Alphonso Mangoes (3kg)', date: 'Jun 01, 2026', amount: 960, type: 'debit', status: 'Success', method: 'UPI', orderId: 'ORD-1010' },
];

const paymentMethods = [
  { type: 'UPI', last4: 'Linked', icon: '📱', label: 'Ravi@ybl', default: true },
  { type: 'Credit Card', last4: '4242', icon: '💳', label: 'HDFC •••• 4242', default: false },
  { type: 'Net Banking', last4: 'SBI', icon: '🏦', label: 'State Bank of India', default: false },
];

const statusStyles = {
  Success: { bg: '#dcfce7', text: '#16a34a' },
  Pending: { bg: '#fef9c3', text: '#ca8a04' },
  Refunded: { bg: '#dbeafe', text: '#2563eb' },
  Failed: { bg: '#fee2e2', text: '#dc2626' },
};

export default function BuyerPayments() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const totalSpent = transactions.filter(t => t.type === 'debit').reduce((a, t) => a + t.amount, 0);
  const totalRefunds = transactions.filter(t => t.type === 'credit').reduce((a, t) => a + t.amount, 0);

  const filtered = transactions.filter(t => {
    const matchSearch = t.product.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.type === filter || t.status.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Payments</h2>
        <p className="text-slate-500 text-sm mt-1">Track all your transactions and payment methods</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: TrendingDown, color: '#0ea5e9', bg: '#e0f2fe', sub: 'This month' },
          { label: 'Refunds', value: `₹${totalRefunds.toLocaleString()}`, icon: TrendingUp, color: '#22c55e', bg: '#dcfce7', sub: 'Credited back' },
          { label: 'Transactions', value: transactions.length, icon: CreditCard, color: '#8b5cf6', bg: '#ede9fe', sub: 'All time' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon size={17} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              <div className="text-xs font-medium mt-1.5" style={{ color: s.color }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Saved Payment Methods</h3>
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <div key={pm.label} className="flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <span className="text-2xl">{pm.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{pm.label}</p>
                <p className="text-xs text-slate-500">{pm.type}</p>
              </div>
              {pm.default && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">Default</span>
              )}
              <button className="text-xs text-slate-400 hover:text-red-500 transition-colors">Remove</button>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-sky-400 hover:text-sky-600 transition-all">
          + Add Payment Method
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Transaction History</h3>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 text-sm">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none w-28 text-slate-700 placeholder:text-slate-400 text-xs"
              />
            </div>
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-600 outline-none focus:border-sky-400"
            >
              <option value="all">All</option>
              <option value="debit">Debits</option>
              <option value="credit">Credits</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
            </select>
            <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 transition-colors px-2">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No transactions found</div>
          ) : (
            filtered.map((txn) => {
              const sc = statusStyles[txn.status] || statusStyles.Failed;
              return (
                <div key={txn.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: txn.type === 'credit' ? '#dcfce7' : '#f0f9ff' }}
                  >
                    {txn.type === 'credit' ? '↩️' : '🛒'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{txn.product}</p>
                    <p className="text-xs text-slate-500">{txn.id} · {txn.date} · {txn.method}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${txn.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </p>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
