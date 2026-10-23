import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getLanguage } from '../i18n/languages';

// Whole-app translation is done by the Google Translate engine, driven by our own
// picker. It translates every page (landing, dashboards, chatbot replies) without
// having to hand-maintain 24 dictionaries for ~20k lines of UI.
const STORAGE_KEY = 'agroverse-lang';
const SCRIPT_ID = 'google-translate-script';

const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  } catch {
    return 'en';
  }
}

function setTranslateCookie(gtCode) {
  const value = gtCode === 'en' ? '' : `/en/${gtCode}`;
  const expiry = gtCode === 'en' ? 'Thu, 01 Jan 1970 00:00:00 GMT' : 'Fri, 31 Dec 2099 23:59:59 GMT';
  document.cookie = `googtrans=${value}; expires=${expiry}; path=/`;
  document.cookie = `googtrans=${value}; expires=${expiry}; path=/; domain=${window.location.hostname}`;
}

function loadTranslateEngine() {
  if (document.getElementById(SCRIPT_ID)) return;
  window.googleTranslateElementInit = () => {
    // eslint-disable-next-line no-new
    new window.google.translate.TranslateElement(
      { pageLanguage: 'en', autoDisplay: false },
      'google_translate_element',
    );
  };
  const host = document.createElement('div');
  host.id = 'google_translate_element';
  host.style.display = 'none';
  document.body.appendChild(host);
  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
}

function applyToCombo(gtCode, attempt = 0) {
  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    combo.value = gtCode === 'en' ? '' : gtCode;
    combo.dispatchEvent(new Event('change'));
    return;
  }
  if (attempt < 40) window.setTimeout(() => applyToCombo(gtCode, attempt + 1), 150);
}

export function LanguageProvider({ children }) {
  const [code, setCode] = useState(readStoredLanguage);
  const language = getLanguage(code);

  useEffect(() => {
    setTranslateCookie(language.gt);
    loadTranslateEngine();
    if (language.code !== 'en') applyToCombo(language.gt);
    // Run once on mount; later changes go through changeLanguage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
  }, [language]);

  const changeLanguage = useCallback((nextCode) => {
    const next = getLanguage(nextCode);
    try {
      localStorage.setItem(STORAGE_KEY, next.code);
    } catch {
      /* storage unavailable: language still applies for this session */
    }
    setTranslateCookie(next.gt);
    setCode(next.code);
    if (next.code === 'en') {
      // Google's engine cannot cleanly restore the original text; reload instead.
      window.location.reload();
      return;
    }
    applyToCombo(next.gt);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
