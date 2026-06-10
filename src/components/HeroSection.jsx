import { motion } from 'motion/react';
import { useTypewriter } from '../hooks/useTypewriter';

export default function HeroSection() {
  const { displayed, done } = useTypewriter(
    "Empowering Agriculture,\nConnecting Futures",
    38,
    600
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Typewriter Headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-primary leading-[1.08] mb-4 select-none whitespace-pre-wrap font-display">
          {displayed}
          {!done && (
            <span className="inline-block w-[3px] h-[1.1em] bg-primary align-middle ml-[2px] animate-blink rounded-full" />
          )}
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
      >
        <p className="text-base sm:text-lg md:text-xl text-accent-muted leading-relaxed font-normal mb-8 max-w-xl">
          Your gateway to modern farming — connecting{' '}
          <span className="text-accent font-medium">farmers</span>,{' '}
          <span className="text-accent font-medium">buyers</span>, and{' '}
          <span className="text-accent font-medium">transporters</span>{' '}
          on one unified platform.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="flex flex-wrap gap-8 mb-6"
      >
        {[
          { value: '10K+', label: 'Active Farmers' },
          { value: '500+', label: 'Buyers Connected' },
          { value: '98%', label: 'Satisfaction Rate' },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold text-primary font-display">
              {stat.value}
            </span>
            <span className="text-xs md:text-sm text-accent-muted tracking-wide uppercase">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
