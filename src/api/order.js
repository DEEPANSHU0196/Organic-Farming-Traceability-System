import api from './axios';

export const createOrder = (payload) => api.post('/orders', payload);
export const fetchBuyerOrders = () => api.get('/orders/my');
export const fetchFarmerOrders = () => api.get('/orders/farmer');
export const updateFarmerOrderStatus = (id, payload) => api.put(`/orders/farmer/${id}`, payload);
export const fetchAllOrders = () => api.get('/orders');
