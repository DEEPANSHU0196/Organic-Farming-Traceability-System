import api from './axios';

export const getMyShipments = () => api.get('/shipments/my');
export const updateShipment = (id, payload) => api.put(`/shipments/${id}`, payload);
export const createShipment = (payload) => api.post('/shipments', payload);
export const assignDriver = (id, payload) => api.put(`/shipments/${id}/assign-driver`, payload);
