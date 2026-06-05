// File: ./backend/src/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(protect);

// GET  /api/cart
router.get('/', cartController.getCart);

// POST /api/cart/items
router.post('/items', cartController.addItem);

// PATCH /api/cart/items/:itemId
router.patch('/items/:itemId', cartController.updateItem);

// DELETE /api/cart/items/:itemId
router.delete('/items/:itemId', cartController.removeItem);

// DELETE /api/cart  — clear entire cart
router.delete('/', cartController.clearCart);

module.exports = router;