import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, animate, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Camera, Check, QrCode, ScanLine } from 'lucide-react';
import Navbar from './Navbar';
import { getPlatformStats } from '../api/public';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const VIDEO_SRC = '/videos/tractor-hero.mp4';
const EASE = [0.22, 1, 0.36, 1];

// Live counts from /api/public/stats; anything that is still zero is left out
// rather than shown as "0 farmers".
function buildStats(live) {
  const items = [];
  if (live?.farmers) items.push({ value: live.farmers, suffix: '', label: 'Farmers on AgroVerse' });
  if (live?.buyers) items.push({ value: live.buyers, suffix: '', label: 'Registered buyers' });
  if (live?.approvedProducts) items.push({ value: live.approvedProducts, suffix: '', label: 'Approved batches' });
  if (live?.deliveries) items.push({ value: live.deliveries, suffix: '', label: 'Deliveries completed' });
  items.push({ value: 24, suffix: '', label: 'Indian languages' });
  return items.slice(-4);
}

const JOURNEY = [
  { label: 'Harvested', meta: 'Gurdaspur, Punjab · 10 Aug' },
  { label: 'Certified organic', meta: 'NPOP / APEDA verified' },
  { label: 'In cold-chain transit', meta: '4.2 °C · 2 checkpoints' },
  { label: 'Delivered', meta: 'Signed by buyer' },
];

function Counter({ value, suffix, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, { duration: 1.6, delay, ease: EASE, onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, delay]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* A sample batch card that steps through its journey: it shows what the product does. */
function TraceCard() {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(reducedMotion ? JOURNEY.length - 1 : 0);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const t = window.setInterval(() => setStep((s) => (s + 1) % (JOURNEY.length + 1)), 1600);
    return () => window.clearInterval(t);
  }, [reducedMotion]);

  const done = Math.min(step, JOURNEY.length - 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
      className="absolute -bottom-8 left-4 right-4 rounded-3xl border border-white/60 bg-paper/95 p-5 shadow-[0_24px_60px_rgba(19,38,27,0.25)] backdrop-blur-xl sm:left-auto sm:right-6 sm:w-[330px] lg:-left-16 lg:right-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">Batch</p>
          <p className="font-mono text-sm font-semibold text-ink">BATCH-1001</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-paper"><QrCode size={18} /></span>
      </div>
      <p className="mt-3 font-display text-xl text-ink">Organic Sarbati Wheat</p>
      <ol className="mt-4 space-y-3">
        {JOURNEY.map((item, i) => {
          const reached = i <= done && step < JOURNEY.length + 1;
          return (
            <li key={item.label} className="flex items-start gap-3">
              <motion.span
                animate={{ backgroundColor: reached ? '#2F6B45' : 'rgba(19,38,27,0)', borderColor: reached ? '#2F6B45' : '#D9D0BD' }}
                transition={{ duration: 0.35 }}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
              >
                {reached && <Check size={12} className="text-white" strokeWidth={3} />}
              </motion.span>
              <div className={`transition-opacity duration-300 ${reached ? 'opacity-100' : 'opacity-40'}`}>
                <p className="text-sm font-semibold leading-tight text-ink">{item.label}</p>
                <p className="text-xs text-ink-soft">{item.meta}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();
  const [batchId, setBatchId] = useState('');
  const [liveStats, setLiveStats] = useState(null);
  useEffect(() => { getPlatformStats().then(setLiveStats).catch(() => {}); }, []);
  const stats = buildStats(liveStats);
  const mediaRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: mediaRef, offset: ['start end', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const traceBatch = (e) => {
    e.preventDefault();
    const id = batchId.trim();
    navigate(`/trace/${encodeURIComponent(id || 'BATCH-1001')}`);
  };

  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-40">
      <Navbar />

      <div className="mx-auto grid max-w-[1240px] items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* Copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/50 py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-ink-soft"
          >
            <span className="rounded-full bg-leaf px-2.5 py-0.5 text-[11px] font-semibold text-white">New</span>
            Farm-to-fork traceability for Indian organic produce
          </motion.p>

          <h1 className="mt-7 font-display text-[clamp(2.7rem,6.2vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.025em] text-ink">
            {['Every harvest,', 'with its whole', 'story attached.'].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={`block ${i === 2 ? 'italic text-leaf' : ''}`}
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
            className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft"
          >
            AgroVerse gives every batch a QR identity — from seed and soil to certification, cold-chain transit and
            delivery — so farmers earn the organic premium and buyers can trust what they pay for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              onClick={() => navigate('/login?mode=signup')}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-[15px] font-semibold text-paper transition-colors hover:bg-leaf"
            >
              Create free account
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <form onSubmit={traceBatch} className="flex items-center rounded-full border border-line bg-white/70 p-1.5 pl-4 focus-within:border-leaf focus-within:ring-4 focus-within:ring-leaf/10">
              <ScanLine size={17} className="shrink-0 text-ink-soft" />
              <input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Trace a batch ID"
                aria-label="Batch ID to trace"
                className="w-full min-w-0 bg-transparent px-2.5 text-[15px] text-ink outline-none placeholder:text-ink-soft/60 sm:w-40"
              />
              <button type="submit" className="shrink-0 rounded-full bg-leaf-light px-4 py-2.5 text-sm font-semibold text-leaf transition-colors hover:bg-leaf hover:text-white">
                Trace
              </button>
            </form>
            <button
              type="button"
              onClick={() => navigate('/scan')}
              title="Scan a QR with your camera"
              aria-label="Scan a QR with your camera"
              className="hidden h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-line bg-white/70 text-ink transition-colors hover:border-ink sm:flex"
            >
              <Camera size={20} />
            </button>
          </motion.div>
        </div>

        {/* Media */}
        <motion.div
          ref={mediaRef}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
          className="relative mx-auto w-full max-w-[560px] lg:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-ink sm:aspect-[5/5] lg:aspect-[4/5]">
            <motion.video
              src={VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              style={{ y: videoY, scale: 1.15 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" /> Live from the field
            </div>
          </div>
          <TraceCard />
        </motion.div>
      </div>

      {/* Stats */}
      <div className={`mx-auto mt-28 grid max-w-[1240px] grid-cols-2 border-t border-line lg:mt-32 ${['lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4'][stats.length - 1]}`}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className={[
              'border-line pt-7',
              i % 2 === 1 ? 'border-l pl-6' : '', // 2-col on mobile: divider between pairs
              i > 0 ? 'lg:border-l lg:pl-8' : '', // 4-col on desktop: divider before each
              i > 1 ? 'mt-8 lg:mt-0' : '',
            ].join(' ')}
          >
            <p className="font-display text-5xl font-medium tracking-tight text-ink sm:text-6xl">
              <Counter value={stat.value} suffix={stat.suffix} delay={i * 0.1} />
            </p>
            <p className="mt-2 text-sm text-ink-soft">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
