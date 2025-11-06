// File: ./frontend/src/services/orderService.js

import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

// Create order with file upload
export const createOrder = async (orderData) => {
  try {
    const formData = new FormData();
    
    // Append basic customer data
    formData.append('customerName', orderData.customerName);
    formData.append('email', orderData.email);
    formData.append('phone', orderData.phone);
    
    // FIXED: Append address fields individually instead of JSON.stringify
    formData.append('address[street]', orderData.address.street);
    formData.append('address[city]', orderData.address.city);
    formData.append('address[state]', orderData.address.state);
    formData.append('address[pincode]', orderData.address.pincode);
    formData.append('address[country]', orderData.address.country || 'India');
    
    // Append product data
    formData.append('product', orderData.product);
    formData.append('productName', orderData.productName);
    formData.append('quantity', orderData.quantity);
    formData.append('sizeType', orderData.sizeType);
    
    // Append size data based on type
    if (orderData.sizeType === 'standard') {
      formData.append('standardSize', orderData.standardSize);
    } else if (orderData.sizeType === 'custom') {
      // FIXED: Append custom measurements individually
      formData.append('customMeasurements[bust]', orderData.customMeasurements.bust || '');
      // formData.append('customMeasurements[length]', orderData.customMeasurements.length || '');
      formData.append('customMeasurements[waist]', orderData.customMeasurements.waist || '');
      // formData.append('customMeasurements[shoulder]', orderData.customMeasurements.shoulder || '');
    }
    
    formData.append('totalAmount', orderData.totalAmount);
    
    if (orderData.notes) {
      formData.append('notes', orderData.notes);
    }
    
    // Append payment screenshot file
    if (orderData.paymentScreenshot) {
      formData.append('paymentScreenshot', orderData.paymentScreenshot);
    }
    
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.orders}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get order by order number
export const getOrderByNumber = async (orderNumber) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.orders}/number/${orderNumber}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};