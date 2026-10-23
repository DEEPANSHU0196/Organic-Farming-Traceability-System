import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck, ShoppingBasket, Sprout, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Reveal, { SectionLabel } from './landing/Reveal';

const PORTALS = [
  {
    id: 'farmer',
    icon: Sprout,
    title: 'Farmers',
    pitch: 'List a harvest, print its QR label, and get paid the organic premium you earned.',
    points: ['Batch listing with soil & harvest data', 'Certificate upload (NPOP / PGS)', 'Orders, shipments & payouts'],
    path: '/farmer-dashboard',
  },
  {
    id: 'buyer',
    icon: ShoppingBasket,
    title: 'Buyers',
    pitch: 'Source certified produce straight from the farm, with the full record before you pay.',
    points: ['Browse verified produce', 'Scan any QR to audit a batch', 'Live delivery tracking'],
    path: '/buyer-dashboard',
  },
  {
    id: 'transporter',
    icon: Truck,
    title: 'Transporters',
    pitch: 'Pick up assigned loads and keep the cold chain provable from gate to gate.',
    points: ['Assigned deliveries & routes', 'Temperature / humidity logs', 'Vehicle & driver management'],
    path: '/transporter-dashboard',
  },
  {
    id: 'admin',
    icon: ShieldCheck,
    title: 'Admins',
    pitch: 'Keep the network honest — approve people, moderate listings, catch fraud early.',
    points: ['User & listing approvals', 'Fraud detection centre', 'Platform-wide analytics'],
    path: '/admin-dashboard',
    staffOnly: true,
  },
];

function PortalCard({ portal, index }) {
  const navigate = useNavigate();
  const Icon = portal.icon;
  return (
    <motion.button
      type="button"
      // Public roles go straight to sign-up for that portal; admins are invited, so they only get sign-in.
      onClick={() => navigate(portal.staffOnly ? '/login?role=admin' : `/login?mode=signup&role=${portal.id}`)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      className="group relative flex h-full flex-col rounded-[1.75rem] border border-line bg-white/60 p-7 text-left transition-colors duration-300 hover:border-ink hover:bg-white sm:p-8"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-light text-leaf transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
          <Icon size={22} strokeWidth={1.8} />
        </span>
        <motion.span
          variants={{ hover: { x: 2, y: -2 } }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
        >
          <ArrowUpRight size={18} />
        </motion.span>
      </div>
      <p className="mt-10 font-display text-sm text-saffron">0{index + 1}</p>
      <h3 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">{portal.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{portal.pitch}</p>
      <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
        {portal.points.map((point) => (
          <li key={point} className="flex items-center gap-2.5 text-sm text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" />{point}
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-7 text-sm font-semibold text-ink">
        {portal.staffOnly ? (
          <>Staff sign-in <span className="font-normal text-ink-soft">· invite only</span></>
        ) : (
          <span className="underline decoration-line decoration-2 underline-offset-4 transition-colors group-hover:decoration-leaf">Join as {portal.title.toLowerCase().replace(/s$/, '')}</span>
        )}
      </p>
    </motion.button>
  );
}

export default function FeaturesSection() {
  const { user, isAuthenticated } = useAuth();
  const normalizedRole = user?.role === 'consumer' || user?.role === 'buyer' ? 'buyer' : user?.role;
  const visiblePortals = !isAuthenticated ? PORTALS : PORTALS.filter((p) => p.id === normalizedRole);

  return (
    <section id="features" className="px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <Reveal>
            <SectionLabel index="02">Portals</SectionLabel>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-tight text-ink">
              Four roles. <span className="italic text-leaf">One shared record.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[17px] leading-relaxed text-ink-soft lg:ml-auto">
              Everyone in the supply chain works from the same batch history, so a claim made on the farm can be checked
              at the buyer’s door.
            </p>
          </Reveal>
        </div>

        <div className={`mt-14 grid gap-5 sm:grid-cols-2 ${visiblePortals.length > 2 ? 'lg:grid-cols-4' : ''}`}>
          {visiblePortals.map((portal, i) => <PortalCard key={portal.id} portal={portal} index={i} />)}
        </div>
      </div>
    </section>
  );
}
