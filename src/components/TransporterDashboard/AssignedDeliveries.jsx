import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getMyShipments, updateShipment } from '../../api/shipment';

export default function AssignedDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await getMyShipments();
        if (response?.data?.success) {
          // Normalize API shipments to match UI fields
          const formatted = (response.data.shipments || []).map(ship => ({
            id: ship._id || ship.id,
            orderId: ship.trackingId || `TRK-${ship._id?.substring(0, 8)}`,
            farmer: 'Verified Farmer',
            buyer: 'Verified Buyer',
            pickupLocation: 'Farmer Coop, Jaipur',
            deliveryLocation: ship.currentLocation || 'Distribution Hub, New Delhi',
            product: 'Organic Harvest Produce',
            priority: 'Medium',
            assignedTime: new Date(ship.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            deadline: 'Within 24 Hours',
            status: ship.status || 'New',
            distance: '120 km',
            phone: '+91 99999 88888',
          }));
          setDeliveries(formatted);
        }
      } catch (error) {
        console.error('Failed to load shipments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const handleAccept = async (id) => {
    try {
      await updateShipment(id, { status: 'Accepted' });
      setDeliveries(
        deliveries.map(d => (d.id === id ? { ...d, status: 'Accepted' } : d))
      );
    } catch (err) {
      console.error('Failed to accept shipment:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateShipment(id, { status: 'Rejected' });
      setDeliveries(
        deliveries.map(d => (d.id === id ? { ...d, status: 'Rejected' } : d))
      );
    } catch (err) {
      console.error('Failed to reject shipment:', err);
    }
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
