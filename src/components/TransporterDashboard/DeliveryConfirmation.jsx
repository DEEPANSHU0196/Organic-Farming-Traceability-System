import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Camera, MapPin, User, Package, X, Upload } from 'lucide-react';

export default function DeliveryConfirmation() {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      orderId: 'ORD-2024-001',
      buyerName: 'Fresh Mart Delhi',
      buyerPhone: '+91-98765-43210',
      product: 'Organic Tomatoes (50kg)',
      deliveryAddress: 'MG Road, New Delhi',
      deliveryTime: '1:45 PM',
      status: 'Completed',
      signature: null,
      photo: null,
      receivedBy: 'Rajesh Singh',
    },
    {
      id: 2,
      orderId: 'ORD-2024-002',
      buyerName: 'Organic Store Mumbai',
      buyerPhone: '+91-99876-54321',
      product: 'Fresh Vegetables Bundle',
      deliveryAddress: 'Bandra, Mumbai',
      deliveryTime: 'Pending',
      status: 'Pending',
      signature: null,
      photo: null,
      receivedBy: '',
    },
    {
      id: 3,
      orderId: 'ORD-2024-004',
      buyerName: 'Bangalore Wholesale',
      buyerPhone: '+91-97654-32109',
      product: 'Rice & Wheat (100kg)',
      deliveryAddress: 'Whitefield, Bangalore',
      deliveryTime: 'Tomorrow 10:00 AM',
      status: 'Pending',
      signature: null,
      photo: null,
      receivedBy: '',
    },
  ]);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({
    receivedBy: '',
    signature: null,
    photo: null,
    notes: '',
  });

  const handleOpenConfirm = (delivery) => {
    setSelectedDelivery(delivery);
    setConfirmData({
      receivedBy: delivery.receivedBy,
      signature: null,
      photo: null,
      notes: '',
    });
    setShowConfirmModal(true);
  };

  const handleConfirmDelivery = () => {
    if (confirmData.receivedBy) {
      setDeliveries(
        deliveries.map(d =>
          d.id === selectedDelivery.id
            ? {
                ...d,
                status: 'Completed',
                receivedBy: confirmData.receivedBy,
                signature: confirmData.signature,
                photo: confirmData.photo,
              }
            : d
        )
      );
      setShowConfirmModal(false);
      setSelectedDelivery(null);
      setConfirmData({ receivedBy: '', signature: null, photo: null, notes: '' });
    }
  };

  const handleSignatureCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setConfirmData({ ...confirmData, signature: file.name });
    }
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setConfirmData({ ...confirmData, photo: file.name });
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Completed'
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Delivery Confirmation</h1>
        <p className="text-gray-600">Confirm deliveries and collect proof of delivery</p>
      </motion.div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {deliveries.map((delivery, index) => (
          <motion.div
            key={delivery.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4 ${
              delivery.status === 'Completed'
                ? 'bg-green-50 border-l-green-500'
                : 'bg-white border-l-yellow-500'
            }`}
          >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{delivery.orderId}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{delivery.product}</p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <p className="text-sm text-gray-600">Delivery Time: <span className="font-semibold">{delivery.deliveryTime}</span></p>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Buyer Info */}
              <div className="flex items-start gap-3">
                <User size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">BUYER</p>
                  <p className="text-sm font-medium text-gray-800">{delivery.buyerName}</p>
                  <p className="text-xs text-gray-600 mt-1">{delivery.buyerPhone}</p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">DELIVERY ADDRESS</p>
                  <p className="text-sm font-medium text-gray-800">{delivery.deliveryAddress}</p>
                </div>
              </div>

              {/* Received By */}
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">RECEIVED BY</p>
                  <p className="text-sm font-medium text-gray-800">
                    {delivery.receivedBy || 'Not confirmed yet'}
                  </p>
                </div>
              </div>

              {/* Package Info */}
              <div className="flex items-start gap-3">
                <Package size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">PACKAGE STATUS</p>
                  <p className="text-sm font-medium text-gray-800">
                    {delivery.photo ? '📷 Photo attached' : 'No photo'}
                  </p>
                </div>
              </div>
            </div>

            {/* Proof of Delivery */}
            {delivery.status === 'Completed' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-100 rounded-lg p-4 mb-4 border border-green-300"
              >
                <p className="text-sm font-semibold text-green-900 mb-2">✓ Proof of Delivery</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-green-800">
                  {delivery.signature && <p>📝 Signature: {delivery.signature}</p>}
                  {delivery.photo && <p>📷 Photo: {delivery.photo}</p>}
                </div>
              </motion.div>
            )}

            {/* Action Button */}
            {delivery.status === 'Pending' && (
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenConfirm(delivery)}
                  className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Confirm Delivery
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedDelivery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Confirm Delivery</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Delivery Summary */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">Order Details</p>
              <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
                <p><span className="font-semibold">Order ID:</span> {selectedDelivery.orderId}</p>
                <p><span className="font-semibold">Buyer:</span> {selectedDelivery.buyerName}</p>
                <p><span className="font-semibold">Product:</span> {selectedDelivery.product}</p>
                <p><span className="font-semibold">Address:</span> {selectedDelivery.deliveryAddress}</p>
              </div>
            </div>

            {/* Received By */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name of Person Receiving
              </label>
              <input
                type="text"
                value={confirmData.receivedBy}
                onChange={(e) => setConfirmData({ ...confirmData, receivedBy: e.target.value })}
                placeholder="Enter receiver's name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Signature */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Receiver's Signature (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureCapture}
                  className="hidden"
                  id="signature-upload"
                />
                <label htmlFor="signature-upload" className="cursor-pointer">
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {confirmData.signature ? confirmData.signature : 'Upload signature'}
                  </p>
                </label>
              </div>
            </div>

            {/* Photo Evidence */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photo Evidence
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoCapture}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Camera size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {confirmData.photo ? confirmData.photo : 'Upload delivery photo'}
                  </p>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={confirmData.notes}
                onChange={(e) => setConfirmData({ ...confirmData, notes: e.target.value })}
                placeholder="Any special notes about the delivery"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmDelivery}
                disabled={!confirmData.receivedBy}
                className="flex-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Confirm Delivery
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
