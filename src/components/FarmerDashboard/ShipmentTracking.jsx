import { motion } from 'motion/react';
import { CheckCircle2, Truck, Package, MapPin, Eye, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMyShipments, updateShipment } from '../../api/shipment';
import { LeafLoader, StatusBadge } from '../../shared/ui';

export default function ShipmentTracking() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const fetchShipments = async () => {
    try {
      const response = await getMyShipments();
      const fetched = response?.data?.shipments || [];
      const mapped = fetched.map(ship => {
        const steps = ['Pending Farmer Approval', 'Accepted by Farmer', 'Driver Assigned', 'Picked Up from Farm', 'In Transit', 'Out for Delivery', 'Delivered'];
        let currentStatus = ship.status;
        if (currentStatus === 'Awaiting Driver Assignment') currentStatus = 'Accepted by Farmer';
        if (currentStatus === 'Picked') currentStatus = 'Picked Up from Farm';
        
        const currentStep = steps.indexOf(currentStatus) >= 0 ? steps.indexOf(currentStatus) : 1;
        const progress = Math.min(100, Math.max(0, Math.round((currentStep / (steps.length - 1)) * 100)));
        
        return {
          id: ship.trackingId || `TRK-${ship._id?.substring(0, 8)}`,
          _id: ship._id,
          order: ship.order?._id,
          status: currentStatus,
          progress,
          currentStep,
          steps,
          driverName: ship.driverName,
          driverContactNumber: ship.driverContactNumber,
          vehicleNumber: ship.vehicleNumber,
          estimatedDeliveryDate: ship.estimatedDeliveryDate,
          currentLocation: ship.currentLocation,
          buyerName: ship.order?.buyer?.fullName,
          deliveryLocation: ship.order?.buyer?.address,
          productName: ship.order?.product?.name || ship.order?.product?.productName,
          createdAt: ship.createdAt
        };
      });
      setShipments(mapped);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load shipments:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateShipment(id, { status: newStatus });
      fetchShipments(); // Refresh to get updated status and timeline
    } catch (err) {
      console.error(`Failed to update shipment status to ${newStatus}:`, err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Shipment Tracking</h1>
        <p className="text-accent-muted">Track your products in real-time</p>
      </div>

      {/* Shipments */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LeafLoader label="Loading shipment journey..." />
        </div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-surface-alt">
          <Truck size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-accent-muted text-lg">No active shipments</p>
        </div>
      ) : (
      <div className="space-y-6">
        {shipments.map((shipment, idx) => (
          <motion.div
            key={shipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg shadow-md border border-surface-alt p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-alt">
              <div>
                <h3 className="text-lg font-bold text-primary">{shipment.id}</h3>
                <p className="text-sm text-accent-muted">Order: {shipment.order}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={shipment.status} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-accent-muted">Progress</p>
                <p className="text-sm font-bold text-primary">{shipment.progress}%</p>
              </div>
              <div className="w-full h-2 bg-surface-alt rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${shipment.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                />
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="flex items-center justify-between">
              {shipment.steps.map((step, stepIdx) => (
                <div key={stepIdx} className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + stepIdx * 0.1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      stepIdx <= shipment.currentStep
                        ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                        : 'bg-surface-alt border border-surface-alt'
                    }`}
                  >
                    {stepIdx <= shipment.currentStep ? (
                      <CheckCircle2 className="text-white" size={20} />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-surface-alt" />
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <p
                    className={`text-xs text-center font-medium transition-colors ${
                      stepIdx <= shipment.currentStep ? 'text-primary' : 'text-accent-muted'
                    }`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setSelectedShipment(shipment);
                      setShowDetailModal(true);
                    }}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Details
                  </motion.button>
                  {shipment.status === 'Driver Assigned' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusUpdate(shipment._id, 'Picked Up from Farm')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      Confirm Handover to Driver
                    </motion.button>
                  )}
            </div>
            <div className="mt-6 pt-6 border-t border-surface-alt grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-accent-muted mb-1">📦 Current Location</p>
                <p className="font-medium text-primary">{shipment.currentLocation || 'Farm'}</p>
              </div>
              <div>
                <p className="text-sm text-accent-muted mb-1">📞 Driver</p>
                <p className="font-medium text-primary">{shipment.driverName || 'Awaiting'}</p>
              </div>
              <div>
                <p className="text-sm text-accent-muted mb-1">🚚 Delivery Date</p>
                <p className="font-medium text-primary">{shipment.estimatedDeliveryDate ? new Date(shipment.estimatedDeliveryDate).toLocaleDateString() : 'Pending'}</p>
              </div>
              <div>
                <p className="text-sm text-accent-muted mb-1">📍 Destination</p>
                <p className="font-medium text-primary truncate" title={shipment.deliveryLocation}>{shipment.deliveryLocation || 'Buyer Address'}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
      {/* Shipment Detail Modal */}
      {showDetailModal && selectedShipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white flex items-center justify-between">
              <h2 className="text-2xl font-bold">Shipment Details - {selectedShipment.id}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-primary mb-3">Shipment Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-accent-muted">Shipment ID</p>
                      <p className="font-semibold text-primary">{selectedShipment.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Order ID</p>
                      <p className="font-semibold text-primary">{selectedShipment.order}</p>
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Status</p>
                      <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium mt-1 ${
                        selectedShipment.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : selectedShipment.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {selectedShipment.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-primary mb-3">Tracking Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-accent-muted">Driver</p>
                      <p className="font-semibold text-primary">{selectedShipment.driverName || 'Not Assigned'}</p>
                      {selectedShipment.driverContactNumber && <p className="text-xs text-accent-muted mt-1">{selectedShipment.driverContactNumber}</p>}
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Vehicle Number</p>
                      <p className="font-mono text-sm text-primary">{selectedShipment.vehicleNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Tracking ID</p>
                      <p className="font-mono text-sm text-primary">{selectedShipment.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Progress</p>
                      <p className="font-semibold text-primary">{selectedShipment.progress}% Complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-surface-alt rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-primary">Delivery Progress</p>
                  <p className="text-sm font-bold text-emerald-600">{selectedShipment.progress}%</p>
                </div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedShipment.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                  />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-bold text-primary mb-4">Journey Timeline</h3>
                <div className="space-y-4">
                  {selectedShipment.steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          idx <= selectedShipment.currentStep
                            ? 'bg-emerald-500 text-white'
                            : 'bg-surface-alt text-accent'
                        }`}>
                          {idx <= selectedShipment.currentStep ? '✓' : idx + 1}
                        </div>
                        {idx < selectedShipment.steps.length - 1 && (
                          <div className={`w-1 h-12 mt-2 ${
                            idx < selectedShipment.currentStep ? 'bg-emerald-500' : 'bg-surface-alt'
                          }`} />
                        )}
                      </div>
                      <div className="pt-2">
                        <p className="font-semibold text-primary">{step}</p>
                        <p className="text-xs text-accent-muted">
                          {idx <= selectedShipment.currentStep ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Location Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm text-accent-muted mb-1">📍 Current Location</p>
                  <p className="font-semibold text-primary">{selectedShipment.currentLocation || 'Farm'}</p>
                </div>
                <div>
                  <p className="text-sm text-accent-muted mb-1">🎯 Destination</p>
                  <p className="font-semibold text-primary truncate">{selectedShipment.deliveryLocation || 'Buyer Address'}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 bg-surface-alt rounded-lg">
                <h3 className="font-bold text-primary mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-accent-muted">Carrier Support:</span> <span className="font-semibold">+91 1800-FREIGHT</span></p>
                  <p><span className="text-accent-muted">Email:</span> <span className="font-semibold">support@fastfreight.com</span></p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-surface-alt">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Get Notifications
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors font-medium"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
