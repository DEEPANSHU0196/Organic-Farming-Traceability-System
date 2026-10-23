import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  Square,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Minus,
  QrCode,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Bug,
  Leaf,
  Truck,
  Globe2,
  ImagePlus,
  Camera,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { sendChatbotQuery, compressImage } from '../../api/chatbot';

const ROLE_LABELS = {
  farmer: '🌾 Farmer mode',
  buyer: '🛒 Buyer mode',
  transporter: '🚚 Transporter mode',
  admin: '🛡️ Admin mode',
  guest: '🌿 Visitor assistant',
};

const SUGGESTIONS = {
  farmer: [
    'How to add a new crop batch with QR code?',
    'Best natural pest control for tomatoes',
    'What are current organic mandi prices?',
    'How do I upload NPOP certificate?',
  ],
  buyer: [
    'How to verify organic QR traceability?',
    'Check sample batch BATCH-1001',
    'How to find certified basmati rice sellers?',
    'What does Jaivik Bharat mark mean?',
  ],
  transporter: [
    'How to log transit temperature & humidity?',
    'What is safe transport temperature for fruits?',
    'How to update shipment status?',
  ],
  admin: [
    'How to audit farmer organic certificates?',
    'How QR code generation works?',
    'Platform analytics and user activity',
  ],
  guest: [
    'What is AgroVerse?',
    'Try batch lookup BATCH-1001',
    'Show current organic market prices',
    'How to register as an organic farmer?',
  ],
};

const QUICK_TOPICS = [
  { icon: QrCode, label: 'Trace', prompt: 'Check sample batch BATCH-1001' },
  { icon: TrendingUp, label: 'Mandi', prompt: 'What are today’s organic mandi prices?' },
  { icon: Bug, label: 'Pests', prompt: 'How to prepare neem oil pest spray?' },
  { icon: Leaf, label: 'Soil', prompt: 'How to make Jeevamrutha for soil health?' },
  { icon: Camera, label: 'Photo check', prompt: '__photo' },
  { icon: Truck, label: 'Delivery', prompt: 'How does cold-chain transport tracking work?' },
];

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function greetingFor(role, user) {
  const name = user?.name ? `, ${user.name.split(' ')[0]}` : '';
  switch (role) {
    case 'farmer':
      return `Namaste${name}! 🌾 I'm **AgroBot**, your farming assistant. Ask me about organic fertilizers, natural pest remedies, mandi prices, or QR codes for your harvest.`;
    case 'buyer':
      return `Welcome${name}! 🛒 I'm **AgroBot**. I can verify organic QR codes, track your farm-to-table shipments, or help you find certified producers.`;
    case 'transporter':
      return `Hello${name}! 🚚 **AgroBot** here. Need help with cold-chain temperature logs, route tracking, or delivery confirmations?`;
    case 'admin':
      return `Greetings${name}! 🛡️ **AgroBot** ready. Ask about certification audits, QR generation, or platform activity.`;
    default:
      return `Namaste! 🌿 I'm **AgroBot**, the AgroVerse assistant for organic farming and farm-to-fork QR traceability. Ask me anything, in any Indian language.`;
  }
}

