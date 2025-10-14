// File: ./backend/src/middleware/validation.js

const { body, validationResult } = require('express-validator');

// Validation error handler
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Order validation rules
exports.validateOrder = [
  body('customerName')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  
  body('address.street')
    .trim()
    .notEmpty().withMessage('Street address is required'),
  
  body('address.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  
  body('address.state')
    .trim()
    .notEmpty().withMessage('State is required'),
  
  body('address.pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/).withMessage('Invalid pincode'),
  
  body('product')
    .notEmpty().withMessage('Product is required'),
  
  body('productName')
    .trim()
    .notEmpty().withMessage('Product name is required'),
  
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  
  body('sizeType')
    .isIn(['standard', 'custom']).withMessage('Invalid size type'),
  
  body('totalAmount')
    .isFloat({ min: 0 }).withMessage('Invalid total amount')
];

// Bulk enquiry validation rules
// exports.validateBulkEnquiry = [
//   body('companyName')
//     .trim()
//     .notEmpty().withMessage('Company name is required')
//     .isLength({ min: 2 }).withMessage('Company name must be at least 2 characters'),
  
//   body('contactPerson')
//     .trim()
//     .notEmpty().withMessage('Contact person name is required')
//     .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
//   body('email')
//     .trim()
//     .notEmpty().withMessage('Email is required')
//     .isEmail().withMessage('Invalid email address'),
  
//   body('phone')
//     .trim()
//     .notEmpty().withMessage('Phone number is required')
//     .matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  
//   body('products')
//     .isArray({ min: 1 }).withMessage('At least one product is required'),
  
//   body('totalQuantity')
//     .isInt({ min: 1 }).withMessage('Total quantity must be at least 1')
// ];

// Collection validation rules
exports.validateCollection = [
  body('name')
    .trim()
    .notEmpty().withMessage('Collection name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  
  body('thumbnail')
    .trim()
    .notEmpty().withMessage('Thumbnail is required')
];

// Product validation rules
exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  
  body('price')
    .isFloat({ min: 0 }).withMessage('Invalid price'),
  
  body('images')
    .isArray({ min: 1 }).withMessage('At least one image is required'),
  
  body('collection')
    .notEmpty().withMessage('Collection is required')
];

// Blog validation rules
exports.validateBlog = [
  body('title')
    .trim()
    .notEmpty().withMessage('Blog title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  
  body('excerpt')
    .trim()
    .notEmpty().withMessage('Excerpt is required')
    .isLength({ max: 300 }).withMessage('Excerpt must not exceed 300 characters'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
  
  body('featuredImage')
    .trim()
    .notEmpty().withMessage('Featured image is required')
];