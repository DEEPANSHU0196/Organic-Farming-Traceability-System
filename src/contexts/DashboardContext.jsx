import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  return (
    <DashboardContext.Provider 
      value={{ 
        sidebarOpen, 
        setSidebarOpen, 
        toggleSidebar, 
        closeSidebar, 
        openSidebar,
        activeSection,
        setActiveSection
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
