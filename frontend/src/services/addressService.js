// File: ./frontend/src/services/addressService.js

import api from './api';

const addressService = {
  getAll: () => api.get('/addresses'),
  add: (data) => api.post('/addresses', data),
  update: (id, data) => api.patch(`/addresses/${id}`, data),
  setDefault: (id) => api.patch(`/addresses/${id}/set-default`),
  remove: (id) => api.delete(`/addresses/${id}`)
};

export default addressService;