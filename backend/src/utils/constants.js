// File: ./backend/src/utils/constants.js  (MODIFIED)
// Changes: Added USER_ROLES, PAYMENT_STATUS, MAX_CART_ITEM_QUANTITY at the bottom.
// All original exports are unchanged.

// Order Status
exports.ORDER_STATUS = {
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Size Options
exports.SIZES = ['S', 'M', 'L', 'XL'];

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

// ─── NEW ──────────────────────────────────────────────────────────────────

// User Roles
exports.USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

// Payment Status
exports.PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Cart
exports.MAX_CART_ITEM_QUANTITY = 10;