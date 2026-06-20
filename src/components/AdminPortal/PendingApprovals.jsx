import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Package,
} from 'lucide-react';

const PendingApprovals = () => {
  const [approvals] = useState([
    {
      id: 1,
      type: 'Farmer',
      name: 'Suresh Nair',
      requestId: 'FR-2024-001',
      submissionDate: 'Mar 15, 2024',
      icon: Users,
      count: 12,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      id: 2,
      type: 'Buyer',
      name: 'TechMart Solutions',
      requestId: 'BR-2024-008',
      submissionDate: 'Mar 16, 2024',
      icon: Users,
      count: 8,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      id: 3,
      type: 'Product',
      name: 'Premium Cotton',
      requestId: 'PR-2024-045',
      submissionDate: 'Mar 17, 2024',
      icon: Package,
      count: 27,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
  ]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Pending Approvals</h3>

      <div className="space-y-4">
        {approvals.map((approval) => {
          const Icon = approval.icon;

          return (
            <div
              key={approval.id}
              className={`${approval.bgColor} border ${approval.borderColor} rounded-lg p-4 hover:shadow-md transition-all duration-200`}
            >
              {/* Header */}
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
                      Request ID: <span className="font-mono">{approval.requestId}</span>
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-slate-900">
                  {approval.count} Items
                </span>
              </div>

              {/* Info */}
              <div className="bg-white/50 rounded p-3 mb-4">
                <p className="text-sm text-slate-900 font-medium mb-1">{approval.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-3 h-3" />
                  <span>Submitted: {approval.submissionDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded text-xs font-semibold transition-all duration-200">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-xs font-semibold transition-all duration-200">
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All */}
      <button className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium py-2 hover:bg-slate-50 rounded-lg transition-colors">
        View All Pending Approvals →
      </button>
    </div>
  );
};

export default PendingApprovals;
