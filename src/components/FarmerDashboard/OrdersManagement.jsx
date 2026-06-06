import { motion } from 'motion/react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';

const orders = [
  {
    id: '#OD001',
    buyer: 'Rajesh Kumar',
    product: 'Premium Wheat',
    quantity: 100,
    unit: 'kg',
    date: '2025-12-15',
    status: 'Pending',
    price: 250000,
  },
  {
    id: '#OD002',
    buyer: 'Priya Sharma',
    product: 'Basmati Rice',
    quantity: 50,
    unit: 'kg',
    date: '2025-12-14',
    status: 'Accepted',
    price: 225000,
  },
  {
    id: '#OD003',
    buyer: 'Amit Singh',
    product: 'Yellow Mustard',
    quantity: 75,
    unit: 'kg',
    date: '2025-12-13',
    status: 'Rejected',
    price: 412500,
  },
  {
    id: '#OD004',
    buyer: 'Deepak Patel',
    product: 'Organic Corn',
    quantity: 200,
    unit: 'kg',
    date: '2025-12-12',
    status: 'Accepted',
    price: 360000,
  },
];

export default function OrdersManagement() {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="text-green-600" size={18} />;
      case 'Rejected':
        return <XCircle className="text-red-600" size={18} />;
      case 'Pending':
        return <Clock className="text-amber-600" size={18} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Orders Management</h1>
        <p className="text-accent-muted">View and manage incoming orders from buyers</p>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt border-b border-surface-alt">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Buyer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-alt">
              {orders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: '#f1f3f1' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-bold text-primary">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-accent-muted">{order.buyer}</td>
                  <td className="px-6 py-4 text-sm text-primary">{order.product}</td>
                  <td className="px-6 py-4 text-sm font-medium text-primary">
                    {order.quantity} {order.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-accent-muted">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">₹{order.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {order.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-surface-alt text-accent rounded-lg text-xs font-medium hover:bg-accent hover:text-white transition-colors"
                      >
                        <Eye size={14} />
                        View
                      </motion.button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: '28', color: 'bg-blue-50' },
          { label: 'Pending', value: '5', color: 'bg-amber-50' },
          { label: 'Accepted', value: '20', color: 'bg-green-50' },
          { label: 'Rejected', value: '3', color: 'bg-red-50' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className={`${stat.color} rounded-lg p-4 text-center`}
          >
            <p className="text-sm text-accent-muted mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
