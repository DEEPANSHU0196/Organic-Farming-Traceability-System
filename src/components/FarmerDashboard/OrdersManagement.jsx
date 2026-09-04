import { motion } from 'motion/react';
import { CheckCircle, XCircle, Eye, Clock, Search, X, Download, Phone, Mail, MapPin, Package, Hourglass, BadgeCheck, CircleX, CircleDollarSign, Sprout } from 'lucide-react';
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
    if (status === 'Accepted by Farmer') return <CheckCircle className="text-green-600" size={18} />;
    if (status === 'Rejected by Farmer') return <XCircle className="text-red-600" size={18} />;
    if (status === 'Pending Farmer Approval') return <Clock className="text-amber-600" size={18} />;
    return null;
  };

  const getStatusColor = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'accepted by farmer' || normalized === 'accepted') return 'bg-green-100 text-green-700';
    if (normalized === 'rejected by farmer' || normalized === 'rejected') return 'bg-red-100 text-red-700';
    if (normalized === 'pending farmer approval' || normalized === 'pending') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const normalizeStatus = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'accepted by farmer' || normalized === 'accepted') return 'Accepted by Farmer';
    if (normalized === 'rejected by farmer' || normalized === 'rejected') return 'Rejected by Farmer';
    return 'Pending Farmer Approval';
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
    pending: normalizedOrders.filter(o => o.status === 'Pending Farmer Approval').length,
    accepted: normalizedOrders.filter(o => o.status === 'Accepted by Farmer').length,
    rejected: normalizedOrders.filter(o => o.status === 'Rejected by Farmer').length,
    avgValue: normalizedOrders.length
      ? `₹${Math.round(normalizedOrders.reduce((sum, order) => sum + (Number(order.amount?.replace(/[^0-9]/g, '') || 0)), 0) / normalizedOrders.length).toLocaleString('en-IN')}`
      : '₹0',
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/farmer/${orderId}`, {
        status: newStatus,
        ...(newStatus === 'Rejected by Farmer' ? { rejectionReason: window.prompt('Why is this order being rejected?') || 'Product is unavailable' } : {}),
      });
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
    <div className="farmer-orders space-y-7">
      <div className="flex flex-col justify-between gap-4 border-b border-[#dbe7dc] pb-6 md:flex-row md:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a9744f]"><Sprout size={14} /> Harvest desk</p>
          <h1 className="font-display text-4xl font-bold text-[#173e2b]">Orders management</h1>
          <p className="mt-2 text-sm text-[#718278]">Keep every harvest moving from your field to the right buyer.</p>
        </div>
        <p className="text-xs font-semibold text-[#718278]">{stats.total} orders in your network</p>
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
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-[#dbe7dc] pb-6 md:grid-cols-5">
        {[
          { label: 'Total Orders', value: stats.total, icon: Package, color: '#168aad' },
          { label: 'Pending Approval', value: stats.pending, icon: Hourglass, color: '#c98a2e' },
          { label: 'Accepted', value: stats.accepted, icon: BadgeCheck, color: '#2d9d68' },
          { label: 'Rejected', value: stats.rejected, icon: CircleX, color: '#c96855' },
          { label: 'Avg Value', value: stats.avgValue, icon: CircleDollarSign, color: '#a9744f' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="order-stat group flex items-center gap-3 border-l border-[#dbe7dc] pl-4 first:border-l-0 first:pl-0"
          >
            <stat.icon size={22} style={{ color: stat.color }} className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
            <div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#8a978e]">{stat.label}</p><p className="font-display text-2xl font-bold text-[#173e2b]">{stat.value}</p></div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="order-filters space-y-4 border-b border-[#dbe7dc] pb-6"
      >
        <div className="flex items-center gap-3 border-b border-[#cfded2] px-1 py-3 focus-within:border-[#2d6a4f]">
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
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a978e]">Filter by status</label>
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pending Farmer Approval', 'Accepted by Farmer', 'Rejected by Farmer'].map(status => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-[#2d6a4f] text-white shadow-md shadow-[#2d6a4f]/20'
                    : 'border border-[#dbe7dc] bg-transparent text-[#718278] hover:border-[#8fb996] hover:text-[#173e2b]'
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
        className="overflow-hidden border-b border-[#dbe7dc]"
      >
        {loading ? (
          <div className="p-8 text-center text-accent-muted">Loading orders from buyers...</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-[#dbe7dc]">
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
                  className="order-row border-b border-[#edf2ea] transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-bold text-[#173e2b]">{order.id}</td>
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
              {selectedOrder.status === 'Accepted by Farmer' && (
                <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <CheckCircle size={18} />
                  <p className="text-sm font-medium">A transporter has been automatically assigned to this order and they will contact you for pickup.</p>
                </div>
              )}

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
                {selectedOrder.status === 'Pending Farmer Approval' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Accepted by Farmer')}
                      className="flex-1 min-w-[120px] px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => updateOrderStatus(selectedOrder.id, 'Rejected by Farmer')}
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
