import { motion } from 'motion/react';
import { Leaf, Mail, MapPin, QrCode, ShieldCheck, Truck } from 'lucide-react';
import { BrandMark } from '../shared/ui';
import LanguageSwitcher from './LanguageSwitcher';

const COLUMNS = [
  { title: 'Platform', links: [['Features', 'features'], ['Workflow', 'workflow'], ['About Us', 'about'], ['Contact', 'contact']] },
  { title: 'Portals', links: [['Farmer Portal', 'features'], ['Buyer Portal', 'features'], ['Transporter Portal', 'features'], ['Admin Portal', 'features']] },
];

const BADGES = [
  { icon: ShieldCheck, label: 'NPOP / PGS-India ready' },
  { icon: QrCode, label: 'QR traceability' },
  { icon: Truck, label: 'Cold-chain logs' },
];

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function SiteFooter() {
  return (
    <footer className="relative z-10 overflow-hidden bg-ink text-white">
      {/* Animated wave divider */}
      <svg aria-hidden="true" className="absolute -top-px left-0 w-full text-paper" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <motion.path
          fill="currentColor"
          animate={{
            d: [
              'M0,0 L1440,0 L1440,20 C1080,60 360,0 0,30 Z',
              'M0,0 L1440,0 L1440,32 C1100,0 380,60 0,18 Z',
              'M0,0 L1440,0 L1440,20 C1080,60 360,0 0,30 Z',
            ],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
      <div className="pointer-events-none absolute -right-32 -top-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-24 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2.5">
              <BrandMark size={36} dark />
              <span className="font-display text-2xl font-semibold tracking-tight">AgroVerse</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Farm-to-fork transparency for Indian organic agriculture. Every batch carries its own story, verified on-chain.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {BADGES.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-emerald-100/80">
                  <Icon size={13} className="text-emerald-300" />{label}
                </span>
              ))}
            </div>
          </motion.div>

          {COLUMNS.map((col, ci) => (
            <motion.div key={col.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 * (ci + 1) }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300/80">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map(([label, id]) => (
                  <li key={label}>
                    <button type="button" onClick={() => scrollTo(id)} className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                      <span className="h-px w-0 bg-emerald-300 transition-all duration-300 group-hover:w-4" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300/80">Your language</p>
            <p className="mt-5 text-sm text-white/60">AgroVerse speaks 24 Indian languages.</p>
            <div className="mt-4"><LanguageSwitcher variant="light" placement="up" /></div>
            <div className="mt-6 space-y-2 text-sm text-white/60">
              <a href="mailto:support@agroverse.com" className="flex items-center gap-2 transition-colors hover:text-white"><Mail size={14} />support@agroverse.com</a>
              <p className="flex items-center gap-2"><MapPin size={14} />India</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>&copy; 2026 AgroVerse. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Leaf size={12} className="animate-sway text-emerald-400" /> Empowering Indian Agriculture
          </p>
        </div>
      </div>
    </footer>
  );
}
