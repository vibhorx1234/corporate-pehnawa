// File: ./frontend/src/utils/constants.js  (MODIFIED)
// Changes: Added new API endpoints for auth, cart, addresses, users.
// All original exports are unchanged.

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  collections: '/collections',
  products: '/products',
  orders: '/orders',
  contact: '/contact',
  // NEW
  auth: '/auth',
  cart: '/cart',
  addresses: '/addresses',
  users: '/users',
};

// Size Options
export const SIZES = ['S', 'M', 'L', 'XL'];

// Order Status
export const ORDER_STATUS = {
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Size Type
export const SIZE_TYPE = {
  STANDARD: 'standard',
  CUSTOM: 'custom'
};

// NEW: Cart
export const MAX_CART_QUANTITY = 10;

// Navigation Links — unchanged
export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  { name: 'FAQs', path: '/faq' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

// Social Media Links — unchanged
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/corporatepehnawa',
  instagram: 'https://instagram.com/corporatepehnawa',
  youtube: 'https://www.youtube.com/@CorporatePehnawa'
};

// Contact Information — unchanged
export const CONTACT_INFO = {
  email: 'corporatepehnawa@gmail.com',
  phone: '+91 91662 13263',
  address: 'Jaipur, Rajasthan, India'
};