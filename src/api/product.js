import api from './axios';

export const fetchProducts = () => api.get('/products');
export const fetchAllProducts = () => api.get('/products/all');
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (payload) => api.post('/products', payload);
export const updateProductById = (id, payload) => api.put(`/products/${id}`, payload);
export const deleteProductById = (id) => api.delete(`/products/${id}`);
