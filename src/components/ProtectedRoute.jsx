import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const normalizeRole = (role) => {
  if (!role) return role;
  if (role === 'consumer' || role === 'buyer') return 'buyer';
  return role;
};

const roleDashboardMap = {
  farmer: '/farmer-dashboard/overview',
  buyer: '/buyer-dashboard/overview',
  transporter: '/transporter-dashboard/overview',
  admin: '/admin-dashboard/overview',
};

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, user, loading } = useAuth();
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole].filter(Boolean);
  const normalizedUserRole = normalizeRole(user?.role);
  const currentPath = window.location.pathname;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold">AT</span>
          </div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedUserRole)) {
    return <Navigate to={roleDashboardMap[normalizedUserRole] || '/login'} replace />;
  }

  if (allowedRoles.length > 0 && normalizedUserRole && normalizedUserRole !== 'admin' && currentPath.startsWith('/')) {
    const expectedPathPrefix = `/${normalizedUserRole}-dashboard`;
    if (!currentPath.startsWith(expectedPathPrefix)) {
      return <Navigate to={roleDashboardMap[normalizedUserRole] || '/login'} replace />;
    }
  }

  return children;
}
