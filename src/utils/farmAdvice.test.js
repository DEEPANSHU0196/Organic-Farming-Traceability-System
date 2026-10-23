import test from 'node:test';
import assert from 'node:assert/strict';
import { adviceFromForecast, currentSeason } from './farmAdvice.js';

const day = (over = {}) => ({ date: '2026-07-01', max: 32, min: 24, rainChance: 10, rainMm: 0, ...over });

test('season follows the Indian cropping calendar', () => {
  assert.equal(currentSeason(new Date('2026-07-15')).name, 'Kharif');
  assert.equal(currentSeason(new Date('2026-01-10')).name, 'Rabi');
  assert.equal(currentSeason(new Date('2026-04-20')).name, 'Zaid');
});

test('warns against spraying when rain is near', () => {
  const tips = adviceFromForecast({ current: { temperature: 28, humidity: 60, wind: 5 }, days: [day(), day({ rainChance: 80 })] });
  assert.equal(tips[0].title, 'Hold off spraying');
  assert.match(tips[0].body, /tomorrow/);
});

test('flags heat stress and wind', () => {
  const tips = adviceFromForecast({ current: { temperature: 36, humidity: 30, wind: 25 }, days: [day({ max: 41 }), day(), day()] });
  const titles = tips.map((t) => t.title);
  assert.ok(titles.includes('Too windy to spray'));
  assert.ok(titles.includes('Heat stress ahead'));
});

test('gives a positive tip on calm days', () => {
  const tips = adviceFromForecast({ current: { temperature: 26, humidity: 55, wind: 6 }, days: [day(), day()] });
  assert.deepEqual(tips.map((t) => t.tone), ['good']);
});

test('returns nothing without forecast data', () => {
  assert.deepEqual(adviceFromForecast(null), []);
});
