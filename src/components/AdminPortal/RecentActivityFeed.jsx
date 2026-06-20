import React, { useState } from 'react';
import {
  UserPlus,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  Lock,
  TrendingUp,
} from 'lucide-react';

const RecentActivityFeed = () => {
  const [activities] = useState([
    {
      id: 1,
      type: 'farmer_joined',
      title: 'New Farmer Registered',
      description: 'Suresh Nair joined the platform',
      icon: UserPlus,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      timestamp: '5 mins ago',
    },
    {
      id: 2,
      type: 'buyer_joined',
      title: 'New Buyer Registered',
      description: 'FreshMart Solutions registered',
      icon: ShoppingCart,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      timestamp: '12 mins ago',
    },
    {
      id: 3,
      type: 'product_approved',
      title: 'Product Approved',
      description: 'Organic Cotton product approved',
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      timestamp: '1 hour ago',
    },
    {
      id: 4,
      type: 'fraud_alert',
      title: 'Fraud Alert',
      description: 'Suspicious pricing detected',
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      timestamp: '2 hours ago',
    },
    {
      id: 5,
      type: 'account_suspended',
      title: 'Account Suspended',
      description: 'Account suspended due to violations',
      icon: Lock,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      timestamp: '3 hours ago',
    },
    {
      id: 6,
      type: 'order_completed',
      title: 'Order Completed',
      description: 'Order #ORD-2024-8903 completed',
      icon: TrendingUp,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      timestamp: '4 hours ago',
    },
  ]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
      </div>

      {/* Activity Feed */}
      <div className="max-h-[600px] overflow-y-auto">
        {activities.map((activity, idx) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                idx === activities.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 text-center">
        <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
          View All Activity →
        </button>
      </div>
    </div>
  );
};

export default RecentActivityFeed;
