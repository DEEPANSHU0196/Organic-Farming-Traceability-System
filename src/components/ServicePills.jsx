import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';

const services = ['Crops', 'Dairy', 'Equipment', 'Transport', 'Seeds', 'Other'];

export default function ServicePills({ heroMode = false }) {
  const [selected, setSelected] = useState([]);

  const toggleService = (service) => {
    setSelected((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
      className="w-full max-w-lg"
    >
      {/* Title */}
      <h3 className={`text-xl md:text-2xl font-semibold tracking-tight mb-1 font-display ${heroMode ? 'text-white' : 'text-primary'}`}>
        What are you looking for?
      </h3>
      <p className={`text-sm mb-6 opacity-85 ${heroMode ? 'text-white/60' : 'text-accent-muted'}`}>
        Select all that apply
      </p>

      {/* Pills */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        {services.map((service) => {
          const isActive = selected.includes(service);
          return (
            <motion.button
              key={service}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleService(service)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300 cursor-pointer select-none
                ${heroMode
                  ? isActive
                    ? 'bg-white text-primary shadow-md'
                    : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm'
                  : isActive
                    ? 'bg-primary text-white shadow-md shadow-emerald-950/5'
                    : 'bg-white text-primary border border-surface-alt hover:bg-surface-alt/55'
                }
              `}
            >
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    initial={{ scale: 0, width: 0 }}
                    animate={{ scale: 1, width: 'auto' }}
                    exit={{ scale: 0, width: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-center"
                  >
                    <Check size={14} strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
              {service}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      <AnimatePresence mode="wait">
        {selected.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className={`text-xs italic ${heroMode ? 'text-white/60' : 'text-accent-muted'}`}
          >
            Click above to select your interests
          </motion.p>
        ) : (
          <motion.div
            key="selected"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="overflow-hidden"
          >
            <div className={`rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 ${heroMode ? 'bg-white/15 backdrop-blur-sm border border-white/20' : 'bg-surface border border-surface-alt'}`}>
              <p className={`text-sm ${heroMode ? 'text-white/80' : 'text-primary/80'}`}>
                Interested in:{' '}
                <span className={`font-semibold ${heroMode ? 'text-white' : 'text-primary'}`}>
                  {selected.join(', ')}
                </span>
              </p>
              <motion.button
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${heroMode ? 'text-green-300 hover:text-white' : 'text-accent hover:text-primary'}`}
              >
                Let's Go
                <ArrowRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
