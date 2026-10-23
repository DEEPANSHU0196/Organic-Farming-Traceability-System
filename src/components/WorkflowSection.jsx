import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { QrCode, ScanLine, Sprout, Truck } from 'lucide-react';
import Reveal, { SectionLabel } from './landing/Reveal';
import backgroundFallback from '../assets/background.png';
import tractorFallback from '../assets/tractor.png';
import farmerFallback from '../assets/farmer.png';

const STEPS = [
  {
    label: 'Grow',
    title: 'The farmer logs the batch.',
    description: 'Crop, seed origin, soil pH, irrigation and harvest date go into a verified listing — in the farmer’s own language, from a phone.',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=80',
    fallback: backgroundFallback,
    icon: Sprout,
    fact: '12,480 active plots',
  },
  {
    label: 'Verify',
    title: 'The batch gets a QR identity.',
    description: 'NPOP or PGS-India certificates are checked and the record is anchored on-chain, so nobody can quietly edit it later.',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1400&q=80',
    fallback: tractorFallback,
    icon: QrCode,
    fact: '98.6% of lots verified',
  },
  {
    label: 'Connect',
    title: 'Buyers order with proof in hand.',
    description: 'Buyers see the farm, the certificate and the price before they commit — and pay the farmer directly, without layers of middlemen.',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=80',
    fallback: farmerFallback,
    icon: ScanLine,
    fact: '4,280 active buyers',
  },
  {
    label: 'Deliver',
    title: 'Transit is logged, stop by stop.',
    description: 'Transporters record temperature, humidity and checkpoints. The buyer signs on delivery and the journey closes.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80',
    fallback: tractorFallback,
    icon: Truck,
    fact: '1,024 deliveries in motion',
  },
];

function StepImage({ step }) {
  const [src, setSrc] = useState(step.image);
  useEffect(() => setSrc(step.image), [step.image]);
  return <img src={src} onError={() => setSrc(step.fallback)} alt={`${step.label} stage`} className="h-full w-full object-cover" loading="lazy" />;
}

function Step({ step, index, onActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => { if (inView) onActive(index); }, [inView, index, onActive]);
  const Icon = step.icon;

  return (
    <div ref={ref} className="py-10 lg:flex lg:min-h-[70vh] lg:items-center lg:py-0">
      <div>
        {/* Mobile gets the image inline; desktop uses the sticky panel. */}
        <div className="mb-7 aspect-[4/3] overflow-hidden rounded-3xl lg:hidden"><StepImage step={step} /></div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#f0b968]"><Icon size={20} /></span>
          <span className="font-display text-sm text-white/50">0{index + 1} — {step.label}</span>
        </div>
        <h3 className="mt-6 max-w-md font-display text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl">{step.title}</h3>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/65">{step.description}</p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />{step.fact}
        </p>
      </div>
    </div>
  );
}

export default function WorkflowSection() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <section id="workflow" className="relative bg-ink px-5 py-24 text-white sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="max-w-2xl">
          <SectionLabel index="01" tone="light">How it works</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-tight">
            One harvest. <span className="italic text-[#a8d5ba]">Every hand-off visible.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-16 lg:mt-4 lg:grid-cols-2">
          {/* Sticky visual (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem]">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <StepImage step={step} />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex gap-2">
                  {STEPS.map((s, i) => (
                    <div key={s.label} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
                      <motion.div
                        className="h-full bg-white"
                        animate={{ width: i <= active ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="divide-y divide-white/10 lg:divide-y-0">
            {STEPS.map((s, i) => <Step key={s.label} step={s} index={i} onActive={setActive} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
