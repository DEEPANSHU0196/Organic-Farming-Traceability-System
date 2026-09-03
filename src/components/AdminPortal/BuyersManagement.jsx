import React, { useState, useEffect } from 'react';
import {
  Eye,
  Edit,
  Lock,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import api from '../../api/axios';

const BuyersManagement = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await api.get('/users');
        if (response?.data?.success) {
          const allUsers = response.data.users || [];
          const buyersList = allUsers.filter(u => u.role === 'buyer' || u.role === 'consumer').map(u => ({
            id: u._id,
            name: u.fullName || u.name || 'Anonymous Buyer',
            orders: 0,
            spending: '₹0',
            status: 'Active',
            joinDate: new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
          }));
          setBuyers(buyersList);
        }
      } catch (error) {
        console.error('Failed to load buyers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  const handleDelete = async (buyer) => {
    if (!window.confirm(`Remove ${buyer.name} from the platform?`)) return;
    try {
      setDeletingId(buyer.id);
      await api.delete(`/users/${buyer.id}`);
      setBuyers((current) => current.filter((item) => item.id !== buyer.id));
    } catch (error) {
      console.error('Failed to remove buyer:', error);
      window.alert(error?.response?.data?.message || 'Unable to remove this buyer.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            Active
          </span>
        </div>
      );
    } else if (status === 'Suspended') {
      return (
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            Suspended
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-yellow-600" />
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
          Pending
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Buyers Management</h3>
            <p className="text-sm text-slate-500 mt-1">
              Manage registered buyers and monitor their activities
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-all duration-200">
            + Add Buyer
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Buyer Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Orders Placed
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total Spending
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer, idx) => (
              <tr
                key={buyer.id}
                className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{buyer.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900">{buyer.orders}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-blue-600">{buyer.spending}</p>
                </td>
                <td className="px-6 py-4">{getStatusBadge(buyer.status)}</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{buyer.joinDate}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Suspend">
                      <Lock className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(buyer)} disabled={deletingId === buyer.id} className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors disabled:opacity-40" title="Remove buyer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
        <p className="text-sm text-slate-600">
          {loading ? 'Loading...' : `Showing ${buyers.length} registered buyer(s)`}
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Buyers →
        </button>
      </div>
    </div>
  );
};

export default BuyersManagement;
