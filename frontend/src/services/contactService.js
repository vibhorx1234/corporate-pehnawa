// ============================================
// File: ./frontend/src/services/contactService.js
// ============================================

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

// Submit contact form
export const submitContactForm = async (contactData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.contact}`,
      contactData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};