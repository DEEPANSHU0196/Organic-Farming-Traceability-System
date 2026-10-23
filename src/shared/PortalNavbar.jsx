import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, Home, ChevronDown, LogOut, User, Settings, Moon, Sun, CornerDownLeft, ScanLine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import NotificationBell from './NotificationBell';
import { ROLE_LABELS, getInitials } from './PortalSidebar';

/* Search box that jumps to a portal section. ⌘K / Ctrl+K focuses it. */
function SectionSearch({ navItems, onPick }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? navItems.filter((i) => i.label.toLowerCase().includes(q)) : navItems;
  }, [query, navItems]);

  const pick = (item) => {
    onPick(item.id);
    setQuery('');
    inputRef.current?.blur();
  };

  return (
    <div className="relative hidden max-w-sm flex-1 md:block">
      <label className="flex items-center gap-2 rounded-xl border border-line bg-white/70 px-3.5 py-2.5 transition-colors focus-within:border-ink dark:border-white/10 dark:bg-white/5">
        <Search size={16} className="shrink-0 text-ink-soft" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
            if (e.key === 'Enter' && results[cursor]) pick(results[cursor]);
            if (e.key === 'Escape') inputRef.current?.blur();
          }}
          placeholder="Jump to…"
          aria-label="Jump to a section"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60 dark:text-paper"
        />
        <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-sans text-[10px] text-ink-soft lg:block dark:border-white/10">⌘K</kbd>
      </label>
      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-2xl dark:border-white/10 dark:bg-[#1b2a20]"
          >
            {results.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => pick(item)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${i === cursor ? 'bg-paper text-ink dark:bg-white/10 dark:text-paper' : 'text-ink-soft dark:text-paper/70'}`}
                  >
                    {Icon && <Icon size={16} />}
                    <span className="flex-1">{item.label}</span>
                    {i === cursor && <CornerDownLeft size={14} className="text-ink-soft" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PortalNavbar({ role = 'farmer', navItems = [], onNavigate, onToggleSidebar, onLogout }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const onDown = (e) => { if (!profileRef.current?.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [profileOpen]);

  const displayName = user?.fullName || user?.name || 'User';
  const hasSection = (id) => navItems.some((i) => i.id === id);
  const goTo = (id) => { setProfileOpen(false); onNavigate?.(id); };
  const isDark = theme === 'dark';

  return (
    <header className="portal-navbar sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-paper/85 px-4 backdrop-blur-xl md:px-6 dark:border-white/10 dark:bg-[#101d15]/85">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Open menu"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-ink hover:bg-ink/5 md:hidden dark:text-paper"
      >
        <Menu size={20} />
      </button>
      <span className="font-display text-lg font-semibold text-ink md:hidden dark:text-paper">AgroVerse</span>

      <SectionSearch navItems={navItems} onPick={(id) => onNavigate?.(id)} />

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => navigate('/')}
          title="Public home"
          aria-label="Public home"
          className="hidden h-11 w-11 items-center justify-center rounded-xl text-ink-soft hover:bg-ink/5 hover:text-ink md:flex dark:text-paper/70 dark:hover:bg-white/10"
        >
          <Home size={18} />
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9, rotate: -20 }}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          title={isDark ? 'Light mode' : 'Dark mode'}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-soft hover:bg-ink/5 hover:text-ink dark:text-paper/70 dark:hover:bg-white/10"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={theme} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        {role === 'buyer' && (
          <button
            type="button"
            onClick={() => navigate('/scan')}
            title="Scan a QR"
            aria-label="Scan a QR"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-ink-soft hover:bg-ink/5 hover:text-ink dark:text-paper/70 dark:hover:bg-white/10"
          >
            <ScanLine size={18} />
          </button>
        )}
        <div className="hidden sm:block"><LanguageSwitcher compact /></div>
        <NotificationBell />

        <div className="relative ml-1" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-ink/5 dark:hover:bg-white/10"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf text-xs font-bold text-white">{getInitials(displayName)}</span>
            <span className="hidden text-sm font-medium text-ink md:block dark:text-paper">{displayName.split(' ')[0]}</span>
            <ChevronDown size={14} className="hidden text-ink-soft md:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-white shadow-2xl dark:border-white/10 dark:bg-[#1b2a20]"
              >
                <div className="border-b border-line px-4 py-3 dark:border-white/10">
                  <p className="truncate text-sm font-semibold text-ink dark:text-paper">{displayName}</p>
                  <p className="truncate text-xs text-ink-soft">{user?.email}</p>
                  <span className="mt-2 inline-block rounded-full bg-leaf-light px-2 py-0.5 text-[10px] font-bold text-leaf">{ROLE_LABELS[role]}</span>
                </div>
                <div className="p-1.5">
                  {hasSection('profile') && (
                    <button type="button" role="menuitem" onClick={() => goTo('profile')} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-paper dark:text-paper dark:hover:bg-white/5">
                      <User size={15} /> My profile
                    </button>
                  )}
                  {hasSection('settings') && (
                    <button type="button" role="menuitem" onClick={() => goTo('settings')} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-paper dark:text-paper dark:hover:bg-white/5">
                      <Settings size={15} /> Settings
                    </button>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { onLogout?.(); navigate('/'); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
