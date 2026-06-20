import React from 'react';
import { Users, ShoppingCart, Package, TrendingUp, DollarSign, Clock } from 'lucide-react';

const PlatformStats = () => {
  const stats = [
    {
      id: 1,
      label: 'Total Farmers',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      trendUp: true,
    },
    {
      id: 2,
      label: 'Total Buyers',
      value: '5,234',
      change: '+8.3%',
      icon: ShoppingCart,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      trendUp: true,
    },
    {
      id: 3,
      label: 'Total Products',
      value: '18,562',
      change: '+24.1%',
      icon: Package,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      trendUp: true,
    },
    {
      id: 4,
      label: 'Active Orders',
      value: '3,421',
      change: '+18.7%',
      icon: TrendingUp,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      trendUp: true,
    },
    {
      id: 5,
      label: 'Revenue Generated',
      value: '$2.4M',
      change: '+31.2%',
      icon: DollarSign,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      trendUp: true,
    },
    {
      id: 6,
      label: 'Pending Approvals',
      value: '47',
      change: '+5 new',
      icon: Clock,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Platform Statistics</h2>
        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
          View Report →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    stat.trendUp
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {stat.change}
                </span>
              </div>

              <h3 className="text-slate-600 text-sm font-medium mb-1">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformStats;
