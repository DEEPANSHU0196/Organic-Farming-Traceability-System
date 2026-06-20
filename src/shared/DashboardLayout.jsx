import { useState } from 'react';
import { motion } from 'motion/react';
import PortalSidebar from './PortalSidebar';
import PortalNavbar from './PortalNavbar';

export default function DashboardLayout({
  role,
  navItems,
  activeSection,
  setActiveSection,
  children,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <PortalSidebar
        role={role}
        items={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <PortalNavbar
          role={role}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onLogout={onLogout}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="p-6 md:p-8 min-h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
