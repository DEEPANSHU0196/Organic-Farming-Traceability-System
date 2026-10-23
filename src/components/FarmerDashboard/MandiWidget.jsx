import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Store, TrendingUp } from 'lucide-react';
import { getMandiPrices } from '../../api/public';
import { AnimatedNumber, SkeletonRows } from '../../shared/ui';

// Commodity names exactly as Agmarknet spells them.
const COMMODITIES = [
  { value: 'Wheat', label: 'Wheat' },
  { value: 'Paddy(Dhan)(Common)', label: 'Paddy' },
  { value: 'Tomato', label: 'Tomato' },
  { value: 'Onion', label: 'Onion' },
  { value: 'Potato', label: 'Potato' },
  { value: 'Turmeric', label: 'Turmeric' },
  { value: 'Green Gram (Moong)(Whole)', label: 'Moong' },
  { value: 'Mustard', label: 'Mustard' },
];

export default function MandiWidget() {
  const [commodity, setCommodity] = useState(COMMODITIES[0].value);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    setData(null);
    setError(false);
    getMandiPrices({ commodity, limit: 30 })
      .then((d) => { if (alive) setData(d); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [commodity]);

  const rows = (data?.records || [])
    .filter((r) => r.modalPrice)
    .sort((a, b) => b.modalPrice - a.modalPrice)
    .slice(0, 6);
  const best = rows[0]?.modalPrice || 1;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="mandi-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="mandi-title" className="text-lg font-bold text-slate-900">Mandi rates</h2>
          <p className="mt-0.5 text-xs text-slate-500">{data?.unit || '₹ / quintal'} · conventional APMC prices</p>
        </div>
        {data && (
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${data.source === 'agmarknet' ? 'bg-leaf-light text-leaf' : 'bg-amber-50 text-amber-700'}`}>
            {data.source === 'agmarknet' ? 'Live · Agmarknet' : 'Sample data'}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Choose a crop">
        {COMMODITIES.map((c) => (
          <button
            key={c.value}
            type="button"
            role="tab"
            aria-selected={commodity === c.value}
            onClick={() => setCommodity(c.value)}
            className={`relative shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${commodity === c.value ? 'text-paper' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {commodity === c.value && <motion.span layoutId="mandi-chip" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="relative">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        {!data && !error && <SkeletonRows rows={4} label="Loading mandi rates" />}
        {error && <p className="py-6 text-sm text-slate-500">The price feed is unavailable right now.</p>}
        {data && rows.length === 0 && (
          <p className="flex items-center gap-2 py-6 text-sm text-slate-500"><Store size={16} /> No mandi reported this crop today.</p>
        )}
        <ul className="space-y-2.5">
          {rows.map((r, i) => (
            <motion.li key={`${r.market}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-slate-700"><span className="font-semibold text-slate-900">{r.market}</span> · {r.state}</span>
                <span className="shrink-0 font-bold text-slate-900">₹<AnimatedNumber value={r.modalPrice} duration={0.9} /></span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-leaf to-saffron" initial={{ width: 0 }} animate={{ width: `${(r.modalPrice / best) * 100}%` }} transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }} />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <p className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <TrendingUp size={14} className="mt-0.5 shrink-0 text-leaf" />
        {data?.source === 'agmarknet'
          ? 'Certified organic produce usually sells above these rates. Use them as a floor when you price a batch.'
          : 'Add a free data.gov.in API key on the server (DATA_GOV_API_KEY) to see today’s real rates.'}
      </p>
    </section>
  );
}
