import { motion } from 'motion/react';
import { TrendingUp, Package, CheckCircle, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const analyticsCards = [
  { id: 1, title: 'Total Products Listed', value: '24', change: '+3', color: 'from-emerald-500 to-green-600', icon: Package },
  { id: 2, title: 'Active Orders', value: '12', change: '+5', color: 'from-blue-500 to-cyan-600', icon: TrendingUp },
  { id: 3, title: 'Completed Orders', value: '156', change: '+12', color: 'from-amber-500 to-yellow-600', icon: CheckCircle },
  { id: 4, title: 'Total Earnings', value: '₹2,45,000', change: '+8.2%', color: 'from-purple-500 to-pink-600', icon: DollarSign },
];

const monthlySalesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Monthly Sales (₹1000s)',
      data: [12, 19, 3, 5, 2, 3, 9, 15, 20, 25, 18, 22],
      borderColor: '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#059669',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
    },
  ],
};

const productPerformanceData = {
  labels: ['Wheat', 'Rice', 'Corn', 'Mustard', 'Cotton'],
  datasets: [
    {
      label: 'Units Sold',
      data: [120, 95, 70, 85, 60],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Jatin! 👋</h1>
        <p className="text-white/90">Here's your farm's performance summary for this month</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, idx) => {
          const Icon = card.icon;
          const isPositive = card.change.includes('+');

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md border border-surface-alt hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  {card.change}
                </div>
              </div>
              <p className="text-accent-muted text-sm mb-2">{card.title}</p>
              <p className="text-3xl font-bold text-primary">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-md border border-surface-alt"
        >
          <h3 className="text-lg font-bold text-primary mb-4">Monthly Sales Trend</h3>
          <div className="h-80">
            <Line
              data={monthlySalesData}
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

        {/* Product Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-md border border-surface-alt"
        >
          <h3 className="text-lg font-bold text-primary mb-4">Product Performance</h3>
          <div className="h-80">
            <Bar
              data={productPerformanceData}
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
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg p-6 shadow-md border border-surface-alt"
      >
        <h3 className="text-lg font-bold text-primary mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Order Received', desc: 'Buyer ordered 50 kg Wheat', time: '2 hours ago' },
            { action: 'Product Listed', desc: 'New Mustard listing - 200 kg', time: '5 hours ago' },
            { action: 'Payment Received', desc: '₹12,500 from Order #1245', time: '1 day ago' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 pb-3 border-b border-surface-alt/50 last:pb-0 last:border-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">{activity.action}</p>
                <p className="text-xs text-accent-muted mt-1">{activity.desc}</p>
              </div>
              <p className="text-xs text-accent-muted whitespace-nowrap">{activity.time}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
