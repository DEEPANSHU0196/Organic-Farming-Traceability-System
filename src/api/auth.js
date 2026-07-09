import api from './axios';

export const loginUser = (payload) => api.post('/auth/login', payload);
export const registerUser = (payload, portal) => api.post(`/auth/register/${portal}`, payload);
export const getProfile = () => api.get('/users/profile');
