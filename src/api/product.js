import api from './axios';

const isFormData = (payload) => payload instanceof FormData;

export const fetchProducts = () => api.get('/products');
export const fetchAllProducts = () => api.get('/products/all');
export const fetchProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (payload) => {
  if (isFormData(payload)) {
    return api.post('/products', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  return api.post('/products', payload);
};
export const updateProductById = (id, payload) => {
  if (isFormData(payload)) {
    return api.put(`/products/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  return api.put(`/products/${id}`, payload);
};
export const deleteProductById = (id) => api.delete(`/products/${id}`);
