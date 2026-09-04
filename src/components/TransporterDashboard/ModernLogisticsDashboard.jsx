import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler } from 'chart.js';
import { TrendingUp, Package, CheckCircle, AlertCircle, Bell, Search, Settings, User, MapPin, Clock, DollarSign, Menu } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useAuth } from '../../contexts/AuthContext';
import { getMyShipments } from '../../api/shipment';
import routePhoto from '../../assets/tractor.png';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

// Mock data for charts
const deliveryTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Total Deliveries',
      data: [45, 52, 48, 61, 55, 67, 42],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    },
    {
      label: 'Completed',
      data: [42, 48, 45, 58, 52, 65, 40],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1100,
    easing: 'easeOutQuart',
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { size: 13, weight: 500 },
        color: '#64748b',
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      titleFont: { size: 12, weight: 600 },
      bodyFont: { size: 12 },
      padding: 10,
      cornerRadius: 6,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(226, 232, 240, 0.5)' },
      ticks: { color: '#64748b', font: { size: 12 } },
    },
    x: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { size: 12 } },
    },
  },
};

const vehicleStatusData = {
  labels: ['Active', 'Idle', 'Maintenance'],
  datasets: [
    {
      data: [24, 8, 3],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderColor: ['#059669', '#d97706', '#dc2626'],
      borderWidth: 2,
    },
  ],
};

const notifications = [
  { id: 1, type: 'success', message: 'Activity logs initialized successfully', time: 'Just now' },
];

export default function ModernLogisticsDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleSidebar } = useDashboard();
  const { user } = useAuth();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await getMyShipments();
        if (response?.data?.success) {
          setShipments(response.data.shipments || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard shipments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const displayName = user?.fullName || user?.name || 'Transporter';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TR';

  const pendingCount = shipments.filter(s => !['Completed', 'Delivered', 'Rejected'].includes(s.status)).length;
  const completedCount = shipments.filter(s => ['Completed', 'Delivered'].includes(s.status)).length;
  const totalDistance = completedCount * 145; // Simulated distance based on real completions

  const stats = [
    {
      title: 'Pending Deliveries',
      value: String(pendingCount),
      change: '+0.0%',
      icon: Package,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-l-4 border-l-blue-600',
    },
    {
      title: 'Completed Today',
      value: String(completedCount),
      change: '+0.0%',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-l-4 border-l-green-600',
    },
    {
      title: 'Total Distance',
      value: `${totalDistance.toLocaleString()} km`,
      change: '+0.0%',
      icon: TrendingUp,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-l-4 border-l-purple-600',
    },
    {
      title: 'Active Issues',
      value: '0',
      change: '0.0%',
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-l-4 border-l-red-600',
    },
  ];

  const recentDeliveries = shipments.slice(0, 5).map(ship => {
    const destination = ship.order?.buyer?.address || 'Destination';
    return {
      id: ship._id || ship.id,
      order: ship.trackingId || `TRK-${ship._id?.substring(0, 8)}`,
      location: destination.length > 25 ? destination.substring(0, 25) + '...' : destination,
      status: ship.status || 'Assigned',
      eta: ship.status === 'Completed' || ship.status === 'Delivered' ? 'Done' : (ship.estimatedDeliveryDate ? new Date(ship.estimatedDeliveryDate).toLocaleDateString() : 'Pending'),
      distance: ship.distanceTravelledKm ? `${ship.distanceTravelledKm} km` : '145 km',
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      case 'error':
        return 'bg-red-50 border-l-4 border-l-red-500';
      case 'info':
        return 'bg-blue-50 border-l-4 border-l-blue-500';
      default:
        return 'bg-gray-50 border-l-4 border-l-gray-500';
    }
  };

  return (
    <div className="transporter-overview w-full h-full bg-slate-50">
      {/* Main Content */}
      <div className="p-6 space-y-6 overflow-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#1b4332] p-6 text-white shadow-xl">
            <img src={routePhoto} alt="Agricultural transport route" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1b4332]/95 to-[#a9744f]/45" />
            <div className="relative"><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e9c46a]">Move with confidence</p><h1 className="text-3xl font-bold">Logistics Dashboard</h1><p className="mt-1 text-white/75">Welcome back, {displayName.split(' ')[0]}! Here is your delivery overview.</p></div>
          </div>
        </motion.div>

        {/* Stats Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -4 }}
                className={`${stat.bgColor} ${stat.borderColor} rounded-lg p-5 shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${stat.iconColor} p-2.5 bg-white rounded-lg shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-white px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Delivery Trend Chart - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Delivery Overview</h2>
              <p className="text-sm text-slate-500 mt-1">Weekly delivery trends</p>
            </div>
            <div className="h-80">
              <Line data={deliveryTrendData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Vehicle Status - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">Vehicle Status</h2>
              <p className="text-sm text-slate-500 mt-1">35 vehicles tracked</p>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full h-full">
                <Pie
                  data={vehicleStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { font: { size: 12, weight: 500 }, color: '#64748b', padding: 15 },
                      },
                      tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        titleFont: { size: 12, weight: 600 },
                        bodyFont: { size: 12 },
                        padding: 10,
                        cornerRadius: 6,
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
              {vehicleStatusData.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: vehicleStatusData.datasets[0].backgroundColor[index] }}
                    ></div>
                    <span className="text-slate-600">{label}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{vehicleStatusData.datasets[0].data[index]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tables Section - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Deliveries Table - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Recent Deliveries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Order</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Location</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Distance</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{delivery.order}</td>
                      <td className="px-6 py-4 text-slate-600">{delivery.location}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{delivery.distance}</td>
                      <td className="px-6 py-4 text-slate-600">{delivery.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Notifications Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all h-fit"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`${getNotificationColor(notif.type)} rounded-lg p-3 transition-all hover:shadow-sm`}
                >
                  <p className="text-sm font-medium text-slate-900">{notif.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium text-sm transition-colors"
            >
              View All Notifications
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-green-900">Today's Revenue</h3>
              <DollarSign size={18} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900 mt-2">₹24,580</p>
            <p className="text-xs text-green-700 mt-2">From 48 completed deliveries</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-900">On-Time Rate</h3>
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900 mt-2">98.5%</p>
            <p className="text-xs text-blue-700 mt-2">Excellent performance this week</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-purple-900">Avg. Rating</h3>
              <CheckCircle size={18} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-900 mt-2">4.8/5.0</p>
            <p className="text-xs text-purple-700 mt-2">Based on 156 customer reviews</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
