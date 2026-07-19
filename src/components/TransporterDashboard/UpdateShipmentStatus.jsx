import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Truck, MapPin, CheckCircle, AlertCircle, Camera, Plus, X } from 'lucide-react';
import { getShipments } from '../../api/shipment';
import api from '../../api/axios';

export default function UpdateShipmentStatus() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipmentsData();
  }, []);

  const fetchShipmentsData = async () => {
    try {
      const res = await getShipments();
      if (res?.data?.shipments) {
        setShipments(res.data.shipments.map(s => ({
          id: s._id,
          orderId: s._id.substring(0, 8).toUpperCase(),
          status: s.status,
          currentLocation: s.currentLocation || 'Warehouse',
          progress: s.status === 'Assigned' ? 10 : s.status === 'Picked Up' ? 20 : s.status === 'In Transit' ? 50 : s.status === 'Out for Delivery' ? 80 : s.status === 'Delivered' ? 100 : 0,
          nextStop: s.deliveryAddress?.city || 'Destination',
          eta: s.eta || 'Pending',
          temperature: 'N/A',
          humidity: 'N/A',
          notes: s.notes || 'No notes',
        })));
      }
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    location: '',
    notes: '',
    photo: null,
  });

  const statusOptions = [
    'Picked Up',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Delayed',
    'Issue',
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'In Transit':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Picked Up':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Delayed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Issue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleUpdate = () => {
    if (selectedShipment && updateData.status) {
      setShipments(
        shipments.map(s =>
          s.id === selectedShipment.id
            ? {
                ...s,
                status: updateData.status,
                currentLocation: updateData.location || s.currentLocation,
                notes: updateData.notes || s.notes,
              }
            : s
        )
      );
      setShowUpdateModal(false);
      setSelectedShipment(null);
      setUpdateData({ status: '', location: '', notes: '', photo: null });
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpdateData({ ...updateData, photo: file.name });
    }
  };

  const openUpdateModal = (shipment) => {
    setSelectedShipment(shipment);
    setUpdateData({
      status: shipment.status,
      location: shipment.currentLocation,
      notes: shipment.notes,
      photo: null,
    });
    setShowUpdateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Shipment Status</h1>
        <p className="text-gray-600">Track and update your active shipments in real-time</p>
      </motion.div>

      {/* Shipments List */}
      <div className="space-y-4">
        {shipments.map((shipment, index) => (
          <motion.div
            key={shipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
          >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{shipment.orderId}</h2>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(shipment.status)}`}>
                  {shipment.status}
                </span>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <p className="text-sm text-gray-600">ETA: <span className="font-semibold">{shipment.eta}</span></p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-medium">Progress</span>
                <span className="text-sm font-semibold text-gray-800">{shipment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${shipment.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
                />
              </div>
            </div>

            {/* Location & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">CURRENT</p>
                  <p className="text-sm font-medium text-gray-800">{shipment.currentLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">NEXT STOP</p>
                  <p className="text-sm font-medium text-gray-800">{shipment.nextStop}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">CONDITIONS</p>
                <div className="text-sm font-medium text-gray-800">
                  <p>🌡️ {shipment.temperature}</p>
                  <p>💧 {shipment.humidity}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">NOTES</p>
                <p className="text-sm text-gray-700">{shipment.notes}</p>
              </div>
            </div>

            {/* Update Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openUpdateModal(shipment)}
                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <AlertCircle size={18} />
                Update Status
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedShipment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowUpdateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Update Status</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Status Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Status</option>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Location Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Location</label>
              <input
                type="text"
                value={updateData.location}
                onChange={(e) => setUpdateData({ ...updateData, location: e.target.value })}
                placeholder="Enter current location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
              <textarea
                value={updateData.notes}
                onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                placeholder="Add any notes or issues"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Photo Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Photo Evidence</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Camera size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {updateData.photo ? updateData.photo : 'Click to upload photo'}
                  </p>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                Update
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
