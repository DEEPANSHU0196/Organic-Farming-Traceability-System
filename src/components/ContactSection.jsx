import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Leaf } from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@agroverse.com',
    href: 'mailto:support@agroverse.com',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.10)',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.10)',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'India',
    href: null,
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.10)',
  },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    // Simulate async send
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setForm({ name: '', email: '', message: '' });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <section id="contact" className="relative py-24 px-6 sm:px-8 overflow-hidden bg-gradient-to-b from-white to-surface">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 mb-5">
            ✦ Get In Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary font-display tracking-tight leading-tight mb-5">
            We'd Love to<br />
            <span className="text-accent">Hear from You</span>
          </h2>
          <p className="text-base sm:text-lg text-accent-muted max-w-2xl mx-auto leading-relaxed">
            Have questions about AgroVerse? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* ── Left: Contact Info ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Brand blurb */}
            <div className="rounded-3xl bg-gradient-to-br from-primary to-accent-light p-7 text-white shadow-xl mb-2 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Leaf size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-base font-display">AgroVerse</p>
                    <p className="text-white/60 text-xs">Modern AgriTech Platform</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  Empowering Indian farmers and transforming the agricultural supply chain through technology, transparency, and trust.
                </p>
                <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="text-xs font-medium">Support team typically replies in &lt; 2 hrs</span>
                </div>
              </div>
            </div>

            {/* Contact info cards */}
            {CONTACT_INFO.map((info, i) => {
              const Icon = info.icon;
              const content = (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-surface-alt hover:border-opacity-60 hover:shadow-md transition-all duration-300 group"
                  style={{ '--accent-color': info.color }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: info.bg }}
                  >
                    <Icon size={18} style={{ color: info.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-accent-muted uppercase tracking-wider mb-0.5">{info.label}</p>
                    <p className="text-sm font-bold text-primary">{info.value}</p>
                  </div>
                </motion.div>
              );
              return info.href ? (
                <a key={info.label} href={info.href} className="block no-underline">
                  {content}
                </a>
              ) : (
                <div key={info.label}>{content}</div>
              );
            })}
          </motion.div>

          {/* ── Right: Contact Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl shadow-lg border border-surface-alt p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* Success State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 size={36} className="text-emerald-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-primary font-display mb-3">Message Sent!</h3>
                    <p className="text-accent-muted text-sm leading-relaxed max-w-xs mb-8">
                      Thank you for reaching out. Our team will get back to you at <strong>{form.email}</strong> within 2 hours.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleReset}
                      className="px-6 py-3 rounded-full border-2 border-primary/20 text-primary text-sm font-semibold hover:bg-surface-alt transition-colors duration-200"
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  /* Form State */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-primary font-display mb-1">Send a Message</h3>
                      <p className="text-sm text-accent-muted">We read every message and respond personally.</p>
                    </div>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-name" className="text-sm font-semibold text-primary">
                        Full Name <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Ravi Kumar"
                        autoComplete="name"
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-primary placeholder:text-accent-muted/50 bg-surface/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 ${
                          errors.name ? 'border-red-400 bg-red-50/40' : 'border-surface-alt hover:border-accent-muted/40'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-email" className="text-sm font-semibold text-primary">
                        Email Address <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. ravi@email.com"
                        autoComplete="email"
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-primary placeholder:text-accent-muted/50 bg-surface/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 ${
                          errors.email ? 'border-red-400 bg-red-50/40' : 'border-surface-alt hover:border-accent-muted/40'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-message" className="text-sm font-semibold text-primary">
                        Message <span className="text-emerald-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm text-primary placeholder:text-accent-muted/50 bg-surface/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none ${
                          errors.message ? 'border-red-400 bg-red-50/40' : 'border-surface-alt hover:border-accent-muted/40'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500 mt-0.5">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      id="contact-send-btn"
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full bg-primary text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Message
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-[11px] text-accent-muted/60">
                      🔒 Your information is secure and never shared with third parties.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
