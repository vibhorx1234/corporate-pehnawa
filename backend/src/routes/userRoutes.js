// File: ./backend/src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes below are protected
router.use(protect);

// GET  /api/users/profile
router.get('/profile', userController.getProfile);

// PATCH /api/users/profile
router.patch('/profile', userController.updateProfile);

// PATCH /api/users/change-password
router.patch('/change-password', userController.changePassword);

// GET  /api/users/orders  — order history
router.get('/orders', userController.getMyOrders);

module.exports = router;