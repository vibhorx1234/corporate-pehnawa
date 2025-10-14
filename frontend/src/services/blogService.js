// File: ./frontend/src/services/blogService.js

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// Get all published blogs
export const getAllBlogs = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.blogs, {
      params: { ...params, published: true }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get recent blogs
export const getRecentBlogs = async (limit = 5) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.blogs}/recent`, {
      params: { limit }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Get blog by slug
export const getBlogBySlug = async (slug) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.blogs}/slug/${slug}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Get blog by ID
export const getBlogById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.blogs}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};