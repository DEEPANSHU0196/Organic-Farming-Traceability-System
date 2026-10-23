import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

const PIECES = 22;
const COLORS = ['#2F6B45', '#52B788', '#95D5B2', '#D98A2B', '#E9C46A'];

/* A short burst of leaves around a check mark, for moments worth marking
   (a batch listed, an order placed). Sits over everything, never blocks clicks. */
export default function Celebration({ show, title, subtitle }) {
  const pieces = useMemo(
    () => Array.from({ length: PIECES }, (_, i) => {
      const angle = (i / PIECES) * Math.PI * 2 + (i % 3) * 0.2;
      const distance = 120 + ((i * 37) % 90);
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40,
        rotate: ((i * 71) % 360) - 180,
        color: COLORS[i % COLORS.length],
        leaf: i % 3 !== 0,
        size: 10 + ((i * 7) % 10),
      };
    }),
    [],
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          role="status"
          aria-live="polite"
        >
          <div className="relative flex flex-col items-center">
            {pieces.map((p, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="absolute left-1/2 top-10"
                initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
                animate={{ x: p.x, y: [0, p.y, p.y + 60], scale: [0, 1, 0.9], rotate: p.rotate, opacity: [1, 1, 0] }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], times: [0, 0.45, 1] }}
              >
                {p.leaf ? (
                  <svg width={p.size} height={p.size} viewBox="0 0 24 24"><path d="M12 2C6 6 4 12 6 18c2 3 6 4 9 2 4-3 5-9 3-14-1-2-3-3-6-4z" fill={p.color} /></svg>
                ) : (
                  <span className="block rounded-full" style={{ width: p.size / 2, height: p.size / 2, background: p.color }} />
                )}
              </motion.span>
            ))}
            <motion.span
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: [0, 1.15, 1], rotate: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-leaf text-white shadow-[0_20px_50px_rgba(47,107,69,0.45)]"
            >
              <Check size={38} strokeWidth={3} />
            </motion.span>
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-5 rounded-2xl bg-white/95 px-5 py-3 text-center shadow-xl backdrop-blur dark:bg-[#1b2a20]/95"
              >
                <p className="font-display text-xl font-medium text-ink dark:text-paper">{title}</p>
                {subtitle && <p className="text-sm text-ink-soft dark:text-paper/70">{subtitle}</p>}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
