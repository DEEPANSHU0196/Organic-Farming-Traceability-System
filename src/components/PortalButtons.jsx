import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sprout, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';

const roleHighlights = [
  { icon: Sprout, label: 'Farmers', color: '#22c55e', bg: '#dcfce7' },
  { icon: ShoppingCart, label: 'Buyers', color: '#0ea5e9', bg: '#e0f2fe' },
  { icon: Truck, label: 'Transporters', color: '#f97316', bg: '#ffedd5' },
  { icon: ShieldCheck, label: 'Admins', color: '#8b5cf6', bg: '#ede9fe' },
];

export default function PortalButtons() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* Role pills */}
      <div className="flex flex-wrap gap-2">
        {roleHighlights.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{
                background: r.bg,
                borderColor: r.color + '44',
                color: r.color,
              }}
            >
              <Icon size={13} />
              {r.label}
            </motion.div>
          );
        })}
      </div>

      {/* Single CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/login')}
          id="hero-get-started"
          className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-primary text-white font-semibold text-[15px] shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Started
          <motion.span
            className="flex items-center"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ArrowRight size={18} />
          </motion.span>
        </motion.button>

        <p className="text-sm text-accent-muted/70 mt-3">
          Select your role and sign in to your portal →
        </p>
      </motion.div>
    </div>
  );
}
