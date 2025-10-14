// // File: ./frontend/src/services/bulkEnquiryService.js

// import api from './api';
// import { API_ENDPOINTS } from '../utils/constants';

// // Create bulk enquiry
// export const createBulkEnquiry = async (enquiryData) => {
//   try {
//     const response = await api.post(API_ENDPOINTS.bulkEnquiry, enquiryData);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// // Get bulk enquiry by enquiry number
// export const getBulkEnquiryByNumber = async (enquiryNumber) => {
//   try {
//     const response = await api.get(`${API_ENDPOINTS.bulkEnquiry}/number/${enquiryNumber}`);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };