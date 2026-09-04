import { motion } from 'motion/react';
import { Package, Truck, Check, Clock, MapPin, Calendar } from 'lucide-react';
import { useBuyer } from '../../contexts/BuyerContext';
import { updateShipment } from '../../api/shipment';
import backgroundPhoto from '../../assets/background.png';

export default function OrderTracking() {
  const { orders = [], shipments = [], refreshData } = useBuyer();

  const getShipment = (orderId) => shipments.find((shipment) => shipment.order?._id === orderId || shipment.order === orderId);
  const getCurrentStatus = (order) => getShipment(order.id)?.status || order.status || 'Pending Farmer Approval';

  const renderProductImage = (image, className) => {
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:image/'))) {
      return <img src={image} alt="Product" className={className} />;
    }
    return <span className={className}>{image || '🌾'}</span>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending Farmer Approval':
      case 'Accepted by Farmer':
        return <Check size={20} className="text-blue-600" />;
      case 'Driver Assigned':
        return <Clock size={20} className="text-yellow-600" />;
      case 'Picked Up from Farm':
      case 'In Transit':
      case 'Out for Delivery':
        return <Truck size={20} className="text-orange-600" />;
      case 'Delivered':
        return <Check size={20} className="text-emerald-600" />;
      default:
        return <Package size={20} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Farmer Approval':
      case 'Accepted by Farmer':
        return 'bg-blue-100 text-blue-700';
      case 'Driver Assigned':
        return 'bg-yellow-100 text-yellow-700';
      case 'Picked Up from Farm':
      case 'In Transit':
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-700';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressPercentage = (status) => {
    const statusMap = {
      'Pending Farmer Approval': 15,
      'Accepted by Farmer': 30,
      'Driver Assigned': 45,
      'Picked Up from Farm': 60,
      'In Transit': 75,
      'Out for Delivery': 90,
      'Delivered': 100,
    };
    return statusMap[status] || 0;
  };

  const handleConfirmReceipt = async (orderId) => {
    const shipment = getShipment(orderId);
    if (!shipment) return;
    try {
      await updateShipment(shipment._id, { status: 'Delivered' });
      if (refreshData) refreshData();
    } catch (err) {
      console.error('Failed to confirm receipt:', err);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Orders</h1>
          <p className="text-accent-muted">Track your orders in real-time</p>
        </div>
        <div className="text-center py-16">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <p className="text-accent-muted text-lg">No orders yet</p>
          <p className="text-accent-muted text-sm">Start shopping to place your first order</p>
        </div>
      </div>
    );
  }

  return (
      <div className="buyer-orders space-y-7">
      <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#168aad]"><Package size={14} /> Fresh from the field</div>
          <h1 className="font-display text-4xl font-bold text-[#173e2b]">My orders</h1>
          <p className="mt-2 text-sm text-[#718278]">Follow every harvest from a trusted farm to your table.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="buyer-order border-b border-[#cfe0e3] pb-8"
          >
            {/* Order Header */}
            <div className="relative overflow-hidden rounded-2xl border border-[#d6e7e9] bg-white/65 p-5 backdrop-blur-sm md:p-6">
              <img src={typeof order.items?.[0]?.image === 'string' && (order.items[0].image.startsWith('http') || order.items[0].image.startsWith('data:')) ? order.items[0].image : backgroundPhoto} alt="Fresh produce from your order" className="absolute right-0 top-0 h-full w-40 object-cover opacity-15 mix-blend-multiply" />
              <div className="flex items-start justify-between gap-4">
                <div className="relative">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#a9744f]">Harvest journey {idx + 1}</p>
                  <h3 className="text-lg font-bold text-[#173e2b]">Order #{order.id.slice(-8)}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-[#718278]">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      {order.items.length} item(s)
                    </span>
                  </div>
                </div>
                <div className="relative text-right">
                  <p className="font-display text-2xl font-bold text-[#168aad]">₹{order.totalAmount.toLocaleString()}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusColor(getCurrentStatus(order))}`}>
                    {getCurrentStatus(order)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Progress */}
            <div className="space-y-6 px-1 pt-6 md:px-3">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-primary">Delivery Progress</p>
                  <p className="text-sm text-accent-muted">
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#e4eff0]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(getCurrentStatus(order))}%` }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-[#168aad] to-[#52b788]"
                  />
                </div>
              </div>

              {getCurrentStatus(order) === 'Out for Delivery' && (
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConfirmReceipt(order.id)}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Check size={20} />
                    Confirm Receipt (Mark Delivered)
                  </motion.button>
                </div>
              )}

              {/* Status Timeline */}
              <div className="space-y-4">
                {['Pending Farmer Approval', 'Accepted by Farmer', 'Driver Assigned', 'Picked Up from Farm', 'In Transit', 'Out for Delivery', 'Delivered'].map((status, idx) => {
                  const timeline = ['Pending Farmer Approval', 'Accepted by Farmer', 'Driver Assigned', 'Picked Up from Farm', 'In Transit', 'Out for Delivery', 'Delivered'];
                  const currentStatus = getCurrentStatus(order);
                  const isCompleted = timeline.indexOf(currentStatus) >= idx;
                  const isActive = currentStatus === status;

                  return (
                    <div key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 + idx * 0.1 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-surface-alt text-gray-400'
                          }`}
                        >
                          {isCompleted ? getStatusIcon(status) : idx + 1}
                        </motion.div>
                        {idx < 6 && (
                          <div className={`w-0.5 h-12 my-2 ${isCompleted ? 'bg-emerald-500' : 'bg-surface-alt'}`} />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={`font-semibold ${isActive ? 'text-emerald-600' : isCompleted ? 'text-primary' : 'text-accent-muted'}`}>
                          {status}
                        </p>
                        <p className="text-sm text-accent-muted">
                          {isActive ? 'Currently processing' : isCompleted ? 'Completed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {getShipment(order.id)?.driverName && (
                <div className="border-l-2 border-[#52b788] bg-[#f1faf5] px-4 py-3">
                  <h4 className="mb-2 font-semibold text-[#173e2b]">Assigned driver</h4>
                  <p className="text-sm text-accent-muted">{getShipment(order.id).driverName} • {getShipment(order.id).driverContactNumber}</p>
                  <p className="text-sm text-accent-muted">Vehicle: {getShipment(order.id).vehicleNumber}</p>
                  <p className="text-sm text-accent-muted">Estimated delivery: {new Date(getShipment(order.id).estimatedDeliveryDate).toLocaleDateString()}</p>
                </div>
              )}

              {/* Order Items */}
              <div className="border-t border-surface-alt pt-6">
                <h4 className="font-semibold text-primary mb-4">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b border-[#e4eff0] px-1 py-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#d8f0e4] to-[#b6dcd0] shadow-sm">
                          {renderProductImage(item.image, 'h-full w-full object-cover')}
                        </div>
                        <div>
                          <p className="font-semibold text-primary">{item.name}</p>
                          <p className="text-xs text-accent-muted">
                            Qty: {item.quantity} {item.unit}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex items-start gap-3 border-t border-[#e4eff0] pt-5">
                <MapPin size={18} className="mt-0.5 text-[#168aad]" />
                <div>
                  <h4 className="mb-1 font-semibold text-[#173e2b]">Delivery address</h4>
                  <p className="text-sm text-accent-muted">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
