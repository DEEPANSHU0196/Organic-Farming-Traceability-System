import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock authentication - in production, this would check with a real backend
  const login = useCallback((email, password, role) => {
    setLoading(true);
    setTimeout(() => {
      if (email && password) {
        setUser({
          id: Math.random().toString(36).substr(2, 9),
          email,
          role, // 'admin', 'farmer', 'buyer', 'transporter'
          loginTime: new Date(),
        });
      }
      setLoading(false);
    }, 500);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin }}>
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
