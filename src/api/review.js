import api from './axios';

export const addReview = (payload) => api.post('/reviews', payload);
export const fetchAllReviews = () => api.get('/reviews');
export const fetchProductReviews = (productId) => api.get(`/reviews/product/${productId}`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
