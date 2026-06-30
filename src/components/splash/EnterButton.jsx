import { motion, useAnimationControls, AnimatePresence } from 'motion/react';
import { memo, useCallback, useEffect, useState, useRef } from 'react';

export default memo(function EnterButton({ onEnter, reduced }) {
  const [ripples, setRipples] = useState([]);
  const rippleId = useRef(0);

  const handleClick = useCallback(
    (e) => {
      // Ripple effect
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++rippleId.current;
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);

      // Trigger enter after brief delay
      setTimeout(() => onEnter(), 400);
    },
    [onEnter]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEnter();
      }
    },
    [onEnter]
  );

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { delay: 7.5, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
      }
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Enter AgroVerse — connect farmers to consumers"
      tabIndex={0}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '16px 52px',
        borderRadius: 100,
        border: '1.5px solid rgba(139,195,74,0.6)',
        background: 'linear-gradient(135deg, #2E7D32 0%, #388E3C 50%, #43A047 100%)',
        color: '#fff',
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 600,
        fontSize: 'clamp(15px, 1.6vw, 18px)',
        letterSpacing: '0.06em',
        cursor: 'pointer',
        outline: 'none',
        boxShadow:
          '0 0 0 0 rgba(139,195,74,0.4), 0 8px 32px rgba(46,125,50,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      whileHover={{
        scale: 1.06,
        boxShadow:
          '0 0 32px rgba(139,195,74,0.55), 0 12px 40px rgba(46,125,50,0.6), 0 4px 16px rgba(0,0,0,0.35)',
      }}
      whileTap={{ scale: 0.97 }}
      whileFocus={{
        boxShadow:
          '0 0 0 3px rgba(139,195,74,0.6), 0 8px 32px rgba(46,125,50,0.5)',
      }}
    >
      {/* Pulse ring */}
      <motion.span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 100,
          border: '2px solid rgba(139,195,74,0.5)',
          pointerEvents: 'none',
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Shimmer sweep */}
      <motion.span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '60%',
          height: '100%',
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          pointerEvents: 'none',
          borderRadius: 100,
        }}
        animate={{ left: ['-60%', '160%'] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1, ease: 'linear' }}
      />

      {/* Ripples */}
      <AnimatePresence>
        {ripples.map(({ id, x, y }) => (
          <motion.span
            key={id}
            aria-hidden="true"
            initial={{ width: 0, height: 0, opacity: 0.5, x, y }}
            animate={{ width: 300, height: 300, opacity: 0, x: x - 150, y: y - 150 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>

      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
        Enter AgroVerse
        <motion.svg
          viewBox="0 0 20 20"
          width={18}
          height={18}
          fill="none"
          aria-hidden="true"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M4 10h12M11 5l5 5-5 5"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </span>
    </motion.button>
  );
});
