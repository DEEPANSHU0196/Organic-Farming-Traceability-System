import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SEEN_KEY = 'agroverse-intro-seen';
const EASE = [0.22, 1, 0.36, 1];
const WORDS = ['Seed.', 'Soil.', 'Story.'];

// Scene timings (seconds). Total runtime ≈ 3.6s.
const T = { sprout: 0, words: 1.0, qr: 2.0, brand: 2.45, exit: 3.6 };

// A small fixed QR-like pattern (7×7): reads as "QR" at a glance without being a real code.
const QR_PATTERN = [
  '1111101',
  '1000101',
  '1011101',
  '0010010',
  '1101011',
  '1000110',
  '1110101',
];

export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return false;
  }
}

/* A short, skippable opening sequence shown once per visit on the landing page. */
export default function IntroSequence({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable: intro may replay */ }
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => setVisible(false), T.exit * 1000);
    const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setVisible(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink text-paper"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
          aria-label="AgroVerse intro"
          role="presentation"
        >
          {/* Soft light that slowly rises, like morning over a field */}
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.22) 0%, transparent 60%)' }}
            initial={{ opacity: 0, scale: 0.6, y: '10%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            transition={{ duration: 3.2, ease: 'easeOut' }}
          />

          {/* Scene 1: seed drops, sprout grows */}
          <motion.svg
            viewBox="0 0 120 160"
            className="absolute h-40 w-32"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0], y: [0, 0, -30] }}
            transition={{ duration: T.words + 0.2, times: [0, 0.8, 1], ease: 'easeIn' }}
            aria-hidden="true"
          >
            <motion.line x1="10" y1="132" x2="110" y2="132" stroke="#8B6F47" strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, ease: EASE }} />
            <motion.ellipse cx="60" cy="128" rx="5" ry="3.5" fill="#E9C46A"
              initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35, delay: 0.1, ease: 'easeIn' }} />
            <motion.path d="M60 128 C60 105 60 92 60 70" stroke="#52B788" strokeWidth="3" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.42, ease: EASE }} />
            <motion.path d="M60 92 C46 90 38 80 36 66 C50 68 58 77 60 92 Z" fill="#52B788"
              style={{ originX: '60px', originY: '92px' }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.35, delay: 0.7, type: 'spring', stiffness: 260, damping: 14 }} />
            <motion.path d="M60 80 C74 78 84 68 86 54 C72 56 62 65 60 80 Z" fill="#95D5B2"
              style={{ originX: '60px', originY: '80px' }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.35, delay: 0.8, type: 'spring', stiffness: 260, damping: 14 }} />
          </motion.svg>

          {/* Scene 2: quick word cuts */}
          {WORDS.map((word, i) => {
            const start = T.words + i * 0.3;
            return (
              <motion.p
                key={word}
                className={`absolute font-display text-[clamp(3rem,10vw,7rem)] font-medium tracking-tight ${i === 2 ? 'italic text-[#a8d5ba]' : ''}`}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -20], filter: ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'] }}
                transition={{ duration: 0.42, delay: start, times: [0, 0.35, 0.75, 1] }}
              >
                {word}
              </motion.p>
            );
          })}

          {/* Scene 3: QR assembles, brand reveals */}
          <div className="relative flex flex-col items-center">
            <motion.div
              className="grid grid-cols-7 gap-[3px] rounded-xl bg-paper p-2.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: T.qr, duration: 0.3, ease: EASE }}
            >
              {QR_PATTERN.join('').split('').map((cell, i) => (
                <motion.span
                  key={i}
                  className={`h-3 w-3 rounded-[2px] sm:h-3.5 sm:w-3.5 ${cell === '1' ? 'bg-ink' : 'bg-transparent'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: T.qr + 0.05 + ((i * 37) % 49) * 0.006, duration: 0.18 }}
                />
              ))}
            </motion.div>
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-saffron shadow-[0_0_14px_rgba(217,138,43,0.9)]"
              initial={{ top: '0%', opacity: 0 }}
              animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
              transition={{ delay: T.qr + 0.3, duration: 0.5, ease: 'easeInOut' }}
            />
            <div className="mt-7 overflow-hidden">
              <motion.p
                className="font-display text-4xl font-medium tracking-tight sm:text-5xl"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: T.brand, duration: 0.7, ease: EASE }}
              >
                AgroVerse
              </motion.p>
            </div>
            <motion.p
              className="mt-3 text-[11px] uppercase tracking-[0.35em] text-paper/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: T.brand + 0.35, duration: 0.5 }}
            >
              Every harvest has a story
            </motion.p>
          </div>

          {/* Progress + skip */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-leaf to-saffron"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: T.exit, ease: 'linear' }}
          />
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute bottom-6 right-6 rounded-full border border-paper/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-paper/70 transition-colors hover:border-paper/60 hover:text-paper"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
