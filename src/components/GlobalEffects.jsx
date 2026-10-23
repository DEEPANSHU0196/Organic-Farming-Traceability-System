import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

/* Thin gradient bar at the top that fills as you scroll. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-300 shadow-[0_0_12px_rgba(132,204,22,0.6)]"
    />
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-xl ring-4 ring-white/60"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function GlobalEffects() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  // New route always starts from the top.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <ScrollProgress />
      {isHome && <BackToTop />}
      {/* The landing navbar has its own switcher; everywhere else gets a floating one. */}
      {!isHome && (
        <div className="fixed bottom-5 left-5 z-50">
          <LanguageSwitcher placement="up" />
        </div>
      )}
    </>
  );
}
