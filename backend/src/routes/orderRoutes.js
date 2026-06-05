// File: ./backend/src/routes/orderRoutes.js  (MODIFIED)
// Changes: Added cancellation endpoints POST /:id/cancel and GET /:id/cancellation

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const cancellationController = require('../controllers/cancellationController');
const multer = require('multer');
const { logOrderRequest } = require('../middleware/debugMiddleware');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const upload = multer();

// GET /api/orders/my
router.get('/my', protect, orderController.getMyOrders);

// GET /api/orders
router.get('/', orderController.getAllOrders);

// GET /api/orders/number/:orderNumber
router.get('/number/:orderNumber', orderController.getOrderByNumber);

// GET /api/orders/:id
router.get('/:id', optionalAuth, orderController.getOrderById);

// POST /api/orders
router.post('/', upload.none(), optionalAuth, logOrderRequest, orderController.createOrder);

// PATCH /api/orders/:id/status
router.patch('/:id/status', orderController.updateOrderStatus);

// POST /api/orders/:id/cancel  — user cancellation
router.post('/:id/cancel', protect, cancellationController.requestCancellation);

// GET /api/orders/:id/cancellation
router.get('/:id/cancellation', protect, cancellationController.getCancellationDetails);

// DELETE /api/orders/:id
router.delete('/:id', orderController.deleteOrder);

module.exports = router;