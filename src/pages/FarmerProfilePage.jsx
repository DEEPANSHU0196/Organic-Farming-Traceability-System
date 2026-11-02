import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BadgeCheck, CalendarDays, MapPin, QrCode, Sprout, Star, UserRound } from 'lucide-react';
import { getFarmerProfile } from '../api/public';
import { Skeleton } from '../shared/ui';
import EmptyState from '../shared/EmptyState';

const EASE = [0.22, 1, 0.36, 1];

function Stars({ value }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} className={n <= Math.round(value) ? 'fill-saffron text-saffron' : 'text-line'} />
      ))}
    </span>
  );
}

export default function FarmerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setData(null);
    setError('');
    getFarmerProfile(id)
      .then(setData)
      .catch((err) => setError(err?.response?.status === 404 ? 'This farmer profile doesn’t exist.' : 'Couldn’t load this profile right now.'));
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <EmptyState icon={UserRound} title="Profile not available" body={error} actionLabel="Back to home" onAction={() => navigate('/')} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-paper px-5 py-24" role="status" aria-label="Loading farmer profile">
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <Skeleton className="h-5 w-1/3" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-60 rounded-3xl" />)}</div>
        </div>
      </div>
    );
  }

  const { farmer, products, reviews, rating } = data;
  const since = farmer.memberSince ? new Date(farmer.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : null;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="relative overflow-hidden bg-ink px-5 pb-20 pt-8 text-paper sm:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-leaf/30 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-paper/70 hover:text-paper">
            <ArrowLeft size={16} /> Back
          </button>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.75rem] bg-leaf font-display text-4xl text-white shadow-xl">
              {farmer.name?.[0]?.toUpperCase() || 'F'}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0b968]">AgroVerse farmer</p>
              <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">{farmer.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper/70">
                {farmer.location && <span className="flex items-center gap-1.5"><MapPin size={15} />{farmer.location}</span>}
                {since && <span className="flex items-center gap-1.5"><CalendarDays size={15} />On AgroVerse since {since}</span>}
                {farmer.certified && <span className="flex items-center gap-1.5 text-lime-200"><BadgeCheck size={15} />Organic certification independently verified</span>}
                {!farmer.certified && farmer.certificationSubmitted && <span className="flex items-center gap-1.5 text-amber-200"><BadgeCheck size={15} />Certificate reference submitted, not verified</span>}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto -mt-10 max-w-5xl px-5 pb-24 sm:px-8">
        <div className="grid grid-cols-3 overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
          {[
            { label: 'Live batches', value: products.length },
            { label: 'Rating', value: rating.average ? `${rating.average} ★` : '—' },
            { label: 'Reviews', value: rating.count },
          ].map((s, i) => (
            <div key={s.label} className={`px-5 py-6 text-center ${i ? 'border-l border-line' : ''}`}>
              <p className="font-display text-3xl font-medium">{s.value}</p>
              <p className="mt-1 text-xs text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="font-display text-3xl font-medium tracking-tight">Batches on sale</h2>
          {products.length === 0 ? (
            <EmptyState icon={Sprout} compact title="No live batches right now" body="Check back after the next harvest." />
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: EASE }}
                  className="group overflow-hidden rounded-3xl border border-line bg-white"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-leaf-light">
                    {p.image ? (
                      <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-leaf"><Sprout size={40} /></span>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold">{p.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="mt-1 text-sm text-ink-soft">₹{Number(p.price).toLocaleString('en-IN')} / {p.unit || 'kg'} · {p.quantity} {p.unit || 'kg'} available</p>
                    <Link to={`/trace/${p._id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:underline">
                      <QrCode size={15} /> See its trace record
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl font-medium tracking-tight">What buyers say</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <figure key={r._id} className="rounded-3xl border border-line bg-white p-6">
                  <Stars value={r.rating} />
                  <blockquote className="mt-3 text-[15px] leading-relaxed">“{r.comment}”</blockquote>
                  <figcaption className="mt-4 text-sm text-ink-soft">{r.buyerName} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
