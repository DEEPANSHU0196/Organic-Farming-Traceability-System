import { motion } from 'motion/react';
import { memo } from 'react';

const RAY_COUNT = 12;

const SunRay = memo(({ index, reduced }) => {
  const angle = (index / RAY_COUNT) * 360;
  return (
    <motion.line
      x1="0" y1="-52" x2="0" y2="-78"
      stroke="#FFD54F"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ rotate: angle, originX: '0px', originY: '0px' }}
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: [0, 0.9, 0.6, 0.9], scaleY: [0, 1, 0.85, 1] }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              duration: 3,
              delay: 2 + index * 0.05,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }
      }
    />
  );
});
SunRay.displayName = 'SunRay';

export default memo(function Sun({ reduced }) {
  return (
    <motion.div
      className="absolute"
      style={{
        bottom: '28%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 6,
        pointerEvents: 'none',
      }}
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 4, delay: 2, ease: [0.25, 0.46, 0.45, 0.94] }
      }
    >
      {/* Bloom outer glow */}
      <div
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,213,79,0.22) 0%, rgba(255,183,3,0.08) 55%, transparent 80%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      {/* Secondary bloom */}
      <div
        style={{
          position: 'absolute',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255,240,150,0.35) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="-90 -90 180 180"
        width={140}
        height={140}
        overflow="visible"
        aria-hidden="true"
      >
        {/* Lens flare streak */}
        <motion.ellipse
          cx={-40}
          cy={30}
          rx={18}
          ry={4}
          fill="rgba(255,255,220,0.12)"
          animate={{ opacity: [0, 0.18, 0] }}
          transition={
            reduced ? {} : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }
        />

        {/* Sun rays */}
        <g>
          {Array.from({ length: RAY_COUNT }, (_, i) => (
            <SunRay key={i} index={i} reduced={reduced} />
          ))}
        </g>

        {/* Sun body outer glow */}
        <motion.circle
          cx={0}
          cy={0}
          r={52}
          fill="rgba(255,213,79,0.15)"
          animate={{ r: [52, 58, 52] }}
          transition={
            reduced
              ? {}
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }
        />

        {/* Sun body */}
        <motion.circle
          cx={0}
          cy={0}
          r={40}
          fill="url(#sunGrad)"
          animate={{ r: [40, 42, 40] }}
          transition={
            reduced
              ? {}
              : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }
        />

        {/* Inner highlight */}
        <ellipse
          cx={-10}
          cy={-14}
          rx={14}
          ry={10}
          fill="rgba(255,255,255,0.18)"
        />

        <defs>
          <radialGradient id="sunGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="40%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF8F00" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
});
