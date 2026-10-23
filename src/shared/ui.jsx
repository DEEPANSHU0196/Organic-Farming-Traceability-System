import { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView } from 'motion/react';
import { CheckCircle2, CircleDashed, Clock3, Leaf, TriangleAlert } from 'lucide-react';

export function BrandMark({ size = 36, dark = false }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }} aria-label="AgroVerse mark">
      <svg viewBox="0 0 40 40" role="img">
        <defs><linearGradient id="brand-leaf-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#52b788" /><stop offset="1" stopColor="#e9c46a" /></linearGradient></defs>
        <path className="brand-root" d="M20 35V20c0-6 4-10 11-12-1 7-4 12-11 12" fill="none" stroke={dark ? '#e9c46a' : '#1b4332'} strokeWidth="2.2" strokeLinecap="round" />
        <path className="brand-leaf" d="M20 22C10 21 7 14 9 7c8 0 13 5 11 15Z" fill="url(#brand-leaf-gradient)" />
        <path d="M11 10c4 1 7 4 9 9" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="1.2" strokeLinecap="round" />
        <circle className="brand-pulse" cx="20" cy="35" r="2" fill="#e9c46a" />
      </svg>
    </span>
  );
}

const STATUS_CONFIG = {
  verified: { label: 'Verified', icon: CheckCircle2, className: 'status-badge status-verified' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'status-badge status-verified' },
  delivered: { label: 'Delivered', icon: CheckCircle2, className: 'status-badge status-verified' },
  pending: { label: 'Pending', icon: Clock3, className: 'status-badge status-pending' },
  'in transit': { label: 'In Transit', icon: CircleDashed, className: 'status-badge status-progress' },
  flagged: { label: 'Flagged', icon: TriangleAlert, className: 'status-badge status-flagged' },
};

export function StatusBadge({ status = 'Pending' }) {
  const config = STATUS_CONFIG[String(status).toLowerCase()] || { label: status, icon: CircleDashed, className: 'status-badge status-neutral' };
  const Icon = config.icon;
  return <span className={config.className}><Icon size={13} />{config.label}</span>;
}

export function LeafLoader({ label = 'Growing your view...' }) {
  return <div className="leaf-loader" role="status"><motion.span animate={{ rotate: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 1.4 }}><Leaf size={24} /></motion.span><span>{label}</span></div>;
}

export function PortalCard({ children, className = '', ...props }) {
  return <motion.section whileHover={{ y: -2 }} transition={{ duration: 0.18 }} className={`portal-card ${className}`} {...props}>{children}</motion.section>;
}

/* Counts a stat up from zero the first time it is on screen. Accepts plain
   numbers or formatted strings ("₹24,500", "1.2L", "98%") and keeps the
   surrounding text and number formatting. */
export function AnimatedNumber({ value, duration = 1.2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const text = String(value ?? '');
  const match = text.match(/-?[\d,]*\.?\d+/);
  const target = match ? Number(match[0].replace(/,/g, '')) : NaN;
  const decimals = match && match[0].includes('.') ? match[0].split('.')[1].length : 0;
  const grouped = Boolean(match && match[0].includes(','));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView || !Number.isFinite(target)) return undefined;
    const controls = animate(0, target, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setCurrent });
    return () => controls.stop();
  }, [inView, target, duration]);

  if (!match || !Number.isFinite(target)) return <span ref={ref}>{text}</span>;
  const formatted = grouped
    ? current.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : current.toFixed(decimals);
  return (
    <span ref={ref} className="tabular-nums">
      {text.slice(0, match.index)}{formatted}{text.slice(match.index + match[0].length)}
    </span>
  );
}

export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}

/* Placeholder grid shaped like product/delivery cards while data loads. */
export function SkeletonCards({ count = 6, label = 'Loading…' }) {
  return (
    <div role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-[#e3ebe4] bg-white">
            <Skeleton className="h-36 rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2 pt-2"><Skeleton className="h-8 flex-1" /><Skeleton className="h-8 w-20" /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Placeholder rows for tables and lists. */
export function SkeletonRows({ rows = 5, label = 'Loading…' }) {
  return (
    <div role="status" aria-label={label} className="divide-y divide-[#eef3ee]">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2"><Skeleton className="h-3.5 w-1/3" /><Skeleton className="h-3 w-1/2" /></div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
