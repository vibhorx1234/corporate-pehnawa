// File: ./backend/src/routes/addressRoutes.js

const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

// All address routes require authentication
router.use(protect);

// GET  /api/addresses
router.get('/', addressController.getAddresses);

// POST /api/addresses
router.post('/', addressController.addAddress);

// PATCH /api/addresses/:id
router.patch('/:id', addressController.updateAddress);

// PATCH /api/addresses/:id/set-default
router.patch('/:id/set-default', addressController.setDefaultAddress);

// DELETE /api/addresses/:id
router.delete('/:id', addressController.deleteAddress);

module.exports = router;