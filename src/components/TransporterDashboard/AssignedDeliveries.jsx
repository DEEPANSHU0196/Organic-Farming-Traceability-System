import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, CheckCircle, XCircle, AlertCircle, Package, ExternalLink, Truck } from 'lucide-react';
import { getMyShipments, getAvailableShipments, updateShipment, assignDriver, acceptShipmentRequest } from '../../api/shipment';

export default function AssignedDeliveries() {
  const [activeTab, setActiveTab] = useState('available');
  const [availableRequests, setAvailableRequests] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignmentDrafts, setAssignmentDrafts] = useState({});
  const [savedDrivers, setSavedDrivers] = useState([]);
  const [savedVehicles, setSavedVehicles] = useState([]);

  useEffect(() => {
    try {
      const drivers = JSON.parse(localStorage.getItem('transporter_drivers')) || [];
      const vehicles = JSON.parse(localStorage.getItem('transporter_vehicles')) || [];
      setSavedDrivers(drivers);
      setSavedVehicles(vehicles);
    } catch (e) {
      console.error('Error loading saved drivers/vehicles from localStorage');
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (activeTab === 'available') {
          const response = await getAvailableShipments();
          if (response?.data?.success) {
            setAvailableRequests(formatShipments(response.data.shipments || []));
          } else {
            setAvailableRequests([]);
          }
        } else {
          const response = await getMyShipments();
          if (response?.data?.success) {
            setDeliveries(formatShipments(response.data.shipments || []));
          } else {
            setDeliveries([]);
          }
        }
      } catch (err) {
        console.error('Failed to load shipments:', err);
        setError('Unable to load deliveries. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeTab]);

  const formatShipments = (shipmentList) => {
    return shipmentList.map(ship => {
      const order = ship.order || {};
      const buyer = order.buyer || {};
      const product = order.product || {};
      const farmer = product.farmer || {};
            
            return {
              id: ship._id || ship.id,
              orderId: ship.trackingId || `TRK-${ship._id?.substring(0, 8)}`,
              farmerName: farmer.fullName || farmer.name || 'Farmer',
              farmerPhone: farmer.phone || '+91 98765 43210',
              farmerLocation: ship.currentLocation || farmer.address || 'Farm Location',
              buyerName: buyer.fullName || buyer.name || 'Buyer',
              buyerPhone: buyer.phone || '+91 99999 88888',
              deliveryLocation: buyer.address || 'Delivery Location',
              productName: product.name || ship.productName || 'Organic Produce',
              quantity: order.quantity || ship.quantity || '100',
              unit: order.unit || ship.unit || 'kg',
              priority: ship.priority || 'Medium',
              assignedTime: new Date(ship.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              deadline: ship.estimatedDelivery ? new Date(ship.estimatedDelivery).toLocaleDateString() : 'Within 24 Hours',
              status: ship.status || 'Awaiting Driver Assignment',
              driverName: ship.driverName || '',
              driverContactNumber: ship.driverContactNumber || '',
              vehicleNumber: ship.vehicleNumber || '',
              estimatedDeliveryDate: ship.estimatedDeliveryDate || '',
              distance: ship.distanceTravelledKm || '120',
              createdAt: ship.createdAt,
              updates: ship.updates || [],
            };
          });
      return formatted;
  };

  const handleClaimRequest = async (id) => {
    try {
      await acceptShipmentRequest(id);
      // Remove it from available pool
      setAvailableRequests(current => current.filter(req => req.id !== id));
      alert('Delivery successfully claimed! You can assign a driver in "My Deliveries" tab.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to claim delivery request.');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateShipment(id, { status: newStatus });
      setDeliveries(
        deliveries.map(d => (d.id === id ? { ...d, status: newStatus } : d))
      );
    } catch (err) {
      console.error(`Failed to update shipment status to ${newStatus}:`, err);
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

  const handleAssignDriver = async (id) => {
    try {
      const response = await assignDriver(id, assignmentDrafts[id] || {});
      const updated = response?.data?.shipment;
      setDeliveries((current) => current.map((delivery) => delivery.id === id
        ? {
          ...delivery,
          status: updated?.status || 'Driver Assigned',
          driverName: updated?.driverName || assignmentDrafts[id]?.driverName || '',
          driverContactNumber: updated?.driverContactNumber || assignmentDrafts[id]?.driverContactNumber || '',
          vehicleNumber: updated?.vehicleNumber || assignmentDrafts[id]?.vehicleNumber || '',
          estimatedDeliveryDate: updated?.estimatedDeliveryDate || assignmentDrafts[id]?.estimatedDeliveryDate || '',
        }
        : delivery));
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to assign this driver.');
    }
  };

  const updateDraft = (id, field, value) => {
    setAssignmentDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));
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
      case 'Picked Up from Farm':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'In Transit':
        return 'bg-orange-50 border-l-4 border-orange-500';
      case 'Out for Delivery':
        return 'bg-indigo-50 border-l-4 border-indigo-500';
      case 'Delivered':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'Rejected':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'Pending':
      case 'Driver Assigned':
      case 'Awaiting Driver Assignment':
      case 'Pending Acceptance':
        return 'bg-gray-50 border-l-4 border-gray-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Deliveries Management</h1>
        <p className="text-gray-600 mb-6">Claim new delivery requests and manage your active shipments.</p>
        
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'available'
                ? 'border-orange-600 text-orange-600 bg-orange-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Available Requests
          </button>
          <button
            onClick={() => setActiveTab('my_deliveries')}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
              activeTab === 'my_deliveries'
                ? 'border-green-600 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            My Deliveries
          </button>
        </div>
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
      {!loading && activeTab === 'available' && availableRequests.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium">No open requests right now</p>
          <p className="text-gray-500 text-sm">Wait for farmers to approve orders and broadcast requests here.</p>
        </div>
      )}

      {!loading && activeTab === 'my_deliveries' && deliveries.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Truck size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg font-medium">You haven't claimed any deliveries</p>
          <p className="text-gray-500 text-sm">Check the "Available Requests" tab to claim a delivery.</p>
        </div>
      )}

      {/* Deliveries List */}
      {!loading && (
      <div className="space-y-4">
        {(activeTab === 'available' ? availableRequests : deliveries).map((delivery, index) => (
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
                    delivery.status === 'Picked Up from Farm' ? 'text-blue-700' :
                    delivery.status === 'In Transit' ? 'text-orange-700' :
                    delivery.status === 'Out for Delivery' ? 'text-indigo-700' :
                    delivery.status === 'Delivered' ? 'text-green-700' :
                    'text-gray-700'
                  }`}>
                    {delivery.status}
                  </p>
                </div>
              </div>
            </div>

            {delivery.status !== 'Awaiting Driver Assignment' && delivery.driverName && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 rounded-lg bg-white/70 border border-gray-200 p-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">DRIVER</p>
                  <p className="text-sm font-semibold text-gray-800">{delivery.driverName}</p>
                  <p className="text-xs text-blue-600">{delivery.driverContactNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">VEHICLE</p>
                  <p className="text-sm font-semibold text-gray-800">{delivery.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">ESTIMATED DELIVERY</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {delivery.estimatedDeliveryDate
                      ? new Date(delivery.estimatedDeliveryDate).toLocaleDateString()
                      : 'Not provided'}
                  </p>
                </div>
              </div>
            )}

            {/* Actions for My Deliveries */}
            {activeTab === 'my_deliveries' && (
              <>
                {delivery.status === 'Awaiting Driver Assignment' ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                {/* Driver Assignment Dropdowns */}
                <div className="col-span-1">
                  <label className="text-xs text-gray-600 block mb-1">Driver</label>
                  <select
                    required
                    value={assignmentDrafts[delivery.id]?.driverName || ''}
                    onChange={(e) => {
                      const driver = savedDrivers.find(d => d.name === e.target.value);
                      updateDraft(delivery.id, 'driverName', e.target.value);
                      if (driver) updateDraft(delivery.id, 'driverContactNumber', driver.phone);
                    }}
                    className="w-full rounded border border-gray-300 px-2 py-2 text-sm bg-white"
                  >
                    <option value="">Select Driver</option>
                    {savedDrivers.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-1">
                  <label className="text-xs text-gray-600 block mb-1">Driver Contact</label>
                  <input
                    required
                    type="tel"
                    value={assignmentDrafts[delivery.id]?.driverContactNumber || ''}
                    onChange={(e) => updateDraft(delivery.id, 'driverContactNumber', e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
                    placeholder="Auto-filled"
                  />
                </div>

                <div className="col-span-1">
                  <label className="text-xs text-gray-600 block mb-1">Vehicle</label>
                  <select
                    required
                    value={assignmentDrafts[delivery.id]?.vehicleNumber || ''}
                    onChange={(e) => updateDraft(delivery.id, 'vehicleNumber', e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-2 text-sm bg-white"
                  >
                    <option value="">Select Vehicle</option>
                    {savedVehicles.map(v => (
                      <option key={v.id} value={v.number}>{v.number} ({v.type})</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-xs text-gray-600 block mb-1">Estimated Delivery</label>
                  <input
                    required
                    type="date"
                    value={assignmentDrafts[delivery.id]?.estimatedDeliveryDate || ''}
                    onChange={(e) => updateDraft(delivery.id, 'estimatedDeliveryDate', e.target.value)}
                    className="w-full rounded border border-gray-300 px-2 py-2 text-sm"
                  />
                </div>

                <div className="col-span-1 flex items-end">
                  <button type="button" onClick={() => handleAssignDriver(delivery.id)} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
                    Assign Driver
                  </button>
                </div>
              </div>
            ) : delivery.status === 'Driver Assigned' || delivery.status === 'Pending' ? (
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
                <div className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold flex items-center gap-2">
                  <Clock size={18} />
                  Awaiting Farmer Handover
                </div>
              </div>
            ) : delivery.status === 'Picked Up from Farm' ? (
              <div className="flex justify-end gap-3">
                <span className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 bg-blue-100 text-blue-800 mr-auto">
                  📦 Picked Up
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusUpdate(delivery.id, 'In Transit')}
                  className="px-6 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  Mark In Transit
                </motion.button>
              </div>
            ) : delivery.status === 'In Transit' ? (
              <div className="flex justify-end gap-3">
                <span className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 bg-orange-100 text-orange-800 mr-auto">
                  🚚 In Transit
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStatusUpdate(delivery.id, 'Out for Delivery')}
                  className="px-6 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  Mark Out for Delivery
                </motion.button>
              </div>
            ) : delivery.status === 'Out for Delivery' ? (
              <div className="flex justify-end gap-3">
                <span className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 bg-indigo-100 text-indigo-800 mr-auto">
                  🛵 Out for Delivery
                </span>
                <div className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold flex items-center gap-2">
                  <Clock size={18} />
                  Awaiting Buyer Confirmation
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <span className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${
                  delivery.status === 'Picked Up from Farm'
                    ? 'bg-blue-100 text-blue-800'
                    : delivery.status === 'In Transit'
                    ? 'bg-orange-100 text-orange-800'
                    : delivery.status === 'Out for Delivery'
                    ? 'bg-indigo-100 text-indigo-800'
                    : delivery.status === 'Delivered'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}>
                  {delivery.status === 'Picked Up from Farm' && '📦'}
                  {delivery.status === 'In Transit' && '🚚'}
                  {delivery.status === 'Out for Delivery' && '🛵'}
                  {delivery.status === 'Delivered' && '✓'}
                  {delivery.status === 'Rejected' && '✗'}
                  {delivery.status === 'Picked Up from Farm' ? 'Picked Up' :
                   delivery.status === 'In Transit' ? 'In Transit' :
                   delivery.status === 'Out for Delivery' ? 'Out for Delivery' :
                   delivery.status === 'Delivered' ? 'Delivered' :
                   'Rejected'}
                </span>
              </div>
                )}
              </>
            )}

            {/* Actions for Available Requests */}
            {activeTab === 'available' && (
              <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleClaimRequest(delivery.id)}
                  className="px-6 py-2.5 bg-orange-600 text-white hover:bg-orange-700 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <ExternalLink size={18} />
                  Claim this Delivery
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      )}
    </div>
  );
}
