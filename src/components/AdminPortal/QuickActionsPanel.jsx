import React from 'react';
import {
  UserPlus,
  CheckCircle,
  FileText,
  BarChart3,
  MessageSquare,
  Download,
} from 'lucide-react';

const QuickActionsPanel = () => {
  const actions = [
    {
      id: 1,
      icon: UserPlus,
      label: 'Add Admin',
      description: 'Invite new admin to platform',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      hoverBg: 'hover:bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 2,
      icon: CheckCircle,
      label: 'Approve Products',
      description: '4 pending product approvals',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      hoverBg: 'hover:bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      id: 3,
      icon: FileText,
      label: 'Generate Reports',
      description: 'Export platform data & analytics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      hoverBg: 'hover:bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      id: 4,
      icon: BarChart3,
      label: 'View Analytics',
      description: 'Detailed platform performance',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      hoverBg: 'hover:bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 5,
      icon: MessageSquare,
      label: 'Support Messages',
      description: '8 new support requests',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      hoverBg: 'hover:bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      id: 6,
      icon: Download,
      label: 'Export Data',
      description: 'Download platform database',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      hoverBg: 'hover:bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              className={`text-left p-4 border ${action.borderColor} rounded-lg transition-all duration-200 ${action.hoverBg} group`}
            >
              <div className="flex items-start gap-3">
                <div className={`${action.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {action.label}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsPanel;
