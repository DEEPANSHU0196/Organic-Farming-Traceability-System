import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, LogIn, X, Menu } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: 'features' },
  { label: 'About Us', href: 'about' },
  { label: 'Contact',  href: 'contact' },
];

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled]       = useState(false);

  // Track scroll position for active-section highlighting & navbar shadow
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Figure out which section is in viewport
      const sectionIds = NAV_LINKS.map((l) => l.href);
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }, []);

  return (
    <>
      {/* ── Fixed Top Navbar ── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 px-5 sm:px-8 py-4 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-primary/5'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 select-none group"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Leaf className="text-white w-4 h-4" />
          </div>
          <span className={`text-[20px] sm:text-[22px] tracking-tight font-bold select-none font-display transition-colors duration-500 ${scrolled ? 'text-primary' : 'text-white'}`}>
            AgroVerse
            <sup className={`text-[9px] align-super ml-[1px] font-normal transition-colors duration-500 ${scrolled ? 'text-primary/35' : 'text-white/50'}`}>®</sup>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`relative px-4 py-2 text-[15px] font-medium rounded-xl transition-all duration-200 ${
                  scrolled
                    ? isActive
                      ? 'text-primary'
                      : 'text-primary/60 hover:text-primary hover:bg-surface-alt/60'
                    : isActive
                      ? 'text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${scrolled ? 'bg-accent' : 'bg-green-400'}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            id="nav-sign-in"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-semibold transition-all duration-300 ${
              scrolled
                ? 'text-primary hover:bg-surface-alt'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <LogIn size={14} />
            Sign In
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            id="nav-get-started"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-[14px] font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${
              scrolled
                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-400/40 backdrop-blur-sm'
            }`}
          >
            Create Account
          </motion.button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className={`md:hidden relative z-50 p-2 rounded-xl transition-colors ${scrolled ? 'hover:bg-surface-alt' : 'hover:bg-white/10'}`}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X size={22} className={scrolled ? 'text-primary' : 'text-white'} />
          ) : (
            <Menu size={22} className={scrolled ? 'text-primary' : 'text-white'} />
          )}
        </button>
      </header>

      {/* ── Mobile Full-screen Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white/97 backdrop-blur-sm md:hidden flex flex-col"
          >
            {/* Spacer for fixed header */}
            <div className="h-[72px] flex-shrink-0" />

            <nav className="flex flex-col items-center justify-center flex-1 gap-2 px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => scrollTo(link.href)}
                  className={`w-full text-center py-4 text-2xl font-display font-semibold tracking-tight rounded-2xl transition-all duration-200 ${
                    activeSection === link.href
                      ? 'text-primary bg-surface-alt'
                      : 'text-primary/60 hover:text-primary hover:bg-surface-alt/50'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.25 }}
                className="w-12 h-px bg-primary/10 my-4"
              />

              <div className="flex flex-col gap-3 w-full max-w-xs">
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  id="mobile-nav-sign-in"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-800 text-base font-semibold rounded-full shadow-sm"
                >
                  <LogIn size={18} />
                  Sign In
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36 }}
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  id="mobile-nav-create-account"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-700 text-white text-base font-semibold rounded-full shadow-lg"
                >
                  Create Account
                </motion.button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
