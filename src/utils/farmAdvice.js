// Small, rule-based field advice from a 7-day forecast. Kept pure so it can be tested.

export function currentSeason(date = new Date()) {
  const m = date.getMonth(); // 0 = Jan
  if (m >= 5 && m <= 9) return { name: 'Kharif', detail: 'Monsoon sowing season (Jun–Oct)' };
  if (m >= 3 && m <= 4) return { name: 'Zaid', detail: 'Short summer season (Apr–May)' };
  return { name: 'Rabi', detail: 'Winter sowing season (Nov–Mar)' };
}

/**
 * @param {{ current: {temperature: number, humidity: number, wind: number},
 *           days: Array<{date: string, max: number, min: number, rainChance: number, rainMm: number}> }} forecast
 * @returns {Array<{ tone: 'warn'|'good'|'info', title: string, body: string }>}
 */
export function adviceFromForecast(forecast) {
  if (!forecast?.days?.length) return [];
  const tips = [];
  const next2 = forecast.days.slice(0, 2);
  const rainSoon = next2.find((d) => d.rainChance >= 60 || d.rainMm >= 5);
  const hottest = Math.max(...forecast.days.slice(0, 3).map((d) => d.max));
  const { humidity = 0, temperature = 0, wind = 0 } = forecast.current || {};

  if (rainSoon) {
    tips.push({ tone: 'warn', title: 'Hold off spraying', body: `Rain is likely ${rainSoon === next2[0] ? 'today' : 'tomorrow'} (${rainSoon.rainChance}%). Neem or bio-pesticide sprays would wash off; plan them after the rain.` });
  }
  if (wind >= 20) {
    tips.push({ tone: 'warn', title: 'Too windy to spray', body: `Wind is around ${Math.round(wind)} km/h. Sprays will drift; wait for a calmer morning.` });
  }
  if (hottest >= 38) {
    tips.push({ tone: 'warn', title: 'Heat stress ahead', body: `Up to ${Math.round(hottest)}°C in the next 3 days. Irrigate early morning or evening and mulch to keep soil moisture in.` });
  }
  if (humidity >= 85 && temperature >= 20 && temperature <= 32) {
    tips.push({ tone: 'info', title: 'Watch for fungal disease', body: 'Warm and humid air favours blight and mildew. Check leaf undersides, and improve airflow between plants.' });
  }
  if (!tips.length) {
    tips.push({ tone: 'good', title: 'Good window for field work', body: 'No rain or heat stress expected in the next two days, so it is a good time for spraying, weeding or harvest.' });
  }
  return tips.slice(0, 3);
}
