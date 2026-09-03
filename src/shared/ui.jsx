import { motion } from 'motion/react';
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
