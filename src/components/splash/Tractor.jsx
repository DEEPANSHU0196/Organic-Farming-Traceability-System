import { motion, useAnimationControls } from 'motion/react';
import { memo, useEffect, useMemo } from 'react';

// Individual dust particle
const DustParticle = memo(({ x, size, delay, reduced }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: size,
      height: size * 0.55,
      borderRadius: '50%',
      background: 'rgba(180,140,80,0.55)',
      bottom: `${10 + Math.random() * 12}px`,
      right: x,
      filter: 'blur(1.5px)',
    }}
    animate={
      reduced
        ? {}
        : {
            x: [0, -(20 + Math.random() * 30)],
            y: [0, -(8 + Math.random() * 18)],
            opacity: [0.7, 0],
            scale: [1, 2.5],
          }
    }
    transition={{
      duration: 1.2 + Math.random() * 0.8,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
    aria-hidden="true"
  />
));
DustParticle.displayName = 'DustParticle';

// Realistic SVG tractor
const TractorSVG = memo(({ wheelRotation }) => (
  <svg
    viewBox="0 0 200 130"
    width={200}
    height={130}
    aria-label="Tractor"
    role="img"
    overflow="visible"
  >
    {/* Exhaust smoke */}
    <motion.circle
      cx={148}
      cy={18}
      r={4}
      fill="rgba(120,120,100,0.45)"
      animate={{ cy: [18, -2], r: [4, 9], opacity: [0.6, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0 }}
    />
    <motion.circle
      cx={145}
      cy={22}
      r={3}
      fill="rgba(140,130,110,0.35)"
      animate={{ cy: [22, 4], r: [3, 7], opacity: [0.5, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
    />

    {/* Exhaust pipe */}
    <rect x={142} y={22} width={8} height={26} rx={3} fill="#555" />
    <rect x={140} y={20} width={12} height={5} rx={2} fill="#444" />

    {/* Cab body */}
    <rect x={90} y={28} width={66} height={58} rx={6} fill="#2E7D32" />

    {/* Cab roof */}
    <rect x={86} y={18} width={70} height={16} rx={5} fill="#1B5E20" />

    {/* Cab window */}
    <rect x={96} y={32} width={38} height={28} rx={3} fill="rgba(135,206,235,0.6)" stroke="#1B5E20" strokeWidth={1.5} />
    {/* Window reflection */}
    <line x1={100} y1={34} x2={106} y2={56} stroke="rgba(255,255,255,0.35)" strokeWidth={1} />

    {/* Hood */}
    <path d="M54 50 L90 50 L90 72 L54 72 Z" fill="#2E7D32" />
    <path d="M46 54 L54 50 L54 72 L46 68 Z" fill="#1B5E20" />

    {/* Hood grille */}
    {[58, 66, 74, 82].map((x) => (
      <line key={x} x1={x} y1={53} x2={x} y2={70} stroke="#1B5E20" strokeWidth={1.5} />
    ))}
    <rect x={54} y={53} width={36} height={17} rx={2} fill="none" stroke="#1B5E20" strokeWidth={1} />

    {/* Front light */}
    <ellipse cx={46} cy={58} rx={4} ry={5} fill="#FFF176" />
    <ellipse cx={46} cy={58} rx={2} ry={3} fill="#FFEE58" />

    {/* Body base / chassis */}
    <rect x={30} y={72} width={130} height={22} rx={4} fill="#1B5E20" />

    {/* Rear large wheel */}
    <motion.g
      style={{ transformOrigin: '145px 94px' }}
      animate={{ rotate: wheelRotation }}
    >
      <circle cx={145} cy={94} r={32} fill="#222" stroke="#333" strokeWidth={2} />
      <circle cx={145} cy={94} r={26} fill="#2a2a2a" />
      <circle cx={145} cy={94} r={10} fill="#444" />
      {/* Spokes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={145}
            y1={94}
            x2={145 + Math.cos(rad) * 23}
            y2={94 + Math.sin(rad) * 23}
            stroke="#555"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Tread marks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const r1 = 26, r2 = 31;
        return (
          <line
            key={`t${deg}`}
            x1={145 + Math.cos(rad) * r1}
            y1={94 + Math.sin(rad) * r1}
            x2={145 + Math.cos(rad) * r2}
            y2={94 + Math.sin(rad) * r2}
            stroke="#333"
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}
    </motion.g>

    {/* Front small wheel */}
    <motion.g
      style={{ transformOrigin: '62px 100px' }}
      animate={{ rotate: wheelRotation * 1.6 }}
    >
      <circle cx={62} cy={100} r={20} fill="#222" stroke="#333" strokeWidth={2} />
      <circle cx={62} cy={100} r={14} fill="#2a2a2a" />
      <circle cx={62} cy={100} r={6} fill="#444" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={62}
            y1={100}
            x2={62 + Math.cos(rad) * 12}
            y2={100 + Math.sin(rad) * 12}
            stroke="#555"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={`t${deg}`}
            x1={62 + Math.cos(rad) * 14}
            y1={100 + Math.sin(rad) * 14}
            x2={62 + Math.cos(rad) * 19}
            y2={100 + Math.sin(rad) * 19}
            stroke="#333"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}
    </motion.g>

    {/* Step / footrest */}
    <rect x={82} y={82} width={14} height={6} rx={2} fill="#3a3a3a" />

    {/* Mirror */}
    <rect x={152} y={26} width={8} height={5} rx={2} fill="#444" />
    <rect x={155} y={20} width={2} height={8} rx={1} fill="#555" />
  </svg>
));
TractorSVG.displayName = 'TractorSVG';

// Dust trail
const DustTrail = memo(({ reduced }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: i * 14,
        size: 10 + Math.random() * 16,
        delay: i * 0.06,
      })),
    []
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 8,
        right: -10,
        width: 200,
        height: 50,
        pointerEvents: 'none',
      }}
    >
      {particles.map((p, i) => (
        <DustParticle key={i} x={p.x} size={p.size} delay={p.delay} reduced={reduced} />
      ))}
    </div>
  );
});
DustTrail.displayName = 'DustTrail';

export default memo(function Tractor({ reduced }) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (reduced) return;
    controls.start({
      x: ['calc(-220px)', 'calc(42vw)', 'calc(42vw)'],
      y: [0, -4, 0, -3, 0, -4, 0, -3, 0, -2, 0],
      transition: {
        x: {
          duration: 4.5,
          delay: 4,
          ease: [0.25, 0.1, 0.25, 1],
          times: [0, 0.75, 1],
        },
        y: {
          duration: 0.5,
          delay: 4,
          repeat: 7,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
      },
    });
  }, [controls, reduced]);

  return (
    <motion.div
      aria-label="Tractor moving across field"
      role="img"
      style={{
        position: 'absolute',
        bottom: '9.5%',
        left: 0,
        zIndex: 7,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      initial={{ x: 'calc(-220px)', opacity: 1 }}
      animate={controls}
    >
      <div style={{ position: 'relative' }}>
        <TractorSVG
          wheelRotation={reduced ? 0 : 360}
        />
        <DustTrail reduced={reduced} />
      </div>
    </motion.div>
  );
});
