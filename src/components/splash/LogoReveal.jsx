import { motion } from 'motion/react';
import { memo } from 'react';

const logoVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 18,
      delay: 6,
    },
  },
};

const textVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 160,
      damping: 20,
      delay: 6.25,
    },
  },
};

export default memo(function LogoReveal({ reduced }) {
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        pointerEvents: 'none',
      }}
      initial="hidden"
      animate="visible"
    >
      {/* Logo mark */}
      <motion.div
        variants={reduced ? {} : logoVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #2E7D32, #8BC34A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(46,125,50,0.45), 0 2px 8px rgba(0,0,0,0.2)',
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 36 36" width={36} height={36} aria-hidden="true">
            {/* Leaf */}
            <path
              d="M18 6 C18 6, 30 8, 30 20 C30 28 24 32 18 32 C12 32 6 28 6 20 C6 8 18 6 18 6Z"
              fill="white"
              fillOpacity={0.92}
            />
            {/* Stem */}
            <path
              d="M18 32 C18 32 14 26 13 22"
              stroke="#2E7D32"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
            {/* Vein */}
            <path
              d="M18 12 C18 12 18 24 18 30"
              stroke="#2E7D32"
              strokeWidth={1.5}
              strokeLinecap="round"
              fill="none"
              strokeOpacity={0.6}
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div style={{ lineHeight: 1 }}>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #fff 0%, #d4edda 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 2px 12px rgba(46,125,50,0.5))',
            }}
          >
            AgroVerse
          </div>
        </div>
      </motion.div>

      {/* Tagline sub-line under logo */}
      <motion.div
        variants={reduced ? {} : textVariants}
        initial="hidden"
        animate="visible"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: 13,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
        }}
      >
        Farm · Fresh · Direct
      </motion.div>
    </motion.div>
  );
});
