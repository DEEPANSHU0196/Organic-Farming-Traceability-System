import { motion } from 'motion/react';
import { Leaf, Target, Eye, Gauge, BadgeCheck, MapPinned, ChartNoAxesCombined, Users, ShoppingCart, Star, Truck } from 'lucide-react';
import farmPhoto from '../assets/background.png';

const STATS = [
  { value: '10K+',  label: 'Farmers',          icon: Users,       color: '#16a36a' },
  { value: '500+',  label: 'Buyers',            icon: ShoppingCart, color: '#1596d1' },
  { value: '98%',   label: 'Satisfaction Rate', icon: Star,       color: '#d99320' },
  { value: '1000+', label: 'Deliveries',        icon: Truck,      color: '#e47732' },
];

const BENEFITS = [
  {
    icon: Gauge,
    title: 'Lightning Fast',
    desc: 'Real-time updates across all portals — from farm to delivery door in one seamless flow.',
    color: '#22c55e',
  },
  {
    icon: BadgeCheck,
    title: 'Fully Verified',
    desc: 'Every farmer, buyer and transporter is vetted. Trust at every step of the supply chain.',
    color: '#38bdf8',
  },
  {
    icon: MapPinned,
    title: 'Pan-India Reach',
    desc: 'Connecting rural producers with urban markets across all major Indian states and cities.',
    color: '#fb923c',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Data-Driven',
    desc: 'Analytics dashboards give stakeholders actionable insights to grow smarter each season.',
    color: '#a78bfa',
  },
];

function StatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.09, ease: 'easeOut' }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-[#dfe7e1] bg-white/90 p-6 text-center shadow-[0_8px_22px_rgba(27,67,50,0.05)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_16px_32px_rgba(27,67,50,0.12)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110" style={{ color: stat.color, background: `${stat.color}14`, border: `1px solid ${stat.color}28`, boxShadow: `0 0 0 0 ${stat.color}00` }}>
        <Icon size={21} strokeWidth={1.8} />
      </div>
      <span className="font-display text-3xl font-black text-primary sm:text-4xl">{stat.value}</span>
      <span className="mt-1 text-xs font-medium text-accent-muted sm:text-sm">{stat.label}</span>
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden border-y border-[#dfe7e1] bg-transparent px-6 py-24 sm:px-8">
      {/* Soft section texture keeps the light grey background from feeling flat. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-70"
          style={{ background: 'radial-gradient(circle at 12% 18%, rgba(82,183,136,.12), transparent 22rem), radial-gradient(circle at 88% 72%, rgba(233,196,106,.12), transparent 24rem)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ── Top: Title + Description ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
              ✦ About AgroVerse
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-primary font-display tracking-tight leading-tight mb-6">
              Built for the<br />
              <span className="text-accent">Future of Farming</span>
            </h2>
            <p className="text-base sm:text-lg text-accent-muted leading-relaxed mb-8">
              AgroVerse is a modern agriculture supply chain platform connecting farmers, buyers,
              transporters, and administrators through a unified digital ecosystem. We eliminate
              the middlemen and bring transparency, efficiency, and trust to every transaction.
            </p>

            {/* Mission + Vision */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface-alt hover:border-emerald-200 transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center flex-shrink-0">
                  <Target size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Our Mission</h4>
                  <p className="text-sm text-accent-muted leading-relaxed">
                    Empower every Indian farmer with direct market access, fair pricing, and digital tools — eliminating inefficiency from farm to fork.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-surface-alt hover:border-emerald-200 transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Eye size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-primary mb-1">Our Vision</h4>
                  <p className="text-sm text-accent-muted leading-relaxed">
                    A world where every agricultural stakeholder — regardless of location or literacy — thrives through technology-enabled transparent commerce.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            {/* Big decorative card */}
            <div className="relative min-h-[430px] overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-2xl">
              <img src={farmPhoto} alt="Lush farm landscape" className="absolute inset-0 h-full w-full object-cover opacity-45" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/75 to-accent/60" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Leaf size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg font-display">AgroVerse</p>
                    <p className="text-white/60 text-sm">Supply Chain Platform</p>
                  </div>
                </div>

                {/* Mini stat rows */}
                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Active Farmers', value: '10,248', pct: 82 },
                    { label: 'Orders Completed', value: '1,02,347', pct: 95 },
                    { label: 'Revenue Channelled', value: '₹24.6 Cr', pct: 68 },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-white/70">{row.label}</span>
                        <span className="font-semibold">{row.value}</span>
                      </div>
                      <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${row.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                          className="h-full bg-white/60 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium">Platform running at 99.9% uptime</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-surface-alt px-5 py-3 flex items-center gap-3"
            >
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-xs font-bold text-primary">Best AgriTech 2026</p>
                <p className="text-[10px] text-accent-muted">Startup India Award</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Stats Row ── */}
        <div className="mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>

        {/* ── Benefits Grid ── */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-primary font-display text-center mb-10"
          >
            Why AgroVerse?
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.45 }}
                  className="group relative overflow-hidden bg-white border border-[#dfe7e1] rounded-2xl p-6 shadow-[0_8px_24px_rgba(27,67,50,0.05)] hover:shadow-[0_16px_32px_rgba(27,67,50,0.11)] transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${b.color}, transparent)` }} />
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${b.color}22, ${b.color}08)`, border: `1px solid ${b.color}30` }}
                  >
                    <Icon size={22} strokeWidth={1.8} style={{ color: b.color }} />
                  </div>
                  <h4 className="font-bold text-primary mb-2">{b.title}</h4>
                  <p className="text-sm text-accent-muted leading-relaxed">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
