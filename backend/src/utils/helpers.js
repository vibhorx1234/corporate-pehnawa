// File: ./backend/src/utils/helpers.js

// Generate unique order number
exports.generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `CP${timestamp}${random}`;
};

// Generate unique enquiry number
exports.generateEnquiryNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `BE${timestamp}${random}`;
};

// Format date for display
exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format price with currency
exports.formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

// Create slug from text
exports.createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Sanitize user input
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Check if email is valid
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if phone is valid (Indian format)
exports.isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Check if pincode is valid (Indian format)
exports.isValidPincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Calculate total from products array
exports.calculateTotal = (products) => {
  return products.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// Remove file extension
exports.removeExtension = (filename) => {
  return filename.replace(/\.[^/.]+$/, '');
};

// Get file extension
exports.getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};