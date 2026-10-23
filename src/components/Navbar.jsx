import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Menu } from 'lucide-react';
import { BrandMark } from '../shared/ui';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS = [
  { label: 'How it works', href: 'workflow' },
  { label: 'Portals', href: 'features' },
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
];

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = '';
      for (const { href } of NAV_LINKS) {
        const el = document.getElementById(href);
        if (el && el.getBoundingClientRect().top <= 140) current = href;
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <motion.nav
          animate={{ maxWidth: scrolled ? 980 : 1240 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`flex w-full items-center justify-between rounded-full border px-3 py-2 pl-5 transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled
              ? 'border-line/80 bg-paper/85 shadow-[0_8px_30px_rgba(19,38,27,0.08)] backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          }`}
        >
          <a
            href="/"
            className="flex items-center gap-2"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <BrandMark size={30} />
            <span className="font-display text-[20px] font-semibold tracking-tight text-ink">AgroVerse</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className={`relative rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-ink/[0.06]"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="group hidden items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-paper transition-colors hover:bg-leaf sm:flex"
            >
              Sign in
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col bg-paper px-6 pb-10 pt-28 md:hidden"
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  type="button"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  onClick={() => scrollTo(link.href)}
                  className="flex items-baseline justify-between border-b border-line py-5 text-left font-display text-3xl text-ink"
                >
                  {link.label}
                  <span className="font-sans text-xs text-ink-soft">0{i + 1}</span>
                </motion.button>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => { setMobileOpen(false); navigate('/login'); }}
              className="mt-auto flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-base font-semibold text-paper"
            >
              Sign in <ArrowUpRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
