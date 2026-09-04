import { motion } from 'motion/react';
import { TrendingUp, Package, CheckCircle, DollarSign, ArrowUpRight, ArrowDownLeft, Plus, ShoppingCart, Sprout, CloudSun, Droplets, ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import farmerPhoto from '../../assets/background.png';
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
        backgroundColor: 'rgba(82, 183, 136, 0.18)',
        borderWidth: 3.5,
        fill: true,
        tension: 0.4,
        cubicInterpolationMode: 'monotone',
        pointBackgroundColor: '#059669',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#f4d58b',
        pointHoverBorderColor: '#173e2b',
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
        backgroundColor: ['#16b981', '#168aad', '#e9b44c', '#e8854a', '#8fb996'],
        borderColor: ['#0b8f63', '#11718c', '#c98a2e', '#c96838', '#6f9877'],
        borderWidth: 1,
        borderRadius: 12,
        borderSkipped: false,
        barPercentage: 0.68,
        categoryPercentage: 0.74,
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
    <div className="farmer-overview space-y-6">
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="farmer-hero relative overflow-hidden rounded-[1.5rem] p-6 text-white shadow-2xl md:p-8"
      >
        <img src={farmerPhoto} alt="Farmer in a field" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="farmer-hero-shade absolute inset-0" />
        <div className="absolute -right-10 -top-14 h-56 w-56 rounded-full border border-white/10 bg-white/[0.04]" />
        <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full border border-[#e9c46a]/20" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f4d58b]"><Sprout size={15} /> Live farm pulse</div>
            <h1 className="font-display text-4xl leading-none md:text-5xl">Welcome back,<br /><span className="text-[#f4d58b]">{displayName}.</span></h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/75">Your harvest is moving beautifully. Here is the latest pulse from your farm-to-market journey.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70">
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2"><CloudSun size={15} className="text-[#f4d58b]" /> Kharif season · On track</span>
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2"><Droplets size={15} className="text-[#8dd6ce]" /> Soil moisture 68%</span>
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-3 md:w-auto md:flex-col">
            <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/farmer-dashboard/add-product')} className="flex items-center justify-center gap-2 rounded-xl bg-[#f4d58b] px-5 py-3 text-sm font-bold text-[#173e2b] shadow-lg shadow-black/10 transition-colors hover:bg-white"><Plus size={17} /> Add Product</motion.button>
            <motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/farmer-dashboard/orders')} className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"><ShoppingCart size={17} /> View Orders <ArrowRight size={15} /></motion.button>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[['Field health', 'Excellent', 'All crops thriving', '#52b788'], ['Orders moving', `${activeOrdersCount} active`, 'Across your network', '#8dd6ce'], ['Next payout', 'Friday', 'Estimated settlement', '#f4d58b']].map(([label, value, detail, color], index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + index * 0.08 }} className="season-strip flex items-center justify-between rounded-2xl border border-[#dbe7dc] bg-white/75 px-4 py-3 backdrop-blur-sm">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#718278]">{label}</p><p className="mt-1 text-sm font-bold text-[#173e2b]">{value}</p><p className="text-xs text-[#8a978e]">{detail}</p></div><span className="h-3 w-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 0 5px ${color}22` }} />
          </motion.div>
        ))}
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              className="metric-tile group rounded-2xl border border-[#dbe7dc] bg-[#fffdf8] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                  <Icon className="text-white" size={21} />
                </div>
                {hasChange && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    {card.change}
                  </div>
                )}
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#718278]">{card.title}</p>
              <p className="font-display text-3xl font-bold text-[#173e2b]">{card.value}</p>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#edf2ea]"><div className="metric-progress h-full rounded-full" style={{ width: `${[76, 42, 64, 88][idx]}%` }} /></div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Monthly Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="chart-card rounded-2xl border border-[#dbe7dc] bg-[#fffdf8] p-5 shadow-sm lg:col-span-3"
        >
          <div className="mb-3 flex items-start justify-between"><div><p className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a9744f]"><Activity size={13} /> Revenue stream</p><h3 className="text-lg font-bold text-[#173e2b]">Monthly sales trend</h3></div><span className="rounded-full bg-[#e5f3e9] px-3 py-1 text-xs font-bold text-[#2d6a4f]">This year</span></div>
          <div className="h-80">
            <Line
              data={monthlySalesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1400, easing: 'easeOutQuart' },
                interaction: { intersect: false, mode: 'index' },
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#173e2b', padding: 12, cornerRadius: 10, displayColors: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(27,67,50,.08)', drawBorder: false }, ticks: { color: '#8a978e', font: { size: 10 }, padding: 8 },
                  },
                  x: {
                    grid: { display: false }, ticks: { color: '#8a978e', font: { size: 10 }, padding: 8 },
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
          className="chart-card rounded-2xl border border-[#dbe7dc] bg-[#fffdf8] p-5 shadow-sm lg:col-span-2"
        >
          <div className="mb-3 flex items-start justify-between"><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a9744f]">Your harvest mix</p><h3 className="text-lg font-bold text-[#173e2b]">Product performance</h3></div><span className="rounded-xl bg-[#f9ead2] p-2 text-[#a9744f]"><Sprout size={17} /></span></div>
          <div className="h-80">
            <Bar
              data={productPerformanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1400, easing: 'easeOutQuart' },
                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#173e2b', padding: 12, cornerRadius: 10, displayColors: false } },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(27,67,50,.08)', drawBorder: false }, ticks: { color: '#8a978e', font: { size: 10 }, padding: 8 },
                  },
                  x: {
                    grid: { display: false }, ticks: { color: '#8a978e', font: { size: 10 }, padding: 8 },
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
        className="rounded-2xl border border-[#dbe7dc] bg-[#fffdf8] p-5 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-bold text-[#173e2b]">Recent activity</h3><span className="text-xs font-semibold text-[#a9744f]">Live updates</span></div>
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
