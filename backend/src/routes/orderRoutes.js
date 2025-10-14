// File: ./backend/src/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const upload = require('../config/multer');

// GET all orders
router.get('/', orderController.getAllOrders);

// GET order by order number
router.get('/number/:orderNumber', orderController.getOrderByNumber);

// GET order by ID
router.get('/:id', orderController.getOrderById);

// POST create new order (with file upload)
router.post('/', upload.single('paymentScreenshot'), orderController.createOrder);

// PATCH update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// DELETE order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;