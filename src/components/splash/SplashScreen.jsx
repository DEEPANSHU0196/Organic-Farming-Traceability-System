import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { memo, useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Lazy-load heavy sub-components
const Sun         = lazy(() => import('./Sun'));
const Birds       = lazy(() => import('./Birds'));
const Grass       = lazy(() => import('./Grass'));
const Fog         = lazy(() => import('./Fog'));
const Tractor     = lazy(() => import('./Tractor'));
const LogoReveal  = lazy(() => import('./LogoReveal'));
const TypingTagline = lazy(() => import('./TypingTagline'));
const EnterButton = lazy(() => import('./EnterButton'));

// Animated cloud
const Cloud = memo(({ top, left, scale, delay, reduced }) => (
  <motion.div
    aria-hidden="true"
    style={{
      position: 'absolute',
      top,
      left,
      width: 180 * scale,
      height: 60 * scale,
      borderRadius: 100,
      background: 'rgba(255,255,255,0.55)',
      filter: 'blur(6px)',
      zIndex: 3,
    }}
    animate={reduced ? {} : { x: ['0%', '120vw'] }}
    initial={{ x: '-20%' }}
    transition={{
      duration: 70 + delay * 15,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '-40%',
        left: '20%',
        width: '55%',
        height: '110%',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.5)',
        filter: 'blur(4px)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: '-25%',
        left: '48%',
        width: '40%',
        height: '90%',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.45)',
        filter: 'blur(3px)',
      }}
    />
  </motion.div>
));
Cloud.displayName = 'Cloud';

// Mountain silhouette SVG
const Mountains = memo(() => (
  <svg
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
    style={{
      position: 'absolute',
      bottom: '18%',
      left: 0,
      width: '100%',
      height: '38%',
      zIndex: 2,
      pointerEvents: 'none',
    }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1B4332" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#0D2B1D" stopOpacity="1" />
      </linearGradient>
      <linearGradient id="mtGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1C3A2E" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#0F2218" stopOpacity="1" />
      </linearGradient>
    </defs>

    {/* Far mountains */}
    <path
      d="M0 320 L120 120 L240 200 L360 80 L480 160 L600 60 L720 140 L840 90 L960 170 L1080 70 L1200 150 L1320 100 L1440 180 L1440 320 Z"
      fill="url(#mtGrad2)"
      opacity={0.7}
    />
    {/* Near mountains */}
    <path
      d="M0 320 L160 160 L280 230 L420 100 L560 200 L680 90 L800 170 L940 110 L1080 180 L1200 120 L1320 190 L1440 140 L1440 320 Z"
      fill="url(#mtGrad)"
    />

    {/* Snow caps */}
    <path
      d="M680 90 L700 115 L660 115 Z"
      fill="rgba(255,255,255,0.35)"
    />
    <path
      d="M1080 70 L1100 98 L1060 98 Z"
      fill="rgba(255,255,255,0.3)"
    />
    <path
      d="M420 100 L444 132 L396 132 Z"
      fill="rgba(255,255,255,0.28)"
    />

    {/* Ground/field gradient */}
    <path
      d="M0 260 Q360 240 720 255 Q1080 270 1440 255 L1440 320 L0 320 Z"
      fill="#1C4A20"
    />
    <path
      d="M0 278 Q360 265 720 272 Q1080 280 1440 272 L1440 320 L0 320 Z"
      fill="#15381A"
    />
    <path
      d="M0 292 L1440 292 L1440 320 L0 320 Z"
      fill="#0F2914"
    />
  </svg>
));
Mountains.displayName = 'Mountains';

// Sky gradient background
const SkyBackground = memo(({ entering }) => (
  <motion.div
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background:
        'linear-gradient(180deg, #0a0f0a 0%, #0a0f0a 100%)',
    }}
    animate={
      entering
        ? {
            background: [
              'linear-gradient(180deg, #0a0f0a 0%, #0a0f0a 100%)',
              'linear-gradient(180deg, #1a2e3a 0%, #2c4a2a 60%, #1a3820 100%)',
              'linear-gradient(180deg, #87CEEB 0%, #b8dff0 30%, #d4ecd1 65%, #8BC34A 100%)',
            ],
          }
        : {}
    }
    transition={{ duration: 3.5, delay: 0.8, ease: 'easeInOut' }}
    aria-hidden="true"
  />
));
SkyBackground.displayName = 'SkyBackground';

