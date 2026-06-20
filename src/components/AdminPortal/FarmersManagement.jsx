import React, { useState } from 'react';
import {
  Eye,
  Edit,
  Lock,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const FarmersManagement = () => {
  const [farmers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      location: 'Punjab, India',
      products: 24,
      status: 'Verified',
      joinDate: 'Jan 15, 2024',
      revenue: '$12,400',
    },
    {
      id: 2,
      name: 'Priya Singh',
      location: 'Haryana, India',
      products: 18,
      status: 'Verified',
      joinDate: 'Feb 3, 2024',
      revenue: '$8,950',
    },
    {
      id: 3,
      name: 'Amit Patel',
      location: 'Gujarat, India',
      products: 32,
      status: 'Pending',
      joinDate: 'Feb 20, 2024',
      revenue: '$5,200',
    },
    {
      id: 4,
      name: 'Deepa Verma',
      location: 'Maharashtra, India',
      products: 15,
      status: 'Verified',
      joinDate: 'Mar 1, 2024',
      revenue: '$6,800',
    },
    {
      id: 5,
      name: 'Suresh Nair',
      location: 'Karnataka, India',
      products: 28,
      status: 'Verified',
      joinDate: 'Mar 10, 2024',
      revenue: '$14,200',
    },
  ]);

  const getStatusIcon = (status) => {
    if (status === 'Verified') {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            Verified
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
            <h3 className="text-lg font-bold text-slate-900">Farmers Management</h3>
            <p className="text-sm text-slate-500 mt-1">
              Manage registered farmers and their profiles
            </p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-all duration-200">
            + Add Farmer
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Farmer Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer, idx) => (
              <tr
                key={farmer.id}
                className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{farmer.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{farmer.location}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-900">{farmer.products}</p>
                </td>
                <td className="px-6 py-4">{getStatusIcon(farmer.status)}</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{farmer.joinDate}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-green-600">{farmer.revenue}</p>
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center">
        <p className="text-sm text-slate-600">Showing 5 of 2,847 farmers</p>
        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
          View All Farmers →
        </button>
      </div>
    </div>
  );
};

export default FarmersManagement;
