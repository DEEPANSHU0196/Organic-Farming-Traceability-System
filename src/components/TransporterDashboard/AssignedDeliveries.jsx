import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';
import { getMyShipments, updateShipment } from '../../api/shipment';

export default function AssignedDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getMyShipments();
        if (response?.data?.success) {
          // Use real shipment data instead of hardcoded values
          const formatted = (response.data.shipments || []).map(ship => {
            const buyer = ship.buyer || {};
            const farmer = ship.farmer || {};
            const order = ship.order || {};
            
            return {
              id: ship._id || ship.id,
              orderId: ship.trackingId || `TRK-${ship._id?.substring(0, 8)}`,
              farmerName: farmer.fullName || farmer.name || 'Farmer',
              farmerPhone: farmer.phone || '+91 98765 43210',
              farmerLocation: ship.pickupLocation || farmer.location || 'Farm Location',
              buyerName: buyer.fullName || buyer.name || 'Buyer',
              buyerPhone: buyer.phone || '+91 99999 88888',
              deliveryLocation: ship.currentLocation || buyer.address || 'Delivery Location',
              productName: order.productName || ship.productName || 'Organic Produce',
              quantity: order.quantity || ship.quantity || '100',
              unit: order.unit || ship.unit || 'kg',
              priority: ship.priority || 'Medium',
              assignedTime: new Date(ship.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              deadline: ship.estimatedDelivery ? new Date(ship.estimatedDelivery).toLocaleDateString() : 'Within 24 Hours',
              status: ship.status || 'Pending',
              distance: ship.distanceTravelledKm || '120',
              createdAt: ship.createdAt,
              updates: ship.updates || [],
            };
          });
          setDeliveries(formatted);
        } else {
          setError('No shipments found');
        }
      } catch (error) {
        console.error('Failed to load shipments:', error);
        setError('Unable to load deliveries. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const handleAccept = async (id) => {
    try {
      await updateShipment(id, { status: 'Picked' });
      setDeliveries(
        deliveries.map(d => (d.id === id ? { ...d, status: 'Picked' } : d))
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
      case 'Picked':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'In Transit':
        return 'bg-orange-50 border-l-4 border-orange-500';
      case 'Delivered':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'Rejected':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'Pending':
        return 'bg-gray-50 border-l-4 border-gray-500';
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
        <p className="text-gray-600">Real-time delivery tracking • {deliveries.length} shipment(s)</p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700">{error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && deliveries.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No deliveries assigned yet</p>
          <p className="text-gray-500 text-sm">Check back soon for new delivery assignments</p>
        </div>
      )}

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
                <p className="text-sm text-gray-600">{delivery.productName} • {delivery.quantity} {delivery.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Distance: <span className="font-semibold text-gray-800">~{delivery.distance} km</span></p>
                <p className="text-xs text-gray-500 mt-1">Assigned: {delivery.assignedTime}</p>
              </div>
            </div>

            {/* Location and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
              {/* Pickup */}
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-semibold">PICKUP FROM</p>
                  <p className="text-sm font-medium text-gray-800">{delivery.farmerLocation}</p>
                  <p className="text-xs text-gray-600 mt-1"><strong>{delivery.farmerName}</strong></p>
                  <p className="text-xs text-blue-600 mt-1">{delivery.farmerPhone}</p>
                </div>
              </div>

              {/* Delivery */}
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-semibold">DELIVERY TO</p>
                  <p className="text-sm font-medium text-gray-800">{delivery.deliveryLocation}</p>
                  <p className="text-xs text-gray-600 mt-1"><strong>{delivery.buyerName}</strong></p>
                  <p className="text-xs text-blue-600 mt-1">{delivery.buyerPhone}</p>
                </div>
              </div>

              {/* Deadline & Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">DEADLINE</p>
                    <p className="text-sm font-medium text-gray-800">{delivery.deadline}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="text-xs text-gray-500 font-semibold">CURRENT STATUS</p>
                  <p className={`font-medium mt-1 ${
                    delivery.status === 'Picked' ? 'text-blue-700' :
                    delivery.status === 'In Transit' ? 'text-orange-700' :
                    delivery.status === 'Delivered' ? 'text-green-700' :
                    'text-gray-700'
                  }`}>
                    {delivery.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {['Pending'].includes(delivery.status) ? (
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
                  Accept & Pick Up
                </motion.button>
              </div>
            ) : (
              <div className="flex justify-end">
                <span className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                  delivery.status === 'Picked'
                    ? 'bg-blue-100 text-blue-800'
                    : delivery.status === 'In Transit'
                    ? 'bg-orange-100 text-orange-800'
                    : delivery.status === 'Delivered'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {delivery.status === 'Picked' && '📦'}
                  {delivery.status === 'In Transit' && '🚚'}
                  {delivery.status === 'Delivered' && '✓'}
                  {delivery.status === 'Rejected' && '✗'}
                  {delivery.status === 'Picked' ? 'Picked Up' :
                   delivery.status === 'In Transit' ? 'In Transit' :
                   delivery.status === 'Delivered' ? 'Delivered' :
                   'Rejected'}
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
