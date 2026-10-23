import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../api/notification';
import { useToast } from '../contexts/ToastContext';

const POLL_MS = 30000;

function timeAgo(date) {
  const seconds = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 1000));
  const units = [['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [unit, size] of units) {
    if (seconds >= size) {
      const n = Math.floor(seconds / size);
      return `${n} ${unit}${n > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/* Live notification bell backed by /api/notifications. Polls every 30s and on tab focus. */
export default function NotificationBell() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const seenIds = useRef(null);
  const rootRef = useRef(null);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const data = await getNotifications();
      const list = (data.notifications || []).slice(0, 30);
      // Toast anything new that arrived since the last poll (not on first load).
      if (seenIds.current) {
        list.filter((n) => !n.read && !seenIds.current.has(n._id)).slice(0, 2)
          .forEach((n) => toast(n.message || '', { tone: 'notify', title: n.title || 'New notification' }));
      }
      seenIds.current = new Set(list.map((n) => n._id));
      setItems(list);
    } catch {
      /* offline or logged out: keep whatever we had */
    } finally {
      setLoaded(true);
    }
  }, [toast]);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, POLL_MS);
    window.addEventListener('focus', load);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', load); };
  }, [load]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const unread = items.filter((n) => !n.read).length;

  const markOne = async (n) => {
    if (n.read) return;
    setItems((list) => list.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    try { await markNotificationAsRead(n._id); } catch { /* retried on next poll */ }
  };

  const markAll = async () => {
    setItems((list) => list.map((x) => ({ ...x, read: true })));
    try { await markAllNotificationsAsRead(); } catch { /* retried on next poll */ }
  };

  return (
    <div className="relative" ref={rootRef}>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink dark:text-paper/70 dark:hover:bg-white/10"
      >
        <motion.span
          key={unread}
          animate={unread ? { rotate: [0, -16, 14, -10, 6, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          <Bell size={19} />
        </motion.span>
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute right-1.5 top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-saffron px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#13261B]"
            >
              {unread > 9 ? '9+' : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white shadow-2xl dark:border-white/10 dark:bg-[#1b2a20]"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-white/10">
              <p className="text-sm font-semibold text-ink dark:text-paper">Notifications</p>
              {unread > 0 && (
                <button type="button" onClick={markAll} className="flex items-center gap-1 text-xs font-semibold text-leaf hover:underline">
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loaded && items.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-ink-soft">
                  <Inbox size={26} className="text-line" />
                  You’re all caught up.
                </div>
              )}
              {items.map((n) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={() => markOne(n)}
                  className={`flex w-full items-start gap-3 border-b border-line/60 px-4 py-3 text-left transition-colors last:border-0 hover:bg-paper dark:border-white/5 dark:hover:bg-white/5 ${n.read ? '' : 'bg-leaf-light/40 dark:bg-leaf/10'}`}
                >
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-saffron'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink dark:text-paper">{n.title || 'Update'}</span>
                    {n.message && <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft dark:text-paper/60">{n.message}</span>}
                    <span className="mt-1 block text-[11px] text-ink-soft/70">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