const plainText = (raw) => (raw || '').replace(/[*_#`~]/g, '').replace(/\n+/g, ' ').replace(/•/g, '').trim();

function renderInline(line) {
  return line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-emerald-950">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="rounded border border-emerald-300/40 bg-emerald-100 px-1.5 py-0.5 font-mono text-[11px] text-emerald-900">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function FormattedText({ text }) {
  if (!text) return null;
  return text.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-2" />;
    const bullet = trimmed.match(/^(?:[•\-*]|\d+\.)\s+(.*)$/);
    if (bullet) {
      const marker = /^\d+\./.test(trimmed) ? trimmed.split('.')[0] : null;
      return (
        <div key={idx} className="my-1 flex gap-2 leading-relaxed">
          <span className={`mt-[3px] flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full ${marker ? 'bg-emerald-600 px-1 text-[9px] font-bold text-white' : ''}`}>
            {marker || <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
          </span>
          <span>{renderInline(bullet[1])}</span>
        </div>
      );
    }
    return <p key={idx} className="my-1 leading-relaxed">{renderInline(line)}</p>;
  });
}

/* Reveals a bot reply word by word so it feels like it's being written. */
function TypewriterText({ text, animate, onTick }) {
  const [shown, setShown] = useState(animate ? '' : text);
  useEffect(() => {
    if (!animate) { setShown(text); return undefined; }
    const tokens = text.split(/(\s+)/);
    let i = 0;
    const step = Math.max(1, Math.ceil(tokens.length / 90));
    const timer = window.setInterval(() => {
      i = Math.min(tokens.length, i + step);
      setShown(tokens.slice(0, i).join(''));
      onTick?.();
      if (i >= tokens.length) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
    // onTick is a stable scroll callback; re-running would restart the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, animate]);
  return <FormattedText text={shown} />;
}

function BotAvatar({ size = 'h-8 w-8' }) {
  return (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-700 shadow-md ring-2 ring-white`}>
      <Sprout className="h-4 w-4 text-white" />
    </div>
  );
}

export default function AgroChatbot() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const role = user?.role === 'consumer' ? 'buyer' : user?.role || 'guest';
  const defaultPrompts = SUGGESTIONS[role] || SUGGESTIONS.guest;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTeaser, setShowTeaser] = useState(false);
  const [photo, setPhoto] = useState(null); // { preview, mediaType, data }
  const fileRef = useRef(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const resetConversation = useCallback(() => {
    setMessages([{ id: `welcome-${Date.now()}`, sender: 'bot', text: greetingFor(role, user), suggestions: defaultPrompts, timestamp: now() }]);
  }, [role, user, defaultPrompts]);

  useEffect(() => { resetConversation(); }, [resetConversation]);

  // Friendly nudge bubble a few seconds after first load.
  useEffect(() => {
    const show = window.setTimeout(() => setShowTeaser(true), 4000);
    const hide = window.setTimeout(() => setShowTeaser(false), 12000);
    return () => { window.clearTimeout(show); window.clearTimeout(hide); };
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized, isLoading, scrollToBottom]);

  // Voice input follows the selected site language.
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language.speech;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join('');
      setInputValue(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, [language.speech]);

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(plainText(text));
    utterance.lang = language.speech;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang === language.speech);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }, [language.speech]);

  const handleSendMessage = async (textToSend) => {
    const typed = (typeof textToSend === 'string' ? textToSend : inputValue).trim();
    const attached = typeof textToSend === 'string' ? null : photo;
    if ((!typed && !attached) || isLoading) return;
    const queryText = typed || 'What is wrong with this plant, and how do I treat it organically?';

    const history = messages.filter((m) => !m.isError);
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, sender: 'user', text: queryText, image: attached?.preview, timestamp: now() }]);
    setInputValue('');
    setPhoto(null);
    setIsLoading(true);

    try {
      const response = await sendChatbotQuery(queryText, role, user, {
        language: language.english,
        history,
        image: attached ? { mediaType: attached.mediaType, data: attached.data } : null,
      });
      const reply = response.reply || 'Here is what I found for your request.';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          animate: true,
          actionType: response.actionType || 'text',
          actionData: response.actionData || null,
          suggestions: response.suggestions?.length ? response.suggestions : defaultPrompts,
          timestamp: now(),
        },
      ]);
      if (!isOpen) setUnreadCount((n) => n + 1);
      if (speechEnabled) speak(reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `bot-err-${Date.now()}`, sender: 'bot', isError: true, text: '🌿 I had a small connection hiccup. Please try again.', timestamp: now() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setMessages((prev) => [...prev, { id: `bot-mic-${Date.now()}`, sender: 'bot', isError: true, text: '🎙️ Voice input needs Chrome or Edge. You can still type your question.', timestamp: now() }]);
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setInputValue('');
      setIsListening(true);
      recognition.start();
    }
  };

  const copyMessage = (msg) => {
    navigator.clipboard?.writeText(plainText(msg.text));
    setCopiedId(msg.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
    setUnreadCount(0);
    setShowTeaser(false);
  };

  const lastIndex = messages.length - 1;
  const showQuickTopics = messages.length <= 1;

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* ── Launcher ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="launcher"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="flex flex-col items-end gap-3"
          >
            <AnimatePresence>
              {showTeaser && (
                <motion.button
                  type="button"
                  onClick={toggleOpen}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="max-w-[230px] rounded-2xl rounded-br-sm border border-emerald-100 bg-white px-4 py-3 text-left text-sm text-emerald-950 shadow-xl"
                >
                  👋 Namaste! Ask me about crops, prices or QR tracing — in your own language.
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={toggleOpen}
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Open AgroBot assistant"
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white shadow-[0_12px_40px_rgba(16,120,80,0.45)]"
            >
              <span className="absolute inset-0 rounded-full border-2 border-emerald-300/70 animate-ping-slow" />
              <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}>
                <Sprout className="h-7 w-7" />
              </motion.span>
              <Sparkles className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-amber-200" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-400 px-1.5 text-xs font-extrabold text-emerald-950 ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="window"
            initial={{ opacity: 0, y: 40, scale: 0.9, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1, height: isMinimized ? 72 : 'min(640px, 85vh)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="flex w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-[0_30px_80px_rgba(13,38,25,0.35)] sm:w-[410px]"
          >
            {/* Header */}
            <div className="animated-gradient relative flex items-center justify-between bg-gradient-to-r from-emerald-900 via-green-700 to-teal-800 px-4 py-3.5 text-white">
              <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-lime-300/20 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <BotAvatar size="h-10 w-10" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-emerald-900 bg-lime-400" />
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-bold leading-tight">AgroBot</h3>
                  <p className="flex items-center gap-1.5 text-[11px] text-emerald-100/80">
                    <span>{isLoading ? 'typing…' : ROLE_LABELS[role] || ROLE_LABELS.guest}</span>
                    <span className="opacity-50">·</span>
                    <Globe2 className="h-3 w-3" />
                    <span className="notranslate" translate="no">{language.native}</span>
                  </p>
                </div>
              </div>
              <div className="relative flex items-center gap-0.5">
                {[
                  { onClick: () => setSpeechEnabled((v) => !v), title: speechEnabled ? 'Turn off read-aloud' : 'Read replies aloud', icon: speechEnabled ? Volume2 : VolumeX, active: speechEnabled },
                  { onClick: resetConversation, title: 'New conversation', icon: RotateCcw },
                  { onClick: () => setIsMinimized((v) => !v), title: isMinimized ? 'Expand' : 'Minimise', icon: Minus },
                  { onClick: toggleOpen, title: 'Close', icon: X },
                ].map(({ onClick, title, icon: Icon, active }) => (
                  <motion.button
                    key={title}
                    type="button"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClick}
                    title={title}
                    aria-label={title}
                    className={`rounded-lg p-1.5 transition-colors ${active ? 'bg-white/20 text-amber-200' : 'text-emerald-50/85 hover:bg-white/15'}`}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.button>
                ))}
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="chat-scroll flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-emerald-50/70 to-white px-4 py-4">
                  {showQuickTopics && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-2">
                      {QUICK_TOPICS.map(({ icon: Icon, label, prompt }, i) => (
                        <motion.button
                          key={label}
                          type="button"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * i }}
                          whileHover={{ y: -3 }}
                          onClick={() => (prompt === '__photo' ? fileRef.current?.click() : handleSendMessage(prompt))}
                          className="flex flex-col items-center gap-1.5 rounded-2xl border border-emerald-100 bg-white px-2 py-3 text-[11px] font-semibold text-emerald-900 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-4 w-4" /></span>
                          {label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {messages.map((msg, index) => {
                    const isBot = msg.sender === 'bot';
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={`flex gap-2 ${isBot ? 'items-start' : 'flex-row-reverse items-end'}`}
                      >
                        {isBot && <BotAvatar />}
                        <div className={`flex max-w-[85%] flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                          <div
                            className={`group relative rounded-2xl px-3.5 py-2.5 text-[13px] shadow-sm ${
                              isBot
                                ? `rounded-tl-sm border bg-white text-emerald-950 ${msg.isError ? 'border-amber-200 bg-amber-50' : 'border-emerald-100'}`
                                : 'rounded-br-sm bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
                            }`}
                          >
                            {isBot ? (
                              <TypewriterText text={msg.text} animate={msg.animate && index === lastIndex} onTick={scrollToBottom} />
                            ) : (
                              <>
                                {msg.image && <img src={msg.image} alt="Your crop photo" className="mb-2 max-h-48 w-full rounded-xl object-cover" />}
                                <p className="leading-relaxed">{msg.text}</p>
                              </>
                            )}

                            {isBot && msg.actionType === 'traceability_card' && msg.actionData && (
                              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-3 overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-50">
                                <div className="flex items-center justify-between border-b border-emerald-200/70 px-3 py-2">
                                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-950"><QrCode className="h-4 w-4 text-emerald-600" />{msg.actionData.name}</span>
                                  <span className="rounded bg-emerald-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">{msg.actionData.traceabilityId}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 px-3 py-2.5 text-[11px] text-emerald-800">
                                  {[['Farmer', msg.actionData.farmerName], ['Location', msg.actionData.farmLocation], ['Soil pH', msg.actionData.soilPh], ['Certificate', msg.actionData.certificateNumber]].map(([k, v]) => (
                                    <div key={k}><span className="block font-medium text-emerald-600">{k}</span>{v}</div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => { navigate(`/trace/${msg.actionData.traceabilityId}`); setIsOpen(false); }}
                                  className="flex w-full items-center justify-center gap-1.5 bg-emerald-700 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-800"
                                >
                                  Open full farm-to-fork trace <ExternalLink className="h-3.5 w-3.5" />
                                </button>
                              </motion.div>
                            )}

                            {isBot && msg.actionType === 'market_rates' && (
                              <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-emerald-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
                                <TrendingUp className="h-4 w-4 text-amber-600" /> Indicative rates · verify on eNAM / Agmarknet
                              </div>
                            )}

                            {isBot && (
                              <button
                                type="button"
                                onClick={() => copyMessage(msg)}
                                title="Copy"
                                aria-label="Copy message"
                                className="absolute -right-2 -top-2 rounded-full border border-emerald-100 bg-white p-1 text-emerald-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                              >
                                {copiedId === msg.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </button>
                            )}
                          </div>
                          <span className="mt-1 px-1 text-[10px] text-emerald-800/45">{msg.timestamp}</span>

                          {isBot && index === lastIndex && !isLoading && msg.suggestions?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {msg.suggestions.map((s, sIdx) => (
                                <motion.button
                                  key={s}
                                  type="button"
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.15 + sIdx * 0.06 }}
                                  whileHover={{ scale: 1.04 }}
                                  whileTap={{ scale: 0.96 }}
                                  onClick={() => handleSendMessage(s)}
                                  className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-left text-[11px] font-medium text-emerald-800 shadow-sm hover:border-emerald-400 hover:bg-emerald-50"
                                >
                                  {s}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                      <BotAvatar />
                      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                        <span className="chat-dot h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="chat-dot h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="chat-dot h-2 w-2 rounded-full bg-emerald-500" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Composer */}
                <div className="border-t border-emerald-100 bg-white p-3">
                  <AnimatePresence>
                    {photo && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-2 flex items-center gap-3 overflow-hidden rounded-2xl bg-emerald-50 p-2">
                        <img src={photo.preview} alt="Selected crop" className="h-14 w-14 rounded-xl object-cover" />
                        <p className="flex-1 text-xs text-emerald-900">Photo attached. Add a note (optional) and send.</p>
                        <button type="button" onClick={() => setPhoto(null)} aria-label="Remove photo" className="rounded-lg p-1.5 text-emerald-800 hover:bg-emerald-100"><X className="h-4 w-4" /></button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (!file) return;
                      try { setPhoto(await compressImage(file)); } catch { /* not an image; ignore */ }
                    }}
                  />
                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-1.5 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleVoiceInput}
                      title={isListening ? 'Stop listening' : `Speak in ${language.english}`}
                      aria-label={isListening ? 'Stop listening' : 'Voice input'}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white' : 'text-emerald-700 hover:bg-emerald-100'}`}
                    >
                      {isListening ? <Square className="h-3.5 w-3.5 fill-current" /> : <Mic className="h-4 w-4" />}
                    </motion.button>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileRef.current?.click()}
                      title="Send a crop photo"
                      aria-label="Attach a crop photo"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${photo ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-100'}`}
                    >
                      <ImagePlus className="h-4 w-4" />
                    </motion.button>

                    {isListening && !inputValue ? (
                      <div className="mic-wave flex flex-1 items-center gap-1 px-1 text-xs text-red-600">
                        {[0, 1, 2, 3, 4].map((i) => <span key={i} className="block h-4 w-1 rounded-full bg-red-400" />)}
                        <span className="ml-2">Listening in {language.english}…</span>
                      </div>
                    ) : (
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask anything… (any language)"
                        className="min-w-0 flex-1 bg-transparent px-1 text-sm text-emerald-950 outline-none placeholder:text-emerald-800/40"
                      />
                    )}

                    <motion.button
                      type="submit"
                      whileHover={{ scale: inputValue.trim() ? 1.06 : 1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={(!inputValue.trim() && !photo) || isLoading}
                      aria-label="Send"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md transition-opacity disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" />
                    </motion.button>
                  </form>
                  <p className="mt-2 text-center text-[10px] text-emerald-800/45">AgroBot can make mistakes. Check important farm advice with your local KVK.</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
