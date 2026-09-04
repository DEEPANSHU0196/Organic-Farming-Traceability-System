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
  portalLinks = [],
  portalClassName = '',
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const roleLabel = `${role.charAt(0).toUpperCase()}${role.slice(1)} Portal`;
  const sectionLabel = activeSection === 'overview' ? 'Dashboard' : activeSection.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

  return (
    <div className={`dashboard-shell portal-${role} ${portalClassName} flex h-screen overflow-hidden`}>
      {/* Sidebar */}
      <PortalSidebar
        role={role}
        items={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        portalLinks={portalLinks}
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
            className="dashboard-content p-6 md:p-8 min-h-full"
          >
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-[#718278]">
              <span>{roleLabel}</span><span className="text-[#a9744f]">/</span><span className="text-[#1b4332]">{sectionLabel}</span>
            </div>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
