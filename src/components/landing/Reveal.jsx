import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1];

/* Fades content up a few pixels the first time it scrolls into view.
   Kept deliberately small so it orients the reader without delaying the text. */
export default function Reveal({ as = 'div', delay = 0, y = 16, className, children, ...rest }) {
  const Component = motion[as];
  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function SectionLabel({ index, children, tone = 'dark' }) {
  return (
    <p className={`flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.22em] ${tone === 'dark' ? 'text-ink-soft' : 'text-white/60'}`}>
      <span className={`font-display text-[13px] normal-case tracking-normal ${tone === 'dark' ? 'text-saffron' : 'text-[#f0b968]'}`}>{index}</span>
      <span className={`h-px w-8 ${tone === 'dark' ? 'bg-line' : 'bg-white/25'}`} />
      {children}
    </p>
  );
}
