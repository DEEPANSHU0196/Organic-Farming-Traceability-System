import { motion } from 'motion/react';
import { memo, useMemo } from 'react';

const BIRD_CONFIGS = [
  { delay: 3.0, y: '22%', scale: 1.1, duration: 6.5, amplitude: -18 },
  { delay: 3.4, y: '18%', scale: 0.85, duration: 8.2, amplitude: 14 },
  { delay: 3.8, y: '26%', scale: 0.95, duration: 7.1, amplitude: -10 },
  { delay: 4.1, y: '15%', scale: 0.75, duration: 9.0, amplitude: 20 },
  { delay: 4.6, y: '30%', scale: 1.0,  duration: 7.8, amplitude: -8 },
  { delay: 3.2, y: '20%', scale: 0.8,  duration: 10.1, amplitude: 12 },
  { delay: 4.9, y: '12%', scale: 0.7,  duration: 8.6, amplitude: -15 },
];

// Realistic bird silhouette SVG (M-shape wing flap)
const BirdSVG = memo(({ scale = 1 }) => (
  <svg
    viewBox="0 0 40 20"
    width={40 * scale}
    height={20 * scale}
    fill="none"
    aria-hidden="true"
    style={{ overflow: 'visible' }}
  >
    {/* Left wing */}
    <motion.path
      d="M20 10 Q10 2 2 6"
      stroke="#1C2E1E"
      strokeWidth={1.4}
      strokeLinecap="round"
      fill="none"
      animate={{ d: ['M20 10 Q10 2 2 6', 'M20 10 Q10 14 2 12', 'M20 10 Q10 2 2 6'] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Right wing */}
    <motion.path
      d="M20 10 Q30 2 38 6"
      stroke="#1C2E1E"
      strokeWidth={1.4}
      strokeLinecap="round"
      fill="none"
      animate={{ d: ['M20 10 Q30 2 38 6', 'M20 10 Q30 14 38 12', 'M20 10 Q30 2 38 6'] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Body */}
    <circle cx={20} cy={10} r={1.8} fill="#1C2E1E" />
  </svg>
));
BirdSVG.displayName = 'BirdSVG';

const Bird = memo(({ config, reduced }) => {
  const { delay, y, scale, duration, amplitude } = config;
  const yNum = parseFloat(y);

  const yKeyframes = useMemo(
    () => [
      `${yNum}%`,
      `${yNum + amplitude * 0.5}%`,
      `${yNum + amplitude}%`,
      `${yNum + amplitude * 0.3}%`,
      `${yNum}%`,
    ],
    [yNum, amplitude]
  );

  return (
    <motion.div
      aria-hidden="true"
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 8 }}
      initial={{ x: '-60px', y, opacity: 0 }}
      animate={
        reduced
          ? {}
          : {
              x: ['calc(-60px)', 'calc(110vw)'],
              y: yKeyframes,
              opacity: [0, 1, 1, 1, 0],
            }
      }
      transition={{
        duration,
        delay,
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: Math.random() * 6 + 4,
        times: [0, 0.08, 0.5, 0.92, 1],
      }}
    >
      <BirdSVG scale={scale} />
    </motion.div>
  );
});
Bird.displayName = 'Bird';

export default memo(function Birds({ reduced }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 8,
      }}
      aria-label="Birds flying across the sky"
      role="img"
    >
      {BIRD_CONFIGS.map((cfg, i) => (
        <Bird key={i} config={cfg} reduced={reduced} />
      ))}
    </div>
  );
});
