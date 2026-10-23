import { useState, useEffect } from 'react';
import { AnimatedNumber } from '../../shared/ui';
import { motion } from 'motion/react';
import { TrendingUp, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { getShipments } from '../../api/shipment';

export default function DashboardOverview() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const res = await getShipments();
        if (res?.data?.shipments) {
          setShipments(res.data.shipments);
        }
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShipments();
  }, []);

  const pendingDeliveries = shipments.filter(s => s.status === 'Pending').length;
  const completedToday = shipments.filter(s => s.status === 'Completed').length; // Ideally check date
  const inTransit = shipments.filter(s => s.status === 'In Transit').length;

  const stats = [
    {
      title: 'Pending Deliveries',
      value: pendingDeliveries.toString(),
      icon: Package,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Completed Today',
      value: completedToday.toString(),
      icon: CheckCircle,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Distance',
      value: '245 km', // Placeholder, depends on real data tracking
      icon: TrendingUp,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'In Transit',
      value: inTransit.toString(),
      icon: AlertCircle,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
  ];

  const recentDeliveries = shipments.slice(0, 5).map(s => ({
    id: s._id,
    order: s._id.substring(0, 8),
    location: s.deliveryAddress?.city || 'Unknown',
    status: s.status,
    eta: s.eta || 'Pending',
  }));

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2"><AnimatedNumber value={stat.value} /></p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon size={24} className={stat.textColor} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Today's performance</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Deliveries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Deliveries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">{delivery.order}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{delivery.location}</td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        delivery.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : delivery.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{delivery.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Week's Performance</h3>
          <p className="text-3xl font-bold text-blue-600">89%</p>
          <p className="text-sm text-blue-700 mt-2">On-time delivery rate</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-green-900 mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold text-green-600">₹8,450</p>
          <p className="text-sm text-green-700 mt-2">This week</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-2">Rating</h3>
          <p className="text-3xl font-bold text-purple-600">4.8/5</p>
          <p className="text-sm text-purple-700 mt-2">From customers</p>
        </div>
      </motion.div>
    </div>
  );
}
