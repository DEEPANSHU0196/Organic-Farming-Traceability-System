import { motion } from 'motion/react';
import { TrendingUp, Package, CheckCircle, DollarSign, Star, ArrowUpRight } from 'lucide-react';
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

const stats = [
  {
    title: 'Total Products',
    value: '24',
    change: '+3',
    icon: Package,
    color: 'bg-blue-100 text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Active Orders',
    value: '12',
    change: '+5',
    icon: ShoppingCart,
    color: 'bg-emerald-100 text-emerald-600',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Completed Orders',
    value: '156',
    change: '+12',
    icon: CheckCircle,
    color: 'bg-purple-100 text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Total Earnings',
    value: '₹2,45,000',
    change: '+8.2%',
    icon: DollarSign,
    color: 'bg-amber-100 text-amber-600',
    gradient: 'from-amber-500 to-amber-600',
  },
];

const recentOrders = [
  { id: 'ORD001', buyer: 'Rajesh Kumar', product: 'Premium Wheat', qty: 100, status: 'Delivered', date: '2025-12-15' },
  { id: 'ORD002', buyer: 'Priya Sharma', product: 'Basmati Rice', qty: 50, status: 'Processing', date: '2025-12-16' },
  { id: 'ORD003', buyer: 'Amit Singh', product: 'Yellow Mustard', qty: 75, status: 'Shipped', date: '2025-12-17' },
  { id: 'ORD004', buyer: 'Deepak Patel', product: 'Organic Cotton', qty: 200, status: 'Pending', date: '2025-12-18' },
  { id: 'ORD005', buyer: 'Neha Gupta', product: 'Corn Seeds', qty: 30, status: 'Delivered', date: '2025-12-19' },
];

const myProducts = [
  { name: 'Premium Wheat', qty: '500 kg', price: '₹2,500/kg', status: 'Active', image: '🌾' },
  { name: 'Basmati Rice', qty: '300 kg', price: '₹4,500/kg', status: 'Active', image: '🍚' },
  { name: 'Yellow Mustard', qty: '150 kg', price: '₹5,500/kg', status: 'Low Stock', image: '🌱' },
];

const recentPayments = [
  { amount: '₹25,000', buyer: 'Rajesh Kumar', status: 'Completed', date: '2025-12-15' },
  { amount: '₹18,000', buyer: 'Priya Sharma', status: 'Pending', date: '2025-12-16' },
  { amount: '₹32,500', buyer: 'Amit Singh', status: 'Completed', date: '2025-12-17' },
];

const reviews = [
  { name: 'Rajesh Kumar', rating: 5, text: 'Excellent quality wheat! Very satisfied.' },
  { name: 'Priya Sharma', rating: 4, text: 'Good rice, fast delivery.' },
  { name: 'Amit Singh', rating: 5, text: 'Pure and authentic products!' },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top' },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
    x: { grid: { display: false } },
  },
};

const monthlySalesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Sales (₹1000s)',
      data: [12, 19, 15, 25, 22, 30, 28, 35, 42, 38, 45, 52],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    },
  ],
};

const revenueData = {
  labels: ['Wheat', 'Rice', 'Mustard', 'Cotton', 'Seeds'],
  datasets: [
    {
      label: 'Revenue (₹)',
      data: [45000, 38000, 28000, 35000, 16000],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'],
      borderRadius: 8,
    },
  ],
};

function ShoppingCart(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-white shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Farmer Mehta! 👨‍🌾</h1>
            <p className="text-emerald-100">Your farm is performing great this season. Keep up the excellent work!</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all backdrop-blur"
            >
              + Add Product
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-all"
            >
              View Orders
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight size={16} />
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
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
          className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">Monthly Sales</h3>
          <div className="h-64">
            <Line data={monthlySalesData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Revenue Overview Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue by Product</h3>
          <div className="h-64">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Buyer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentOrders.map((order, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + idx * 0.05 }}
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.buyer}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.product}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.qty} kg</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Three Column Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* My Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">My Products</h3>
          </div>
          <div className="space-y-4 p-6">
            {myProducts.map((product, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className="flex items-start gap-3 cursor-pointer"
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                  {typeof product.image === 'string' && (product.image.startsWith('http://') || product.image.startsWith('https://') || product.image.startsWith('data:image/')) ? (
                    <img src={product.image} alt="Product" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl">{product.image || '🌾'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{product.name}</p>
                  <p className="text-sm text-slate-600">{product.qty}</p>
                  <p className="text-sm font-medium text-slate-900">{product.price}</p>
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                      product.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Recent Payments</h3>
          </div>
          <div className="space-y-4 p-6">
            {recentPayments.map((payment, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between pb-4 border-b border-slate-100 last:pb-0 last:border-0"
              >
                <div>
                  <p className="font-semibold text-slate-900">{payment.amount}</p>
                  <p className="text-xs text-slate-600">{payment.buyer}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === 'Completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {payment.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Customer Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Customer Reviews</h3>
          </div>
          <div className="space-y-4 p-6">
            {reviews.map((review, idx) => (
              <motion.div key={idx} whileHover={{ y: -2 }} className="pb-4 border-b border-slate-100 last:pb-0 last:border-0">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                    />
                  ))}
                </div>
                <p className="font-semibold text-sm text-slate-900">{review.name}</p>
                <p className="text-xs text-slate-600 mt-1">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
