// ============================================
// File: ./backend/src/routes/contactRoutes.js
// ============================================

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// Validation rules for contact form
const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 3 }).withMessage('Subject must be at least 3 characters'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
];

// POST create new contact submission
router.post('/', validateContact, handleValidationErrors, contactController.createContact);

// GET all contacts (for admin)
// router.get('/', contactController.getAllContacts);

// PATCH update contact status (for admin)
// router.patch('/:id/status', contactController.updateContactStatus);

module.exports = router;