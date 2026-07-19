import { motion } from 'motion/react';
import { TrendingUp, Package, CheckCircle, DollarSign, ArrowUpRight, ArrowDownLeft, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
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

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, orders } = useProducts();
  const displayName = user?.fullName || user?.name || 'Farmer';

  // --- Calculate Analytics Cards ---
  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Confirmed').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;
  const totalEarnings = orders
    .filter(o => o.status === 'Completed' || o.status === 'Delivered')
    .reduce((sum, o) => sum + (o.totalAmount || (o.price * o.quantity) || 0), 0);

  const analyticsCards = [
    { id: 1, title: 'Total Products Listed', value: products.length.toString(), change: '', color: 'from-emerald-500 to-green-600', icon: Package },
    { id: 2, title: 'Active Orders', value: activeOrdersCount.toString(), change: '', color: 'from-blue-500 to-cyan-600', icon: TrendingUp },
    { id: 3, title: 'Completed Orders', value: completedOrdersCount.toString(), change: '', color: 'from-amber-500 to-yellow-600', icon: CheckCircle },
    { id: 4, title: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, change: '', color: 'from-purple-500 to-pink-600', icon: DollarSign },
  ];

  // --- Calculate Monthly Sales Chart ---
  const currentYear = new Date().getFullYear();
  const monthlyData = new Array(12).fill(0);
  orders.forEach(o => {
    if (o.status === 'Completed' || o.status === 'Delivered') {
      const orderDate = new Date(o.date || o.createdAt);
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth();
        const amount = o.totalAmount || (o.price * o.quantity) || 0;
        monthlyData[month] += amount / 1000; // in thousands
      }
    }
  });

  const monthlySalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales (₹1000s)',
        data: monthlyData,
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

  // --- Calculate Product Performance Chart ---
  const productSales = {};
  orders.forEach(o => {
    if (o.items && Array.isArray(o.items)) {
      o.items.forEach(item => {
        const name = item.name || item.productName || 'Unknown';
        productSales[name] = (productSales[name] || 0) + (Number(item.quantity) || 0);
      });
    } else {
      const name = o.productName || 'Unknown';
      productSales[name] = (productSales[name] || 0) + (Number(o.quantity) || 0);
    }
  });

  const sortedProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
  
  const productPerformanceData = {
    labels: sortedProducts.length > 0 ? sortedProducts.map(p => p[0]) : ['No Data'],
    datasets: [
      {
        label: 'Units Sold',
        data: sortedProducts.length > 0 ? sortedProducts.map(p => p[1]) : [0],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // --- Calculate Recent Activity ---
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `Just now`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const allEvents = [
    ...products.map(p => ({ type: 'product', data: p, date: new Date(p.createdAt || Date.now()) })),
    ...orders.map(o => ({ type: 'order', data: o, date: new Date(o.date || o.createdAt || Date.now()) }))
  ].sort((a, b) => b.date - a.date).slice(0, 5);

  const recentActivities = allEvents.map(event => {
    if (event.type === 'product') {
      return {
        action: 'Product Listed',
        desc: `New ${event.data.name} listing - ${event.data.quantity} ${event.data.unit}`,
        time: formatTimeAgo(event.date)
      };
    } else {
      let desc = `Buyer ordered ${event.data.quantity} ${event.data.unit} ${event.data.productName || 'products'}`;
      if (event.data.items && Array.isArray(event.data.items)) {
         desc = `Buyer ordered ${event.data.items.length} product(s)`;
      }
      return {
        action: 'Order Received',
        desc,
        time: formatTimeAgo(event.date)
      };
    }
  });

  if (recentActivities.length === 0) {
    recentActivities.push({
      action: 'No Activity',
      desc: 'No recent activity to show.',
      time: ''
    });
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with Action Buttons */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}! 👋</h1>
            <p className="text-white/90">Here's your farm's performance summary for this month</p>
          </div>
          <div className="flex gap-3 flex-wrap md:flex-nowrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/farmer-dashboard/add-product')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              <Plus size={18} />
              Add Product
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/farmer-dashboard/orders')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              <ShoppingCart size={18} />
              View Orders
            </motion.button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, idx) => {
          const Icon = card.icon;
          const isPositive = card.change && card.change.includes('+');
          const hasChange = card.change !== '';

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
                {hasChange && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    {card.change}
                  </div>
                )}
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
          {recentActivities.map((activity, idx) => (
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
