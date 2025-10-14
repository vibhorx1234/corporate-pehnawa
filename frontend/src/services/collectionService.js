// File: ./frontend/src/services/collectionService.js

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Get all collections
export const getAllCollections = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.collections, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get featured collections
export const getFeaturedCollections = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.collections, {
      params: { featured: true, active: true }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get collection by slug
export const getCollectionBySlug = async (slug) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.collections}/slug/${slug}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get collection by ID
export const getCollectionById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.collections}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};