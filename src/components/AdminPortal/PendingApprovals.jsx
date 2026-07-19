import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Users, Package } from 'lucide-react';
import api from '../../api/axios';

const PendingApprovals = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          api.get('/users'),
          api.get('/products/all'),
        ]);

        const allUsers = usersRes?.data?.users || [];
        const allProducts = productsRes?.data?.products || [];

        const pendingFarmers = allUsers.filter(u => u.role === 'farmer');
        const pendingBuyers = allUsers.filter(u => u.role === 'buyer' || u.role === 'consumer');
        const pendingProducts = allProducts.filter(p => !p.status || p.status === 'pending');

        const newGroups = [];
        if (pendingFarmers.length > 0) {
          newGroups.push({
            id: 'farmers',
            type: 'Farmer',
            name: `${pendingFarmers.length} registered farmer(s)`,
            requestId: 'Registered Users',
            submissionDate: new Date(pendingFarmers[0]?.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
            icon: Users,
            count: pendingFarmers.length,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200',
          });
        }
        if (pendingBuyers.length > 0) {
          newGroups.push({
            id: 'buyers',
            type: 'Buyer',
            name: `${pendingBuyers.length} registered buyer(s)`,
            requestId: 'Registered Users',
            submissionDate: new Date(pendingBuyers[0]?.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
            icon: Users,
            count: pendingBuyers.length,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200',
          });
        }
        if (pendingProducts.length > 0) {
          newGroups.push({
            id: 'products',
            type: 'Product',
            name: `${pendingProducts.length} product(s) awaiting review`,
            requestId: 'Unlisted Products',
            submissionDate: new Date(pendingProducts[0]?.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
            icon: Package,
            count: pendingProducts.length,
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-200',
          });
        }

        setGroups(newGroups);
      } catch (err) {
        console.error('Failed to fetch pending approvals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingData();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Pending Approvals</h3>

      {loading ? (
        <div className="text-center py-8 text-slate-400">Loading approvals...</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl">
          <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
          <p className="font-medium text-slate-600">All caught up!</p>
          <p className="text-sm mt-1">No pending approvals at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((approval) => {
            const Icon = approval.icon;
            return (
              <div
                key={approval.id}
                className={`${approval.bgColor} border ${approval.borderColor} rounded-lg p-4 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${approval.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {approval.type} Verification
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {approval.requestId}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-slate-900">
                    {approval.count} Items
                  </span>
                </div>

                <div className="bg-white/50 rounded p-3 mb-4">
                  <p className="text-sm text-slate-900 font-medium mb-1">{approval.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span>Since: {approval.submissionDate}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded text-xs font-semibold transition-all duration-200">
                    <CheckCircle className="w-4 h-4" />
                    Review
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 text-white hover:bg-slate-700 rounded text-xs font-semibold transition-all duration-200">
                    <XCircle className="w-4 h-4" />
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium py-2 hover:bg-slate-50 rounded-lg transition-colors">
        View All Pending Approvals →
      </button>
    </div>
  );
};

export default PendingApprovals;
