import api from './axios';

// Unauthenticated endpoints used by the landing page, trace pages and profiles.
export const getPlatformStats = () => api.get('/public/stats').then((r) => r.data.stats);
export const sendContactMessage = (payload) => api.post('/public/contact', payload).then((r) => r.data);
export const getMandiPrices = (params = {}) => api.get('/public/mandi', { params }).then((r) => r.data);
export const getFarmerProfile = (id) => api.get(`/public/farmers/${id}`).then((r) => r.data);
