import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Clock3, MapPin, QrCode, ScanLine, Sprout, Truck } from 'lucide-react';

const WORKFLOW_STEPS = [
  { number: '01', label: 'Grow', title: 'A better start in the soil', description: 'Farmers create a verified listing with the crop, harvest window, and story behind every batch.', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=85', fallback: '/src/assets/background.png', color: '#52b788', icon: Sprout, detail: '12,480 active plots', tag: 'Farmer portal' },
  { number: '02', label: 'Verify', title: 'Trust you can scan', description: 'Each lot receives a digital identity. Buyers can follow quality checks, origin, and certifications in one place.', image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1400&q=85', fallback: '/src/assets/tractor.png', color: '#e9c46a', icon: QrCode, detail: '98.6% lots verified', tag: 'Traceability layer' },
  { number: '03', label: 'Connect', title: 'The right buyer, sooner', description: 'Fresh produce meets demand directly, with transparent pricing and simple ordering across the buyer network.', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=85', fallback: '/src/assets/farmer.png', color: '#38bdf8', icon: ScanLine, detail: '4,280 active buyers', tag: 'Buyer marketplace' },
  { number: '04', label: 'Deliver', title: 'From field to fork', description: 'Transporters receive the route, update the journey live, and keep everyone aligned until the order arrives.', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=85', fallback: '/src/assets/tractor.png', color: '#f08c46', icon: Truck, detail: '1,024 deliveries in motion', tag: 'Logistics network' },
];

function WorkflowImage({ step }) {
  const [src, setSrc] = useState(step.image);
  useEffect(() => setSrc(step.image), [step.image]);
  return <img src={src} onError={() => setSrc(step.fallback)} alt={`${step.label} stage of the AgroVerse supply chain`} className="h-full w-full object-cover" />;
}

export default function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(0);
  const step = WORKFLOW_STEPS[activeStep];
  const StepIcon = step.icon;

  useEffect(() => {
    const timer = window.setInterval(() => setActiveStep((current) => (current + 1) % WORKFLOW_STEPS.length), 5200);
    return () => window.clearInterval(timer);
  }, []);

  const moveStep = (direction) => setActiveStep((activeStep + direction + WORKFLOW_STEPS.length) % WORKFLOW_STEPS.length);

  return (
    <section id="workflow" className="workflow-section relative overflow-hidden bg-[#173e2b] px-6 py-24 text-white sm:px-8 sm:py-32">
      <div className="workflow-wash absolute inset-0 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <span className="workflow-eyebrow">The AgroVerse flow</span>
            <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">One harvest.<br /><span className="text-[#a8d5ba]">Every step visible.</span></h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">Watch a product move through the ecosystem in real time, from the first seed to a confirmed delivery.</p>
          </motion.div>
          <div className="flex items-center gap-3 text-sm text-white/60"><span className="live-pip" />Live supply chain simulation</div>
        </div>

        <div className="workflow-board">
          <div className="workflow-image-panel">
            <AnimatePresence mode="wait"><motion.div key={step.number} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.65, ease: 'easeOut' }} className="absolute inset-0"><WorkflowImage step={step} /><div className="absolute inset-0 bg-gradient-to-t from-[#102f22] via-[#102f22]/15 to-transparent" /></motion.div></AnimatePresence>
            <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
              <div className="flex items-start justify-between"><span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">{step.tag}</span><span className="font-display text-5xl text-white/30">{step.number}</span></div>
              <div><motion.div key={`${step.number}-icon`} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md" style={{ color: step.color }}><StepIcon size={23} strokeWidth={1.8} /></motion.div><p className="max-w-md font-display text-3xl font-bold leading-tight sm:text-4xl">{step.title}</p><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/70"><MapPin size={14} className="text-[#a8d5ba]" />Live location synced across portals</div></div>
            </div>
          </div>

          <div className="workflow-info-panel">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2d6a4f]">Current stage</p><p className="mt-2 text-sm font-semibold text-[#1b4332]">{step.label} is happening now</p></div><div className="flex gap-2"><button type="button" onClick={() => moveStep(-1)} aria-label="Previous workflow stage" className="workflow-arrow"><ChevronLeft size={17} /></button><button type="button" onClick={() => moveStep(1)} aria-label="Next workflow stage" className="workflow-arrow"><ChevronRight size={17} /></button></div></div>
            <AnimatePresence mode="wait"><motion.div key={step.number} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}><p className="mt-8 text-base leading-relaxed text-[#587064]">{step.description}</p><div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#f1f6f1] p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2d6a4f] shadow-sm"><Clock3 size={18} /></div><div><p className="text-xs text-[#789084]">Network signal</p><p className="text-sm font-bold text-[#1b4332]">{step.detail}</p></div><CheckCircle2 size={18} className="ml-auto text-[#2d6a4f]" /></div></motion.div></AnimatePresence>
            <div className="mt-10"><div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-[#789084]"><span>Journey progress</span><span>{activeStep + 1} / {WORKFLOW_STEPS.length}</span></div><div className="workflow-progress-track"><motion.div className="workflow-progress-fill" animate={{ width: `${((activeStep + 1) / WORKFLOW_STEPS.length) * 100}%` }} transition={{ duration: 0.5 }} /></div><div className="workflow-step-list">{WORKFLOW_STEPS.map((item, index) => <button key={item.number} type="button" onClick={() => setActiveStep(index)} className={`workflow-step ${index === activeStep ? 'is-active' : ''}`}><span className="workflow-step-dot" style={{ backgroundColor: index <= activeStep ? item.color : undefined }} /><span>{item.label}</span></button>)}</div></div>
            <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#2d6a4f]"><ArrowRight size={14} />Follow the next handoff</div>
          </div>
        </div>
      </div>
    </section>
  );
}