import { motion } from 'motion/react';
import { TrendingUp, Wallet, Clock, CheckCircle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const revenueData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
  datasets: [
    {
      label: 'Revenue (₹)',
      data: [50000, 75000, 85000, 120000, 145000],
      borderColor: '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
  ],
};

const transactions = [
  { id: 1, order: '#OD001', amount: 250000, status: 'Paid', date: '2025-12-15' },
  { id: 2, order: '#OD002', amount: 225000, status: 'Pending', date: '2025-12-14' },
  { id: 3, order: '#OD003', amount: 180000, status: 'Paid', date: '2025-12-13' },
  { id: 4, order: '#OD004', amount: 360000, status: 'Paid', date: '2025-12-12' },
  { id: 5, order: '#OD005', amount: 95000, status: 'Pending', date: '2025-12-11' },
];

export default function PaymentsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Payments & Revenue</h1>
        <p className="text-accent-muted">Manage your earnings and payment history</p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Earnings',
            value: '₹11,10,000',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-600',
          },
          {
            title: 'Pending Payments',
            value: '₹3,20,000',
            icon: Clock,
            color: 'from-amber-500 to-yellow-600',
          },
          {
            title: 'Paid Payments',
            value: '₹7,90,000',
            icon: CheckCircle,
            color: 'from-blue-500 to-cyan-600',
          },
          {
            title: 'Wallet Balance',
            value: '₹1,50,000',
            icon: Wallet,
            color: 'from-purple-500 to-pink-600',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md border border-surface-alt"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-accent-muted text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt p-6"
      >
        <h3 className="text-lg font-bold text-primary mb-4">Revenue Trend</h3>
        <div className="h-80">
          <Line
            data={revenueData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'top' },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: '#f1f3f1' },
                },
                x: {
                  grid: { display: false },
                },
              },
            }}
          />
        </div>
      </motion.div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden"
      >
        <div className="p-6 border-b border-surface-alt">
          <h3 className="text-lg font-bold text-primary">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-primary">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-alt">
              {transactions.map((tx) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f1f3f1' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-primary">{tx.order}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">₹{tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        tx.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-accent-muted">{tx.date}</td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      View
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Bank Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt p-6"
      >
        <h3 className="text-lg font-bold text-primary mb-4">Bank Account</h3>
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg p-6 text-white mb-4">
          <p className="text-sm text-white/80 mb-1">Account Holder</p>
          <p className="text-lg font-bold mb-4">Jatin Deswal</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/80">Account Number</p>
              <p className="font-mono text-sm">**** **** **** 5678</p>
            </div>
            <div>
              <p className="text-sm text-white/80">IFSC Code</p>
              <p className="font-mono text-sm">HDFC0001234</p>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          Update Bank Account
        </motion.button>
      </motion.div>
    </div>
  );
}
