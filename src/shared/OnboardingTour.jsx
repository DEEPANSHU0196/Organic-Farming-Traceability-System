import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BellRing, Bot, ClipboardCheck, Globe2, PackagePlus, QrCode, ScanLine, ShieldCheck, ShoppingBasket, Thermometer, Truck, X } from 'lucide-react';

const STEPS = {
  farmer: [
    { icon: PackagePlus, title: 'Add your first batch', body: 'Enter the crop, harvest date and soil details. It takes about two minutes.', section: 'add-product' },
    { icon: QrCode, title: 'Print QR labels', body: 'Once a batch is approved, print QR labels for your packaging from My Products.', section: 'my-products' },
    { icon: ClipboardCheck, title: 'Accept orders', body: 'Buyer orders show up here. Accept them and a transporter is assigned.', section: 'orders' },
    { icon: Bot, title: 'Ask AgroBot anything', body: 'Mandi rates, pest problems, certification. Ask in your language, or send a leaf photo.', section: null },
  ],
  buyer: [
    { icon: ShoppingBasket, title: 'Browse verified produce', body: 'Every listing links to its farm, certificate and harvest record.', section: 'browse' },
    { icon: ScanLine, title: 'Scan any QR', body: 'Use your phone camera to scan a pack and see its full journey.', section: null },
    { icon: Truck, title: 'Track your orders', body: 'Follow each delivery stop by stop, with transit temperature logs.', section: 'orders' },
    { icon: Globe2, title: 'Use your language', body: 'Switch to any of 24 Indian languages from the globe icon at the top.', section: null },
  ],
  transporter: [
    { icon: Truck, title: 'See your deliveries', body: 'Assigned pickups and drops appear in Deliveries.', section: 'deliveries' },
    { icon: Thermometer, title: 'Log the cold chain', body: 'Record temperature and humidity at each checkpoint. Buyers can see it.', section: 'deliveries' },
    { icon: BellRing, title: 'Stay notified', body: 'New assignments ring the bell at the top. You get a pop-up as well.', section: null },
  ],
  admin: [
    { icon: ClipboardCheck, title: 'Review approvals', body: 'New batches wait in Approvals until you check the details and certificates.', section: 'approvals' },
    { icon: ShieldCheck, title: 'Keep the network honest', body: 'Manage farmers, buyers and transporters from their sections.', section: 'farmers' },
    { icon: BellRing, title: 'Inbox and alerts', body: 'Contact-form messages and platform events arrive as notifications.', section: null },
  ],
};

const storageKey = (role) => `agroverse-tour-${role}`;

/* First-login walkthrough, shown once per role on this device. */
export default function OnboardingTour({ role, onNavigate }) {
  const steps = STEPS[role] || [];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(storageKey(role)) && steps.length) {
        const t = window.setTimeout(() => setOpen(true), 700);
        return () => window.clearTimeout(t);
      }
    } catch { /* storage unavailable: skip the tour */ }
    return undefined;
  }, [role, steps.length]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(storageKey(role), 'done'); } catch { /* ignore */ }
  };

  if (!steps.length) return null;
  const step = steps[index];
  const Icon = step.icon;
  const last = index === steps.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-paper shadow-2xl dark:bg-[#1b2a20]"
          >
            <button type="button" onClick={close} aria-label="Close tour" className="absolute right-4 top-4 z-10 rounded-full p-2 text-ink-soft hover:bg-ink/5">
              <X size={18} />
            </button>

            <div className="relative flex h-44 items-center justify-center overflow-hidden bg-leaf">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-black/10" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-paper text-leaf shadow-xl"
                >
                  <Icon size={36} strokeWidth={1.7} />
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron">Step {index + 1} of {steps.length}</p>
              <AnimatePresence mode="wait">
                <motion.div key={index} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <h2 id="tour-title" className="mt-2 font-display text-2xl font-medium text-ink dark:text-paper">{step.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft dark:text-paper/70">{step.body}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <motion.span key={i} animate={{ width: i === index ? 24 : 8 }} className={`h-2 rounded-full ${i === index ? 'bg-leaf' : 'bg-line'}`} />
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between gap-3">
                <button type="button" onClick={close} className="px-2 py-3 text-sm font-medium text-ink-soft hover:text-ink">Skip tour</button>
                <div className="flex gap-2">
                  {step.section && (
                    <button
                      type="button"
                      onClick={() => { close(); onNavigate?.(step.section); }}
                      className="rounded-full border border-line px-4 py-3 text-sm font-semibold text-ink hover:border-ink dark:text-paper"
                    >
                      Take me there
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => (last ? close() : setIndex((i) => i + 1))}
                    className="group flex items-center gap-1.5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper hover:bg-leaf"
                  >
                    {last ? 'Get started' : 'Next'}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
