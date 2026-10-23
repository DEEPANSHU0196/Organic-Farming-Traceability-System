import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

/* Friendly empty screen: an icon on a soft ring, one line of guidance, one clear next step. */
export default function EmptyState({ icon: Icon, title, body, actionLabel, onAction, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex flex-col items-center text-center ${compact ? 'px-6 py-10' : 'px-6 py-16'}`}
    >
      <div className="relative">
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-leaf-light"
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0.25, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-leaf-light text-leaf">
          {Icon && <Icon size={28} strokeWidth={1.7} />}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">{body}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-leaf"
        >
          {actionLabel}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </motion.div>
  );
}
