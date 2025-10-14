// File: ./backend/src/utils/constants.js

// Order Status
exports.ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Bulk Enquiry Status
// exports.BULK_ENQUIRY_STATUS = {
//   PENDING: 'pending',
//   REVIEWED: 'reviewed',
//   QUOTED: 'quoted',
//   ACCEPTED: 'accepted',
//   REJECTED: 'rejected'
// };

// Size Options
exports.SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Size Type
exports.SIZE_TYPE = {
  STANDARD: 'standard',
  CUSTOM: 'custom'
};

// Allowed Image Types
exports.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Max File Size (5MB)
exports.MAX_FILE_SIZE = 5 * 1024 * 1024;

// Pagination
exports.DEFAULT_PAGE_LIMIT = 20;
exports.MAX_PAGE_LIMIT = 100;