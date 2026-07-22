import { motion } from 'motion/react';
import { Package, Truck, Check, Clock, MapPin, Calendar } from 'lucide-react';
import { useBuyer } from '../../contexts/BuyerContext';

export default function OrderTracking() {
  const { orders = [], shipments = [] } = useBuyer();

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">My Orders</h1>
        <p className="text-accent-muted">Track {orders.length} order(s)</p>
      </div>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-surface-alt p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">{order.id}</h3>
                  <div className="flex items-center gap-4 text-sm text-accent-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      {order.items.length} item(s)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">₹{order.totalAmount.toLocaleString()}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusColor(getCurrentStatus(order))}`}>
                    {getCurrentStatus(order)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Progress */}
            <div className="p-6 space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-primary">Delivery Progress</p>
                  <p className="text-sm text-accent-muted">
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(getCurrentStatus(order))}%` }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                  />
                </div>
              </div>

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
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h4 className="font-semibold text-primary mb-2">Assigned Driver</h4>
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
                    <div key={item.id} className="flex items-center justify-between bg-surface-alt p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-200 rounded-lg flex-shrink-0 overflow-hidden">
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  Delivery Address
                </h4>
                <p className="text-sm text-accent-muted">{order.deliveryAddress}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
