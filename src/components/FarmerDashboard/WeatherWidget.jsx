import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, Info, LocateFixed, MapPin, Snowflake, Sun, ThumbsUp, Wind } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adviceFromForecast } from '../../utils/farmAdvice';
import { Skeleton } from '../../shared/ui';

// Open-Meteo: free, no API key, CORS-enabled.
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const PLACE_KEY = 'agroverse-weather-place';

// WMO weather codes → icon + label
function describe(code) {
  if (code === 0) return { icon: Sun, label: 'Clear' };
  if (code <= 2) return { icon: CloudSun, label: 'Partly cloudy' };
  if (code === 3) return { icon: Cloud, label: 'Overcast' };
  if (code <= 48) return { icon: CloudFog, label: 'Fog' };
  if (code <= 57) return { icon: CloudDrizzle, label: 'Drizzle' };
  if (code <= 67 || (code >= 80 && code <= 82)) return { icon: CloudRain, label: 'Rain' };
  if (code <= 77 || code === 85 || code === 86) return { icon: Snowflake, label: 'Snow' };
  return { icon: CloudLightning, label: 'Thunderstorm' };
}

const TIP_STYLE = {
  warn: { icon: AlertTriangle, className: 'bg-amber-50 text-amber-900 border-amber-200' },
  info: { icon: Info, className: 'bg-sky-50 text-sky-900 border-sky-200' },
  good: { icon: ThumbsUp, className: 'bg-leaf-light text-leaf border-leaf/20' },
};

async function geocode(place) {
  // Try the full text first, then just the first part ("Gurdaspur, Punjab" → "Gurdaspur").
  for (const name of [place, place.split(',')[0]]) {
    const url = `${GEOCODE_URL}?name=${encodeURIComponent(name.trim())}&count=1&language=en&format=json&countryCode=IN`;
    const res = await fetch(url);
    const body = await res.json();
    if (body.results?.length) {
      const r = body.results[0];
      return { lat: r.latitude, lon: r.longitude, label: [r.name, r.admin1].filter(Boolean).join(', ') };
    }
  }
  throw new Error('place-not-found');
}

async function loadForecast({ lat, lon }) {
  const params = new URLSearchParams({
    latitude: lat, longitude: lon, timezone: 'Asia/Kolkata', forecast_days: '7',
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum',
  });
  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) throw new Error('forecast-failed');
  const b = await res.json();
  return {
    current: { temperature: b.current.temperature_2m, humidity: b.current.relative_humidity_2m, wind: b.current.wind_speed_10m, code: b.current.weather_code },
    days: b.daily.time.map((date, i) => ({
      date,
      code: b.daily.weather_code[i],
      max: b.daily.temperature_2m_max[i],
      min: b.daily.temperature_2m_min[i],
      rainChance: b.daily.precipitation_probability_max[i] ?? 0,
      rainMm: b.daily.precipitation_sum[i] ?? 0,
    })),
  };
}

export default function WeatherWidget() {
  const { user } = useAuth();
  const [place, setPlace] = useState(() => {
    try { return localStorage.getItem(PLACE_KEY) || user?.address || ''; } catch { return user?.address || ''; }
  });
  const [draft, setDraft] = useState('');
  const [state, setState] = useState({ status: place ? 'loading' : 'needs-place' });

  const run = useCallback(async (coordsOrPlace) => {
    setState({ status: 'loading' });
    try {
      const loc = typeof coordsOrPlace === 'string' ? await geocode(coordsOrPlace) : coordsOrPlace;
      const forecast = await loadForecast(loc);
      setState({ status: 'ready', label: loc.label, forecast });
    } catch (err) {
      setState({ status: err.message === 'place-not-found' ? 'not-found' : 'error' });
    }
  }, []);

  useEffect(() => { if (place) run(place); }, [place, run]);

  const savePlace = (value) => {
    const v = value.trim();
    if (!v) return;
    try { localStorage.setItem(PLACE_KEY, v); } catch { /* ignore */ }
    setPlace(v);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setState({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      (pos) => run({ lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' }),
      () => setState({ status: 'needs-place' }),
      { timeout: 10000 },
    );
  };

  const PlaceForm = (
    <form onSubmit={(e) => { e.preventDefault(); savePlace(draft); }} className="mt-4 flex flex-wrap gap-2">
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Village / town, e.g. Gurdaspur" aria-label="Your farm's town" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink" />
      <button type="submit" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-paper">Show weather</button>
      <button type="button" onClick={useMyLocation} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700"><LocateFixed size={15} /> Use my location</button>
    </form>
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="weather-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="weather-title" className="text-lg font-bold text-slate-900">Weather & field advice</h2>
          {state.status === 'ready' && (
            <button type="button" onClick={() => setState({ status: 'needs-place' })} className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800">
              <MapPin size={12} /> {state.label} · change
            </button>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Open-Meteo</span>
      </div>

      {state.status === 'loading' && (
        <div className="mt-5 space-y-3" role="status" aria-label="Loading forecast">
          <Skeleton className="h-16" /><div className="grid grid-cols-7 gap-2">{Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-20" />)}</div>
        </div>
      )}
      {(state.status === 'needs-place' || state.status === 'not-found' || state.status === 'error') && (
        <div className="mt-3">
          <p className="text-sm text-slate-600">
            {state.status === 'needs-place' && 'Where is your farm? We’ll show the 7-day forecast and what it means for spraying and irrigation.'}
            {state.status === 'not-found' && 'We couldn’t find that place. Try the nearest town name.'}
            {state.status === 'error' && 'The forecast service didn’t respond. Check your connection and try again.'}
          </p>
          {PlaceForm}
        </div>
      )}

      {state.status === 'ready' && (() => {
        const { current, days } = state.forecast;
        const now = describe(current.code);
        const NowIcon = now.icon;
        const tips = adviceFromForecast(state.forecast);
        return (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-3">
                <motion.span initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <NowIcon size={30} />
                </motion.span>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{Math.round(current.temperature)}°C</p>
                  <p className="text-sm text-slate-500">{now.label}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><Droplets size={15} className="text-sky-500" />{current.humidity}%</span>
                <span className="flex items-center gap-1.5"><Wind size={15} className="text-slate-400" />{Math.round(current.wind)} km/h</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1.5">
              {days.map((d, i) => {
                const { icon: Icon, label } = describe(d.code);
                return (
                  <motion.div
                    key={d.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex flex-col items-center rounded-xl px-1 py-2.5 text-center ${i === 0 ? 'bg-slate-100' : ''}`}
                    title={`${label}, ${d.rainChance}% chance of rain`}
                  >
                    <span className="text-[11px] font-semibold text-slate-500">{i === 0 ? 'Today' : new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                    <Icon size={20} className="my-1.5 text-slate-600" />
                    <span className="text-xs font-bold text-slate-900">{Math.round(d.max)}°</span>
                    <span className="text-[11px] text-slate-400">{Math.round(d.min)}°</span>
                    {d.rainChance >= 30 && <span className="mt-1 text-[10px] font-semibold text-sky-600">{d.rainChance}%</span>}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 space-y-2">
              <AnimatePresence>
                {tips.map((tip, i) => {
                  const { icon: TipIcon, className } = TIP_STYLE[tip.tone];
                  return (
                    <motion.div key={tip.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className={`flex gap-3 rounded-xl border px-3.5 py-3 ${className}`}>
                      <TipIcon size={17} className="mt-0.5 shrink-0" />
                      <div><p className="text-sm font-semibold">{tip.title}</p><p className="text-xs leading-relaxed opacity-80">{tip.body}</p></div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        );
      })()}
    </section>
  );
}
