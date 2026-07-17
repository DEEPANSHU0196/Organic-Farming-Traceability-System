import { motion } from 'motion/react';
import { CheckCircle, XCircle, Eye, Clock, Search, X, Download, Phone, Mail, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showNotification, setShowNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/farmer');
        if (!active) return;
        setOrders(response?.data?.orders || []);
        setError('');
      } catch (err) {
        if (!active) return;
        console.error('Failed to load farmer orders:', err);
        setError(err?.response?.data?.message || 'Unable to load orders right now.');
        setOrders([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      active = false;
    };
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'Accepted') return <CheckCircle className="text-green-600" size={18} />;
    if (status === 'Rejected') return <XCircle className="text-red-600" size={18} />;
    if (status === 'Pending') return <Clock className="text-amber-600" size={18} />;
    return null;
  };

  const getStatusColor = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'accepted') return 'bg-green-100 text-green-700';
    if (normalized === 'rejected') return 'bg-red-100 text-red-700';
    if (normalized === 'pending') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const normalizeStatus = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'accepted') return 'Accepted';
    if (normalized === 'rejected') return 'Rejected';
    return 'Pending';
  };

  const normalizedOrders = orders.map((order) => ({ ...order, status: normalizeStatus(order.status) }));

  const filteredOrders = normalizedOrders.filter(order => {
    const searchValue = (searchTerm || '').toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchValue) ||
      order.buyer.toLowerCase().includes(searchValue) ||
      order.product.toLowerCase().includes(searchValue);
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: normalizedOrders.length,
    pending: normalizedOrders.filter(o => o.status === 'Pending').length,
    accepted: normalizedOrders.filter(o => o.status === 'Accepted').length,
    rejected: normalizedOrders.filter(o => o.status === 'Rejected').length,
    avgValue: normalizedOrders.length
      ? `₹${Math.round(normalizedOrders.reduce((sum, order) => sum + (Number(order.amount?.replace(/[^0-9]/g, '') || 0)), 0) / normalizedOrders.length).toLocaleString('en-IN')}`
      : '₹0',
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/farmer/${orderId}`, { status: newStatus });
      const updatedOrder = response?.data?.order;
      if (updatedOrder) {
        setOrders((prev) => prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
      }
      setShowNotification({ type: 'success', message: `Order ${newStatus.toLowerCase()}!` });
      setTimeout(() => setShowNotification(null), 3000);
      setShowDetailModal(false);
    } catch (err) {
      setShowNotification({ type: 'error', message: err?.response?.data?.message || 'Unable to update order status' });
      setTimeout(() => setShowNotification(null), 4000);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const downloadOrderDetails = (order) => {
    const content = `Order Details\nID: ${order.id}\nBuyer: ${order.buyer}\nProduct: ${order.product}\nQuantity: ${order.quantity} ${order.unit}\nAmount: ${order.amount}\nDate: ${order.date}\nStatus: ${order.status}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.id}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Orders Management</h1>
        <p className="text-accent-muted">View and manage incoming orders from buyers</p>
      </div>

      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-white ${showNotification.type === 'success' ? 'bg-green-500' : showNotification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}
        >
          {showNotification.type === 'success' ? '✓' : '⚠'} {showNotification.message}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: stats.total, icon: '📦', color: 'bg-blue-50' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'bg-amber-50' },
          { label: 'Accepted', value: stats.accepted, icon: '✓', color: 'bg-green-50' },
          { label: 'Rejected', value: stats.rejected, icon: '✗', color: 'bg-red-50' },
          { label: 'Avg Value', value: stats.avgValue, icon: '💰', color: 'bg-purple-50' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`${stat.color} rounded-lg p-4 text-center border border-surface-alt`}
          >
            <p className="text-2xl mb-2">{stat.icon}</p>
            <p className="text-accent-muted text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt p-4 space-y-3"
      >
        <div className="flex items-center gap-3 bg-surface-alt rounded-lg px-4 py-2">
          <Search size={18} className="text-accent" />
          <input
            type="text"
            placeholder="Search by Order ID, Buyer name, or Product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none w-full text-primary text-sm"
          />
        </div>
        <div>
          <label className="text-sm text-accent-muted mb-2 block">Filter by Status</label>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pending', 'Accepted', 'Rejected'].map(status => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-emerald-500 text-white'
                    : 'bg-surface-alt text-accent hover:bg-surface-alt/80'
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md border border-surface-alt overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center text-accent-muted">Loading orders from buyers...</div>
        ) : (
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
              {filteredOrders.map((order) => (
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
                  <td className="px-6 py-4 text-sm font-medium text-primary">{order.quantity} {order.unit}</td>
                  <td className="px-6 py-4 text-sm text-accent-muted">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">{order.amount}</td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors"
                    >
                      <Eye size={14} />
                      View
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Details - {selectedOrder.id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-white/20 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-primary mb-3">Order Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-accent-muted">Order ID</p>
                      <p className="font-semibold text-primary">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Date Received</p>
                      <p className="font-semibold text-primary">{selectedOrder.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(selectedOrder.status)}
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-primary mb-3">Product & Pricing</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-accent-muted">Product</p>
                      <p className="font-semibold text-primary">{selectedOrder.product}</p>
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Quantity</p>
                      <p className="font-semibold text-primary">{selectedOrder.quantity} {selectedOrder.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-accent-muted">Total Amount</p>
                      <p className="font-bold text-emerald-600 text-lg">{selectedOrder.amount}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-alt rounded-lg p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                  <h3 className="font-bold text-primary">Buyer Information</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                    Verified buyer
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-emerald-500 mt-1" />
                    <div>
                      <p className="text-xs text-accent-muted">Email</p>
                      <p className="font-semibold text-primary">{selectedOrder.buyerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-emerald-500 mt-1" />
                    <div>
                      <p className="text-xs text-accent-muted">Phone</p>
                      <p className="font-semibold text-primary">{selectedOrder.buyerPhone}</p>
                    </div>
                  </div>
                  {selectedOrder.buyerAddress && (
                    <div className="flex items-start gap-3 md:col-span-2">
                      <MapPin size={18} className="text-emerald-500 mt-1" />
                      <div>
                        <p className="text-xs text-accent-muted">Address</p>
                        <p className="font-semibold text-primary">{selectedOrder.buyerAddress}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-surface-alt flex-wrap">
                {selectedOrder.status === 'Pending' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Accepted')}
                      className="flex-1 min-w-[120px] px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Rejected')}
                      className="flex-1 min-w-[120px] px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Reject
                    </motion.button>
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => downloadOrderDetails(selectedOrder)}
                  className="flex-1 min-w-[120px] px-4 py-3 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                >
                  Download
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 min-w-[120px] px-4 py-3 border border-surface-alt rounded-lg hover:bg-surface-alt transition-colors font-medium"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg border border-surface-alt"
        >
          <p className="text-4xl mb-4">📭</p>
          <p className="text-primary font-semibold mb-2">No orders found</p>
          <p className="text-accent-muted">Try adjusting your filters</p>
        </motion.div>
      )}
    </div>
  );
}
