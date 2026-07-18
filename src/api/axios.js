import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agroverse_token');

  // ── DIAGNOSTIC LOGGING (remove after bug is confirmed fixed) ──────────────
  console.debug(
    `[axios interceptor] ${config.method?.toUpperCase()} ${config.url}`,
    token
      ? `✅ token found → Authorization header attached`
      : `❌ NO TOKEN in localStorage("agroverse_token") — request will be unauthenticated`,
  );
  // ─────────────────────────────────────────────────────────────────────────

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  console.error('[axios interceptor] Request error:', error);
  return Promise.reject(error);
});

export default api;
