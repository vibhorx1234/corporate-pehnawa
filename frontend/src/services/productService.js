// File: ./frontend/src/services/productService.js

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Get all products
export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.products, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.products, {
      params: { featured: true, inStock: true }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get products by collection
export const getProductsByCollection = async (collectionSlug) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.products}/collection/${collectionSlug}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get product by slug
export const getProductBySlug = async (slug) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.products}/slug/${slug}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.products}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};