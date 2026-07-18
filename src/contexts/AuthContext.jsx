import React, { createContext, useState, useCallback, useEffect } from 'react';
import { loginUser, registerUser } from '../api/auth';

export const AuthContext = createContext();

const normalizeRole = (role) => {
  if (!role) return role;
  if (role === 'consumer' || role === 'buyer') return 'buyer';
  return role;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('agroverse_user');
    const storedToken = localStorage.getItem('agroverse_token');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, role: normalizeRole(parsedUser.role) });
      } catch (error) {
        console.error('Failed to restore session:', error);
        localStorage.removeItem('agroverse_user');
        localStorage.removeItem('agroverse_token');
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (email, password, portal = null) => {
    setLoading(true);
    try {
      const response = await loginUser({ email, password, portal });
      const authUser = { ...response.data.user, role: normalizeRole(response.data.user.role) };
      const token = response.data.token;

      localStorage.setItem('agroverse_token', token);
      localStorage.setItem('agroverse_user', JSON.stringify(authUser));
      setUser(authUser);

      return response.data;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload, portal) => {
    setLoading(true);
    try {
      const response = await registerUser(payload, portal);
      return response.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('agroverse_token');
    localStorage.removeItem('agroverse_user');
    setUser(null);
  }, []);

  const updateUserProfile = useCallback((updatedUser) => {
    const nextUser = updatedUser ? { ...user, ...updatedUser, role: normalizeRole(updatedUser.role || user?.role) } : user;
    if (nextUser) {
      localStorage.setItem('agroverse_user', JSON.stringify(nextUser));
      setUser(nextUser);
    }
  }, [user]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}