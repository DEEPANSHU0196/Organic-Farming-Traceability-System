import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AssignedDeliveries() {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      orderId: 'ORD-2024-001',
      farmer: 'Rajesh Kumar',
      buyer: 'Fresh Mart Delhi',
      pickupLocation: 'Block-45, Jaipur',
      deliveryLocation: 'MG Road, New Delhi',
      product: 'Organic Tomatoes (50kg)',
      priority: 'High',
      assignedTime: '10:30 AM',
      deadline: '2:00 PM',
      status: 'New',
      distance: '245 km',
      phone: '+91-98765-43210',
    },
    {
      id: 2,
      orderId: 'ORD-2024-002',
      farmer: 'Priya Singh',
      buyer: 'Organic Store Mumbai',
      pickupLocation: 'Village Harmada, Gujarat',
      deliveryLocation: 'Bandra, Mumbai',
      product: 'Fresh Vegetables Bundle',
      priority: 'Medium',
      assignedTime: '11:15 AM',
      deadline: '5:30 PM',
      status: 'New',
      distance: '520 km',
      phone: '+91-99876-54321',
    },
    {
      id: 3,
      orderId: 'ORD-2024-003',
      farmer: 'Amit Patel',
      buyer: 'Bangalore Wholesale',
      pickupLocation: 'Near Hisar, Haryana',
      deliveryLocation: 'Whitefield, Bangalore',
      product: 'Rice & Wheat (100kg)',
      priority: 'Low',
      assignedTime: '12:00 PM',
      deadline: 'Tomorrow 10:00 AM',
      status: 'New',
      distance: '1200 km',
      phone: '+91-97654-32109',
    },
  ]);

  const handleAccept = (id) => {
    setDeliveries(
      deliveries.map(d => (d.id === id ? { ...d, status: 'Accepted' } : d))
    );
  };

  const handleReject = (id) => {
    setDeliveries(
      deliveries.map(d => (d.id === id ? { ...d, status: 'Rejected' } : d))
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'Rejected':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'New':
        return 'bg-blue-50 border-l-4 border-blue-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Assigned Deliveries</h1>
        <p className="text-gray-600">Review and accept/reject delivery assignments</p>
      </motion.div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {deliveries.map((delivery, index) => (
          <motion.div
            key={delivery.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`rounded-xl shadow-md hover:shadow-lg transition-all p-6 ${getStatusColor(delivery.status)}`}
          >
            {/* Top Section - Order Info */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{delivery.orderId}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(delivery.priority)}`}>
                    {delivery.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-gray-600">{delivery.product}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Distance: <span className="font-semibold text-gray-800">{delivery.distance}</span></p>
                <p className="text-xs text-gray-500 mt-1">Assigned: {delivery.assignedTime}</p>
              </div>
            </div>

            {/* Location and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
              {/* Pickup */}
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold">PICKUP</p>
                  <p className="text-sm font-medium text-gray-800">{delivery.pickupLocation}</p>
                  <p className="text-xs text-gray-600 mt-1">{delivery.farmer}</p>
                </div>
              </div>

              {/* Delivery */}
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold">DELIVERY</p>
                  <p className="text-sm font-medium text-gray-800">{delivery.deliveryLocation}</p>
                  <p className="text-xs text-gray-600 mt-1">{delivery.buyer}</p>
                </div>
              </div>

              {/* Deadline & Contact */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">DEADLINE</p>
                    <p className="text-sm font-medium text-gray-800">{delivery.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-purple-600" />
                  <p className="text-sm text-gray-700">{delivery.phone}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {delivery.status === 'New' ? (
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReject(delivery.id)}
                  className="px-6 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <XCircle size={18} />
                  Reject
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAccept(delivery.id)}
                  className="px-6 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Accept
                </motion.button>
              </div>
            ) : (
              <div className="flex justify-end">
                <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  delivery.status === 'Accepted'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {delivery.status === 'Accepted' ? '✓ Accepted' : '✗ Rejected'}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {deliveries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-12 bg-white rounded-xl shadow-md"
        >
          <p className="text-gray-600 text-lg">No new deliveries assigned</p>
        </motion.div>
      )}
    </div>
  );
}