export default function SplashScreen({ onComplete }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState('black'); // black → scene → overlay → exit
  const [exiting, setExiting]   = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef(null);

  // Parallax transforms from mouse
  const px = useTransform(mouseX, [0, 1], [-12, 12]);
  const py = useTransform(mouseY, [0, 1], [-8, 8]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current || reduced) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX / width);
      mouseY.set(e.clientY / height);
    },
    [mouseX, mouseY, reduced]
  );

  // Phase progression
  useEffect(() => {
    if (reduced) {
      setPhase('overlay');
      return;
    }
    const t1 = setTimeout(() => setPhase('scene'), 800);
    const t2 = setTimeout(() => setPhase('overlay'), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduced]);

  const handleEnter = useCallback(() => {
    setExiting(true);
    setTimeout(() => onComplete(), 900);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          ref={containerRef}
          key="splash"
          role="main"
          aria-label="AgroVerse splash screen"
          onMouseMove={handleMouseMove}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            overflow: 'hidden',
            cursor: 'default',
          }}
          exit={{
            scale: 1.08,
            opacity: 0,
            filter: 'brightness(2)',
          }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* === Sky === */}
          <SkyBackground entering={phase !== 'black'} />

          {/* === Parallax scene container === */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              x: px,
              y: py,
            }}
          >
            {/* Clouds */}
            {phase !== 'black' && (
              <Suspense fallback={null}>
                <Cloud top="8%"  left="-5%" scale={1.2} delay={0}   reduced={reduced} />
                <Cloud top="5%"  left="25%" scale={0.8} delay={8}   reduced={reduced} />
                <Cloud top="12%" left="60%" scale={1.0} delay={4}   reduced={reduced} />
                <Cloud top="6%"  left="75%" scale={0.7} delay={12}  reduced={reduced} />
              </Suspense>
            )}

            {/* Mountains */}
            <Mountains />

            {/* Sun */}
            {phase !== 'black' && (
              <Suspense fallback={null}>
                <Sun reduced={reduced} />
              </Suspense>
            )}

            {/* Fog & Pollen */}
            {phase !== 'black' && (
              <Suspense fallback={null}>
                <Fog reduced={reduced} />
              </Suspense>
            )}

            {/* Grass */}
            {phase !== 'black' && (
              <Suspense fallback={null}>
                <Grass reduced={reduced} />
              </Suspense>
            )}

            {/* Birds */}
            {phase !== 'black' && (
              <Suspense fallback={null}>
                <Birds reduced={reduced} />
              </Suspense>
            )}

            {/* Tractor */}
            {phase !== 'black' && (
              <Suspense fallback={null}>
                <Tractor reduced={reduced} />
              </Suspense>
            )}
          </motion.div>

          {/* === Dark overlay for logo phase === */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0)',
              zIndex: 15,
              pointerEvents: 'none',
            }}
            animate={
              phase === 'overlay'
                ? { background: 'rgba(0,10,0,0.52)' }
                : {}
            }
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Vignette */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />

          {/* === Logo & CTA overlay === */}
          {phase === 'overlay' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(16px, 3vh, 28px)',
                padding: '0 24px',
              }}
            >
              {/* Glassmorphism card */}
              <motion.div
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                transition={{ duration: 0.8, delay: 6 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'clamp(14px, 2.5vh, 24px)',
                  padding: 'clamp(28px, 5vh, 52px) clamp(24px, 6vw, 64px)',
                  borderRadius: 28,
                  background: 'rgba(10,20,12,0.35)',
                  border: '1px solid rgba(139,195,74,0.18)',
                  boxShadow:
                    '0 8px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                  maxWidth: 560,
                  width: '100%',
                }}
              >
                <Suspense fallback={null}>
                  <LogoReveal reduced={reduced} />
                </Suspense>

                <Suspense fallback={null}>
                  <TypingTagline reduced={reduced} />
                </Suspense>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 7.4, duration: 0.6 }}
                  style={{
                    width: '60%',
                    height: 1,
                    background:
                      'linear-gradient(90deg, transparent, rgba(139,195,74,0.4), transparent)',
                    transformOrigin: 'center',
                  }}
                  aria-hidden="true"
                />

                <Suspense fallback={null}>
                  <EnterButton onEnter={handleEnter} reduced={reduced} />
                </Suspense>
              </motion.div>

              {/* Skip hint */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                transition={{ delay: 8.5, duration: 0.5 }}
                onClick={handleEnter}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                }}
                whileHover={{ opacity: 0.85 }}
                aria-label="Skip intro and enter the site"
              >
                skip intro
              </motion.button>
            </div>
          )}

          {/* Black fade-in cover (first 0.8s) */}
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000',
              zIndex: 30,
              pointerEvents: 'none',
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.85, delay: 0.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
