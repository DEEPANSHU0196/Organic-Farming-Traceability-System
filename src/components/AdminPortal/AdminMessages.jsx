import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Inbox, Mail, Reply } from 'lucide-react';
import api from '../../api/axios';
import { SkeletonRows } from '../../shared/ui';
import EmptyState from '../../shared/EmptyState';

const STATUS_STYLES = {
  new: 'bg-saffron/15 text-[#a5641a]',
  read: 'bg-slate-100 text-slate-600',
  replied: 'bg-leaf-light text-leaf',
};

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get('/admin/messages')
      .then((r) => setMessages(r.data.messages || []))
      .catch(() => setError('Could not load messages.'))
      .finally(() => setLoading(false));
  }, []);

  const setStatus = async (id, status) => {
    setMessages((list) => list.map((m) => (m._id === id ? { ...m, status } : m)));
    try { await api.put(`/admin/messages/${id}`, { status }); } catch { /* shown again on reload */ }
  };

  const toggle = (m) => {
    setOpenId((cur) => (cur === m._id ? null : m._id));
    if (m.status === 'new') setStatus(m._id, 'read');
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Contact inbox</h2>
          <p className="text-sm text-slate-500">Messages sent from the website contact form.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {messages.filter((m) => m.status === 'new').length} new
        </span>
      </div>

      {loading && <SkeletonRows rows={4} label="Loading messages" />}
      {!loading && error && <p className="px-6 py-8 text-sm text-red-600">{error}</p>}
      {!loading && !error && messages.length === 0 && (
        <EmptyState icon={Inbox} title="No messages yet" body="When someone writes in from the contact form, it lands here and you get a notification." />
      )}

      <ul className="divide-y divide-slate-100">
        {messages.map((m) => (
          <li key={m._id}>
            <button type="button" onClick={() => toggle(m)} className="flex w-full items-start gap-4 px-6 py-4 text-left hover:bg-slate-50">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Mail size={18} /></span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">{m.name}</span>
                  <span className="text-xs text-slate-500">{m.email}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[m.status]}`}>{m.status}</span>
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">{m.topic} · {new Date(m.createdAt).toLocaleString('en-IN')}</span>
                {openId !== m._id && <span className="mt-1 block truncate text-sm text-slate-600">{m.message}</span>}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {openId === m._id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-6 pb-5 pl-20">
                    <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{m.message}</p>
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.topic}`)}`}
                      onClick={() => setStatus(m._id, 'replied')}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-leaf"
                    >
                      <Reply size={15} /> Reply by email
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </div>
  );
}
