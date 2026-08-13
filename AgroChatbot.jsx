import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  QrCode,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Truck,
  User,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sendChatbotQuery } from '../../api/chatbot';

export default function AgroChatbot() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // User role details
  const role = user?.role;

  const roleLabelMap = {
    farmer: '🌾 Farmer Mode',
    buyer: '🛒 Buyer Mode',
    transporter: '🚚 Transporter Mode',
    admin: '🛡️ Admin Mode',
    guest: '🌿 Visitor Assistant',
  };

  const initialSuggestions = {
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
      'Platform analytics and user activity',
      'How QR code generation works?',
    ],
    guest: [
      'What is AgroVerse Organic Traceability?',
      'Try batch lookup BATCH-1001',
      'Show current organic market prices',
      'How to register as an organic farmer?',
    ],
  };

  const defaultPrompts = initialSuggestions[role] || initialSuggestions.guest;

  // Initialize Web Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Initialize initial greeting message
  useEffect(() => {
    const greetingText = getInitialGreeting(role, user);
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: greetingText,
        actionType: 'text',
        suggestions: defaultPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [role, user]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  function getInitialGreeting(currentRole, currentUser) {
    const name = currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : '';
    switch (currentRole) {
      case 'farmer':
        return `Namaste${name}! 🌾 I am **AgroBot**, your AI farming assistant. Ask me about organic fertilizers, natural pest remedies, mandi prices, or how to generate QR codes for your harvest!`;
      case 'buyer':
        return `Welcome${name}! 🛒 I am **AgroBot**. Need help verifying organic QR codes, tracking your farm-to-table shipments, or finding certified organic producers?`;
      case 'transporter':
        return `Hello${name}! 🚚 **AgroBot** here. Need assistance with cold-chain temperature logs, route tracking, or delivery confirmations?`;
      case 'admin':
        return `Greetings Admin${name}! 🛡️ **AgroBot** ready. Ask me about system status, organic certification auditing, or user metrics.`;
      default:
        return `Welcome to **AgroVerse**! 🌿 I am **AgroBot**, your AI assistant for organic farming & 100% transparent QR traceability. How can I assist you today?`;
    }
  }

  const handleSendMessage = async (textToSend = null) => {
    const queryText = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!queryText || !queryText.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage = {
      id: userMsgId,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (!isOpen) {
      setUnreadCount((prev) => prev + 1);
    }

    try {
      const response = await sendChatbotQuery(queryText.trim(), role, user);

      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply || 'Here is what I found for your request.',
        actionType: response.actionType || 'text',
        actionData: response.actionData || null,
        suggestions: response.suggestions && response.suggestions.length > 0 ? response.suggestions : defaultPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Speak answer if speech synthesis is toggled on
      if (speechEnabled && 'speechSynthesis' in window) {
        speakText(cleanTextForSpeech(response.reply));
      }
    } catch (error) {
      console.error('Error fetching chatbot reply:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: '🌿 I had a slight connection hiccup, but I am still here! Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please try Chrome or Edge.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return '';
    return rawText
      .replace(/[*_#`~]/g, '')
      .replace(/\n+/g, ' ')
      .replace(/•/g, '')
      .trim();
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(cleanTextForSpeech(text));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    const greetingText = getInitialGreeting(role, user);
    setMessages([
      {
        id: 'msg-reset',
        sender: 'bot',
        text: greetingText,
        suggestions: defaultPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold regex formatting
      const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
      return (
        <p key={idx} className={`${line.trim() === '' ? 'h-2' : 'my-1'} leading-relaxed`}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-emerald-950 dark:text-emerald-200">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={pIdx} className="bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-mono text-xs px-1.5 py-0.5 rounded border border-emerald-300/40">{part.slice(1, -1)}</code>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  // The chatbot is ONLY visible to farmers and buyers when they successfully log in
  if (!user || (role !== 'farmer' && role !== 'buyer')) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Floating Chat Trigger Badge/Button when closed */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          aria-label="Open AgroVerse AI Assistant Chatbot"
          className="group relative flex items-center gap-3 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-3.5 rounded-full shadow-2xl hover:shadow-emerald-900/30 hover:scale-105 transition-all duration-300 border border-emerald-500/30 active:scale-95"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-900/60 flex items-center justify-center border border-emerald-400/40 group-hover:rotate-12 transition-transform">
              <Bot className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-emerald-950"></span>
            </span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1">
              AgroBot AI <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            </span>
            <span className="text-xs font-medium text-emerald-100/90">
              {role === 'farmer' ? 'Ask Crop & Market Tips' : role === 'buyer' ? 'Verify QR & Traceability' : 'Organic Farming Guide'}
            </span>
          </div>

          {unreadCount > 0 && (
            <span className="bg-amber-400 text-emerald-950 text-xs font-extrabold px-2 py-0.5 rounded-full shadow">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Main Chatbot Window */}
      {isOpen && (
        <div
          className={`w-[92vw] sm:w-[420px] bg-white dark:bg-[#18221A] rounded-2xl shadow-2xl border border-emerald-900/20 dark:border-emerald-500/20 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-4 py-3.5 flex items-center justify-between shadow-md border-b border-emerald-700/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-950/80 flex items-center justify-center border border-emerald-400/30">
                  <Sprout className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-emerald-950"></div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-emerald-50 font-display">AgroBot AI</h3>
                  <span className="bg-emerald-950/70 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-400/20">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 font-medium">{roleLabelMap[role] || roleLabelMap.guest}</p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1 text-emerald-200/90">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                title={speechEnabled ? 'Mute AI Audio' : 'Enable AI Read Aloud'}
                className={`p-1.5 rounded-lg transition-colors ${
                  speechEnabled ? 'bg-emerald-700 text-amber-300' : 'hover:bg-emerald-800/60 text-emerald-200'
                }`}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={clearChat}
                title="Clear Conversation"
                className="p-1.5 hover:bg-emerald-800/60 rounded-lg transition-colors text-emerald-200 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand Window' : 'Minimize Window'}
                className="p-1.5 hover:bg-emerald-800/60 rounded-lg transition-colors text-emerald-200 hover:text-white"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={toggleOpen}
                title="Close Chat"
                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-emerald-200 hover:text-red-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body & Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-emerald-50/30 dark:bg-[#141B15] scrollbar-thin scrollbar-thumb-emerald-700/20">
                {/* Notice Banner */}
                <div className="bg-gradient-to-r from-emerald-100/80 to-teal-100/80 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-3 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-950 dark:text-emerald-100">100% Certified Organic Intelligence</span>
                    <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/80 mt-0.5">
                      Ask about batch QR verification, soil health, bio-pesticides, APEDA standards, or mandi rates.
                    </p>
                  </div>
                </div>

                {/* Messages List */}
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5 animate-fadeIn`}
                  >
                    <div className="flex items-center gap-1.5 px-1 text-[10px] text-emerald-800/70 dark:text-emerald-400/70 font-medium">
                      {msg.sender === 'bot' ? (
                        <>
                          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>AgroBot AI</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                          <span>You</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-sm relative group ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-br-none border border-emerald-700/50'
                          : 'bg-white dark:bg-[#1E2920] text-emerald-950 dark:text-emerald-100 rounded-bl-none border border-emerald-200/80 dark:border-emerald-800/40 shadow-emerald-950/5'
                      }`}
                    >
                      {/* Copy Action Button */}
                      {msg.sender === 'bot' && (
                        <button
                          onClick={() => copyToClipboard(msg.text, index)}
                          title="Copy message"
                          className="absolute top-2 right-2 p-1 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-100 dark:hover:bg-emerald-800/60"
                        >
                          {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}

                      {/* Main Message Text */}
                      <div className="pr-4">{renderFormattedText(msg.text)}</div>

                      {/* Interactive Action Card: Traceability Batch Record */}
                      {msg.actionType === 'traceability_card' && msg.actionData && (
                        <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 rounded-xl p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                            <span className="font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              {msg.actionData.name}
                            </span>
                            <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                              {msg.actionData.traceabilityId}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800 dark:text-emerald-300">
                            <div>
                              <span className="text-emerald-600 dark:text-emerald-400 block font-medium">Farmer</span>
                              {msg.actionData.farmerName}
                            </div>
                            <div>
                              <span className="text-emerald-600 dark:text-emerald-400 block font-medium">Location</span>
                              {msg.actionData.farmLocation}
                            </div>
                            <div>
                              <span className="text-emerald-600 dark:text-emerald-400 block font-medium">Soil pH</span>
                              {msg.actionData.soilPh}
                            </div>
                            <div>
                              <span className="text-emerald-600 dark:text-emerald-400 block font-medium">Certification</span>
                              {msg.actionData.certificateNumber}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              navigate(`/trace/${msg.actionData.traceabilityId}`);
                              setIsOpen(false);
                            }}
                            className="w-full mt-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors shadow-sm"
                          >
                            <span>Inspect Full Farm-to-Fork Trace</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Interactive Action Card: Live Mandi Rates */}
                      {msg.actionType === 'market_rates' && (
                        <div className="mt-2.5 bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/30 dark:to-emerald-950/30 border border-amber-300/60 dark:border-amber-700/40 rounded-xl p-2.5 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold">
                            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            <span>Verified Premium: +25% for Organic Produce</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggestion Chips */}
                    {msg.suggestions && msg.suggestions.length > 0 && index === messages.length - 1 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-1 max-w-[90%]">
                        {msg.suggestions.map((suggestion, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(suggestion)}
                            className="bg-white dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700/60 rounded-full px-3 py-1 text-[11px] font-medium transition-all shadow-xs hover:scale-102 active:scale-98 text-left"
                          >
                            💡 {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#1E2920] border border-emerald-200 dark:border-emerald-800/40 rounded-2xl px-3.5 py-2.5 w-fit shadow-xs animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>AgroBot AI is analyzing your request...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Control Area */}
              <div className="p-3 bg-white dark:bg-[#18221A] border-t border-emerald-200/80 dark:border-emerald-800/40">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* Voice Microphone Toggle */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    title={isListening ? 'Stop Listening' : 'Voice Input (Speech-to-Text)'}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isListening
                        ? 'bg-red-500 text-white border-red-600 animate-bounce'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Input Box */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isListening
                        ? 'Listening... Speak now...'
                        : role === 'farmer'
                        ? 'Ask crop tips, mandi rates, or QR help...'
                        : 'Ask about organic trace, products, or mandi rates...'
                    }
                    className="flex-1 bg-emerald-50/50 dark:bg-[#131A14] text-emerald-950 dark:text-emerald-100 border border-emerald-300/80 dark:border-emerald-800/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 placeholder:text-emerald-700/40 dark:placeholder:text-emerald-400/40"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-emerald-800/60 dark:text-emerald-400/60 mt-2 px-1">
                  <span>Press Enter to send</span>
                  <span>AgroVerse AI Assistant v2.6</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
