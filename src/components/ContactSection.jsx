import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Mail, MapPin, Phone } from 'lucide-react';
import Reveal, { SectionLabel } from './landing/Reveal';
import { sendContactMessage } from '../api/public';

const SUPPORT_EMAIL = 'support@agroverse.com';
const TOPICS = ['I’m a farmer', 'I’m a buyer', 'Transport partner', 'Something else'];

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-ink-soft">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 block text-xs text-red-600">
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

const inputClass = 'mt-2 w-full border-b border-line bg-transparent pb-3 text-[17px] text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-ink';

export default function ContactSection() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [topic, setTopic] = useState(TOPICS[0]);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [serverError, setServerError] = useState('');
  const [website, setWebsite] = useState(''); // honeypot

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Please add your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please add a valid email';
    if (!form.message.trim()) next.message = 'Tell us a little about what you need';
    setErrors(next);
    if (Object.keys(next).length) return;
    setState('sending');
    setServerError('');
    try {
      await sendContactMessage({ ...form, topic, website });
      setState('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setState('error');
      setServerError(err?.response?.data?.message || `Couldn't send right now. You can email us at ${SUPPORT_EMAIL}.`);
    }
  };

  return (
    <section id="contact" className="px-5 pb-24 pt-8 sm:px-8 lg:pb-32">
      <div className="mx-auto max-w-[1240px]">
        {/* CTA band */}
        <Reveal className="relative overflow-hidden rounded-[2.25rem] bg-leaf px-7 py-14 text-white sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-black/10" />
          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <h2 className="font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-medium leading-[1.03] tracking-tight">
              Put your next harvest on the record.
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <button
                type="button"
                onClick={() => navigate('/login?mode=signup')}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-paper px-7 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Create an account
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/trace/BATCH-1001')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-4 font-semibold text-white transition-colors hover:bg-white/10"
              >
                See a sample trace
              </button>
            </div>
          </div>
        </Reveal>

        {/* Contact */}
        <div className="mt-24 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <SectionLabel index="04">Contact</SectionLabel>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.4vw,3.6rem)] font-medium leading-[1.05] tracking-tight text-ink">
              Talk to a person, <span className="italic text-leaf">not a ticket.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-ink-soft">
              Onboarding a farmer group, sourcing for a store, or joining as a transport partner — write to us.
            </p>
            <div className="mt-10 space-y-1">
              {[
                { icon: Mail, label: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
                { icon: Phone, label: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: MapPin, label: 'India', href: null },
              ].map(({ icon: Icon, label, href }) => {
                const Tag = href ? 'a' : 'div';
                return (
                  <Tag key={label} href={href || undefined} className="group flex items-center justify-between border-b border-line py-4 text-ink">
                    <span className="flex items-center gap-3"><Icon size={18} className="text-leaf" />{label}</span>
                    {href && <ArrowUpRight size={18} className="text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />}
                  </Tag>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <AnimatePresence mode="wait">
            {state === 'sent' ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-line bg-white/60 p-10 text-center"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf text-white"
                >
                  <Check size={30} strokeWidth={3} />
                </motion.span>
                <h3 className="mt-6 font-display text-3xl font-medium text-ink">Message sent.</h3>
                <p className="mt-2 max-w-xs text-ink-soft">Thanks — someone from the team will write back to you by email.</p>
                <button type="button" onClick={() => setState('idle')} className="mt-8 text-sm font-semibold text-leaf underline underline-offset-4">Send another</button>
              </motion.div>
            ) : (
            <motion.form key="form" exit={{ opacity: 0 }} onSubmit={submit} noValidate className="rounded-[2rem] border border-line bg-white/60 p-7 sm:p-10">
              <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" name="website" />
              <p className="text-[13px] font-medium text-ink-soft">I’m reaching out as…</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${topic === t ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-9 grid gap-8 sm:grid-cols-2">
                <Field label="Your name" error={errors.name}>
                  <input name="name" value={form.name} onChange={update} placeholder="Ramesh Kumar" className={inputClass} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" className={inputClass} />
                </Field>
              </div>
              <div className="mt-8">
                <Field label="Message" error={errors.message}>
                  <textarea name="message" rows={4} value={form.message} onChange={update} placeholder="What can we help with?" className={`${inputClass} resize-none`} />
                </Field>
              </div>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className={`text-xs ${state === 'error' ? 'text-red-600' : 'text-ink-soft'}`}>
                  {state === 'error' ? serverError : 'We usually reply within one working day.'}
                </p>
                <button type="submit" disabled={state === 'sending'} className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-semibold text-paper transition-colors hover:bg-leaf disabled:opacity-60">
                  {state === 'sending' ? 'Sending…' : 'Send message'}
                  <ArrowRight size={18} className={`transition-transform group-hover:translate-x-1 ${state === 'sending' ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </motion.form>
            )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
