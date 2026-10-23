import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreHorizontal, RefreshCw } from 'lucide-react';
import PortalSidebar, { ROLE_LABELS } from './PortalSidebar';
import PortalNavbar from './PortalNavbar';
import OnboardingTour from './OnboardingTour';

const MOBILE_TABS = 4;
const PULL_TRIGGER = 72;

/* Touch pull-to-refresh for the scrolling content area: reloads shared data
   (via the agroverse:refresh event) and remounts the section so it refetches. */
function usePullToRefresh(scrollRef, onRefresh) {
  const startY = useRef(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handlers = {
    onTouchStart: (e) => {
      startY.current = scrollRef.current?.scrollTop === 0 && !refreshing ? e.touches[0].clientY : null;
    },
    onTouchMove: (e) => {
      if (startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      setPull(dy > 0 ? Math.min(110, dy * 0.5) : 0);
    },
    onTouchEnd: () => {
      if (startY.current == null) return;
      startY.current = null;
      if (pull >= PULL_TRIGGER) {
        setRefreshing(true);
        setPull(56);
        onRefresh();
        window.setTimeout(() => { setRefreshing(false); setPull(0); }, 900);
      } else {
        setPull(0);
      }
    },
  };
  return { pull, refreshing, handlers };
}

/* Thumb-reachable tab bar for phones: first four sections plus "More" (opens the drawer). */
function MobileTabBar({ role, navItems, activeSection, setActiveSection, onMore }) {
  const tabs = navItems.slice(0, MOBILE_TABS);
  const moreActive = !tabs.some((t) => t.id === activeSection);
  return (
    <nav
      aria-label="Quick sections"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-[#101d15]/95"
    >
      <div className="grid grid-cols-5">
        {[...tabs, { id: '__more', label: 'More', icon: MoreHorizontal }].map((item) => {
          const Icon = item.icon;
          const active = item.id === '__more' ? moreActive : activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => (item.id === '__more' ? onMore() : setActiveSection(item.id))}
              aria-current={active ? 'page' : undefined}
              className={`relative flex min-h-[60px] flex-col items-center justify-center gap-1 text-[10.5px] font-semibold ${active ? 'text-leaf' : 'text-ink-soft dark:text-paper/60'}`}
            >
              {active && (
                <motion.span layoutId={`tab-active-${role}`} className="absolute top-0 h-[3px] w-8 rounded-b-full bg-leaf" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
              )}
              <motion.span animate={{ y: active ? -1 : 0, scale: active ? 1.1 : 1 }}>{Icon && <Icon size={20} />}</motion.span>
              <span className="max-w-[70px] truncate">{item.label.replace('Shopping ', '').replace('Browse Products', 'Browse')}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

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
  const section = navItems.find((i) => i.id === activeSection);
  const mainRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { pull, refreshing, handlers } = usePullToRefresh(mainRef, () => {
    window.dispatchEvent(new Event('agroverse:refresh'));
    setRefreshKey((k) => k + 1);
  });

  return (
    <div className={`dashboard-shell portal-${role} ${portalClassName} flex h-screen overflow-hidden`}>
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

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <PortalNavbar
          role={role}
          navItems={navItems}
          onNavigate={setActiveSection}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onLogout={onLogout}
        />

        <main ref={mainRef} className="relative flex-1 overflow-auto pb-24 md:pb-0" {...handlers}>
          <motion.div
            aria-hidden={!refreshing}
            className="pointer-events-none absolute left-1/2 top-0 z-20 -ml-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-leaf shadow-lg md:hidden dark:bg-[#1b2a20]"
            animate={{ y: pull - 44, opacity: pull > 8 ? 1 : 0, rotate: refreshing ? 360 : pull * 3 }}
            transition={refreshing ? { rotate: { repeat: Infinity, duration: 0.8, ease: 'linear' } } : { type: 'spring', stiffness: 400, damping: 30 }}
          >
            <RefreshCw size={18} />
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSection}-${refreshKey}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="dashboard-content min-h-full p-4 sm:p-6 md:p-8"
            >
              {/* Sections render their own headings; this is just orientation. */}
              <p className="mb-5 flex items-center gap-2 text-xs font-semibold text-ink-soft dark:text-paper/50">
                <span>{ROLE_LABELS[role]}</span>
                <span className="text-saffron">/</span>
                <span className="text-ink dark:text-paper">{section?.label || 'Dashboard'}</span>
              </p>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileTabBar
        role={role}
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onMore={() => setSidebarOpen(true)}
      />
      <OnboardingTour role={role} onNavigate={setActiveSection} />
    </div>
  );
}
