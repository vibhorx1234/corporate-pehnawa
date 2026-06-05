// File: ./frontend/src/services/orderService.js  (MODIFIED)
// Changes: checkout() now includes UTM params from sessionStorage

import api from './api';
import { getStoredUTM, clearUTM } from '../utils/utmTracker';

const orderService = {
  // Legacy single-product FormData order (unchanged)
  createOrder: (formData) => api.post('/orders', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Cart-based checkout — includes UTM if captured
  checkout: async (shippingAddress, notes) => {
    const utm = getStoredUTM();
    const res = await api.post('/orders', { shippingAddress, notes, ...(utm ? { utm } : {}) });
    clearUTM(); // clear after successful order
    return res;
  },

  // User's own orders
  getMyOrders: () => api.get('/orders/my'),

  getOrderById: (id) => api.get(`/orders/${id}`),
  getOrderByNumber: (orderNumber) => api.get(`/orders/number/${orderNumber}`),
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/orders/${id}`),

  // Cancellation
  cancelOrder: (id, reason, upiId) => api.post(`/orders/${id}/cancel`, { reason, upiId }),
  getCancellationDetails: (id) => api.get(`/orders/${id}/cancellation`)
};

export default orderService;