// File: ./frontend/src/utils/constants.js

// API Base URL - uses relative path in production, localhost in development
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  collections: '/collections',
  products: '/products',
  orders: '/orders',
  // blogs: '/blogs',
  contact: '/contact',
  // bulkEnquiry: '/bulk-enquiry',
};

// Size Options
export const SIZES = ['S', 'M', 'L', 'XL'];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Bulk Enquiry Status
// export const BULK_ENQUIRY_STATUS = {
//   PENDING: 'pending',
//   REVIEWED: 'reviewed',
//   QUOTED: 'quoted',
//   ACCEPTED: 'accepted',
//   REJECTED: 'rejected'
// };

// Size Type
export const SIZE_TYPE = {
  STANDARD: 'standard',
  CUSTOM: 'custom'
};

// Navigation Links
export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  // { name: 'Blog', path: '/blog' },
  // { name: 'Bulk Enquiry', path: '/bulk-enquiry' },
  { name: 'FAQs', path: '/faq' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/corporatepehnawa',
  instagram: 'https://instagram.com/corporatepehnawa',
  youtube: 'https://www.youtube.com/@CorporatePehnawa'
};

// Contact Information
export const CONTACT_INFO = {
  email: 'corporatepehnawa@gmail.com',
  phone: '+91 91662 13263',
  address: 'Jaipur, Rajasthan, India'
};

// Max file size for uploads (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types for payment screenshot
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];