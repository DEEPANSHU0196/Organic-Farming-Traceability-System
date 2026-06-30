import { motion } from 'motion/react';
import { memo } from 'react';

export default memo(function Fog({ reduced }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Ground mist layer 1 */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '-10%',
          width: '120%',
          height: '22%',
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(220,235,255,0.55) 0%, rgba(200,220,240,0.25) 55%, transparent 100%)',
          borderRadius: '50%',
          filter: 'blur(18px)',
        }}
        animate={
          reduced
            ? {}
            : {
                x: ['-3%', '3%', '-3%'],
                opacity: [0.7, 0.9, 0.7],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ground mist layer 2 — offset timing */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-5%',
          width: '110%',
          height: '18%',
          background:
            'radial-gradient(ellipse 90% 50% at 40% 100%, rgba(230,242,255,0.45) 0%, transparent 80%)',
          borderRadius: '50%',
          filter: 'blur(24px)',
        }}
        animate={
          reduced
            ? {}
            : {
                x: ['2%', '-4%', '2%'],
                opacity: [0.5, 0.75, 0.5],
              }
        }
        transition={{
          duration: 14,
          delay: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Atmospheric haze */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, transparent 35%, rgba(210,230,255,0.12) 65%, rgba(200,220,245,0.28) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Morning glow overlay */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '55%',
          background:
            'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(255,220,100,0.10) 0%, transparent 75%)',
          pointerEvents: 'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 3, delay: 2.5 }}
      />

      {/* Floating pollen particles */}
      {Array.from({ length: 18 }, (_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: 3 + Math.random() * 3,
            height: 3 + Math.random() * 3,
            borderRadius: '50%',
            background: `rgba(255, ${190 + Math.floor(Math.random() * 60)}, 50, ${0.35 + Math.random() * 0.35})`,
            left: `${5 + Math.random() * 90}%`,
            top: `${40 + Math.random() * 55}%`,
            filter: 'blur(0.5px)',
          }}
          animate={
            reduced
              ? {}
              : {
                  y: [0, -(30 + Math.random() * 50), 0],
                  x: [0, (Math.random() - 0.5) * 40, 0],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2, 0.5],
                }
          }
          transition={{
            duration: 5 + Math.random() * 6,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
});
