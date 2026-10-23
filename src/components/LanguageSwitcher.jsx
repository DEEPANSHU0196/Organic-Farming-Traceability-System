import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Globe2, Search } from 'lucide-react';
import { LANGUAGES } from '../i18n/languages';
import { useLanguage } from '../contexts/LanguageContext';

// `variant="light"` for dark/transparent backgrounds (hero), "dark" for white bars.
export default function LanguageSwitcher({ variant = 'dark', compact = false, placement = 'down' }) {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter((l) => l.english.toLowerCase().includes(q) || l.native.includes(query.trim()));
  }, [query]);

  const triggerTone = variant === 'light'
    ? 'bg-white/10 text-white border-white/25 hover:bg-white/20'
    : 'bg-white text-primary border-primary/10 hover:border-primary/30 shadow-sm';

  return (
    <div ref={rootRef} className="relative notranslate" translate="no">
      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[13px] font-semibold backdrop-blur-md transition-colors ${triggerTone}`}
      >
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          <Globe2 size={16} />
        </motion.span>
        {!compact && <span>{language.native}</span>}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: placement === 'up' ? 10 : -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'up' ? 10 : -10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute z-[70] w-72 overflow-hidden rounded-2xl border border-primary/10 bg-white/95 shadow-2xl backdrop-blur-xl ${
              placement === 'up' ? 'bottom-full mb-3 left-0' : 'top-full mt-3 right-0'
            }`}
          >
            <div className="border-b border-primary/5 bg-gradient-to-r from-emerald-50 to-lime-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">भाषा · Language</p>
              <p className="mt-0.5 text-[11px] text-emerald-700/70">{LANGUAGES.length} Indian languages</p>
              <label className="mt-2.5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2">
                <Search size={14} className="text-emerald-600" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search language…"
                  className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-primary/35"
                />
              </label>
            </div>
            <ul role="listbox" className="max-h-80 overflow-y-auto p-2">
              {filtered.map((lang, i) => {
                const active = lang.code === language.code;
                return (
                  <motion.li
                    key={lang.code}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.015, 0.25) }}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => { setOpen(false); setQuery(''); if (!active) changeLanguage(lang.code); }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                        active ? 'bg-emerald-600 text-white' : 'text-primary hover:bg-emerald-50'
                      }`}
                    >
                      <span>
                        <span className="block text-[15px] font-semibold leading-tight">{lang.native}</span>
                        <span className={`block text-[11px] ${active ? 'text-white/75' : 'text-primary/45'}`}>{lang.english}</span>
                      </span>
                      {active && <Check size={16} />}
                    </button>
                  </motion.li>
                );
              })}
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-primary/50">No match</li>}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
