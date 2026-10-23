import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Bell, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const TONES = {
  success: { icon: CheckCircle2, className: 'text-leaf' },
  error: { icon: AlertTriangle, className: 'text-red-500' },
  info: { icon: Info, className: 'text-sky-600' },
  notify: { icon: Bell, className: 'text-saffron' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback((message, { tone = 'success', title, duration = 3800 } = {}) => {
    idRef.current += 1;
    const id = idRef.current;
    setToasts((list) => [...list.slice(-3), { id, message, tone, title }]);
    window.setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 md:bottom-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const { icon: Icon, className } = TONES[t.tone] || TONES.info;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.18 } }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_16px_40px_rgba(19,38,27,0.18)] dark:border-white/10 dark:bg-[#1b2a20]"
                role="status"
              >
                <Icon size={18} className={`mt-0.5 shrink-0 ${className}`} />
                <div className="min-w-0 flex-1">
                  {t.title && <p className="text-sm font-semibold text-ink dark:text-paper">{t.title}</p>}
                  <p className="text-sm text-ink-soft dark:text-paper/70">{t.message}</p>
                </div>
                <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="rounded p-0.5 text-ink-soft hover:text-ink">
                  <X size={15} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  // Outside the provider (e.g. isolated tests) toasts become no-ops.
  return ctx || (() => {});
}
