// File: ./frontend/src/services/cartService.js

import api from './api';

const cartService = {
  getCart: (token) => api.get('/cart', {
    headers: { Authorization: `Bearer ${token}` }
  }),

  addItem: (token, { productId, quantity, sizeType, standardSize, customMeasurements }) =>
    api.post('/cart/items', { productId, quantity, sizeType, standardSize, customMeasurements }, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  updateItem: (token, itemId, quantity) =>
    api.patch(`/cart/items/${itemId}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  removeItem: (token, itemId) =>
    api.delete(`/cart/items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),

  clearCart: (token) =>
    api.delete('/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
};

export default cartService;