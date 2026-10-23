// Daily mandi (APMC) prices from the Government of India Open Data Platform
// (Agmarknet feed). Needs a free key from https://data.gov.in -> DATA_GOV_API_KEY.
// These are conventional market prices; organic produce usually sells above them.
const RESOURCE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map();

// Shown only when no API key is configured, and always labelled as sample data.
const SAMPLE_RECORDS = [
  { commodity: "Wheat", variety: "Sharbati", market: "Indore", state: "Madhya Pradesh", modalPrice: 3100, minPrice: 2900, maxPrice: 3350 },
  { commodity: "Paddy(Dhan)(Basmati)", variety: "1121", market: "Karnal", state: "Haryana", modalPrice: 4300, minPrice: 4000, maxPrice: 4650 },
  { commodity: "Tomato", variety: "Local", market: "Kolar", state: "Karnataka", modalPrice: 1800, minPrice: 1200, maxPrice: 2400 },
  { commodity: "Turmeric", variety: "Finger", market: "Erode", state: "Tamil Nadu", modalPrice: 13500, minPrice: 12000, maxPrice: 15000 },
  { commodity: "Green Gram (Moong)(Whole)", variety: "Moong", market: "Jaipur", state: "Rajasthan", modalPrice: 8200, minPrice: 7800, maxPrice: 8600 },
  { commodity: "Onion", variety: "Red", market: "Lasalgaon", state: "Maharashtra", modalPrice: 2100, minPrice: 1600, maxPrice: 2500 },
];

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

async function getMandiPrices({ commodity, state, limit = 20 } = {}) {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    const filtered = SAMPLE_RECORDS.filter((r) =>
      (!commodity || r.commodity.toLowerCase().includes(commodity.toLowerCase())) &&
      (!state || r.state.toLowerCase() === state.toLowerCase()));
    return { source: "sample", unit: "₹ / quintal", records: filtered, updatedAt: null };
  }

  const key = JSON.stringify({ commodity, state, limit });
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;

  const url = new URL(RESOURCE_URL);
  url.searchParams.set("api-key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(Math.min(Number(limit) || 20, 100)));
  if (commodity) url.searchParams.set("filters[commodity]", commodity);
  if (state) url.searchParams.set("filters[state]", state);

  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`data.gov.in responded ${response.status}`);
  const body = await response.json();

  const records = (body.records || []).map((r) => ({
    commodity: r.commodity,
    variety: r.variety,
    market: r.market,
    district: r.district,
    state: r.state,
    arrivalDate: r.arrival_date,
    minPrice: toNumber(r.min_price),
    maxPrice: toNumber(r.max_price),
    modalPrice: toNumber(r.modal_price),
  }));

  const value = { source: "agmarknet", unit: "₹ / quintal", records, updatedAt: new Date().toISOString() };
  cache.set(key, { at: Date.now(), value });
  return value;
}

module.exports = { getMandiPrices };
