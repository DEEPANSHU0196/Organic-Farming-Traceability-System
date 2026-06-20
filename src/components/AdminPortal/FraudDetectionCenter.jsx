import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  Users,
  ShoppingCart,
  Eye,
  MoreVertical,
} from 'lucide-react';

const FraudDetectionCenter = () => {
  const [alerts] = useState([
    {
      id: 1,
      title: 'Suspicious Pricing Activity',
      description:
        'Buyer account showing unusual pricing fluctuations for organic products',
      riskLevel: 'High',
      affectedUsers: 5,
      timestamp: '30 mins ago',
      icon: TrendingDown,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      id: 2,
      title: 'Duplicate Accounts',
      description: 'Detected 3 potentially duplicate farmer accounts with same details',
      riskLevel: 'Medium',
      affectedUsers: 3,
      timestamp: '1 hour ago',
      icon: Users,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      badgeColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 3,
      title: 'Unusual Transaction Patterns',
      description:
        'Multiple orders placed from same IP address in different locations within minutes',
      riskLevel: 'High',
      affectedUsers: 12,
      timestamp: '2 hours ago',
      icon: ShoppingCart,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      badgeColor: 'bg-red-100 text-red-700',
    },
    {
      id: 4,
      title: 'Fake Product Listings',
      description:
        'Farmer account listing products with stolen images and unrealistic prices',
      riskLevel: 'Medium',
      affectedUsers: 8,
      timestamp: '3 hours ago',
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      badgeColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 5,
      title: 'Payment Fraud Attempt',
      description: 'Multiple failed payment attempts detected from a single account',
      riskLevel: 'Low',
      affectedUsers: 1,
      timestamp: '4 hours ago',
      icon: TrendingDown,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
  ]);

  const getRiskLevelColor = (level) => {
    if (level === 'High') return 'text-red-700 bg-red-100';
    if (level === 'Medium') return 'text-yellow-700 bg-yellow-100';
    return 'text-blue-700 bg-blue-100';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Fraud Detection Center
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Monitor suspicious activities and protect the platform
            </p>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            5 Active Alerts
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-slate-200">
        {alerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <div
              key={alert.id}
              className={`${alert.bgColor} border-l-4 ${alert.borderColor} p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {alert.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskLevelColor(
                          alert.riskLevel
                        )}`}
                      >
                        {alert.riskLevel} Risk
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-3">
                    {alert.description}
                  </p>

                  {/* Footer Info */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{alert.affectedUsers} users affected</span>
                      </div>
                      <span>{alert.timestamp}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white hover:rounded-lg transition-all duration-200" title="Review">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-2 hover:bg-white hover:rounded-lg transition-all duration-200" title="More Options">
                        <MoreVertical className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 text-center">
        <button className="text-sm text-red-600 hover:text-red-700 font-medium">
          View Full Alert Log →
        </button>
      </div>
    </div>
  );
};

export default FraudDetectionCenter;
