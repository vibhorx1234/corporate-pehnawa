const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const multer = require('multer');
const { logOrderRequest } = require('../middleware/debugMiddleware');

// Create multer instance for parsing FormData without file storage
const upload = multer();

// GET all orders
router.get('/', orderController.getAllOrders);

// GET order by order number
router.get('/number/:orderNumber', orderController.getOrderByNumber);

// GET order by ID
router.get('/:id', orderController.getOrderById);

// POST create new order (parse FormData but no file upload)
router.post('/', 
  upload.none(), // This parses FormData without expecting files
  logOrderRequest,
  orderController.createOrder
);

// PATCH update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// DELETE order
router.delete('/:id', orderController.deleteOrder);

module.exports = router;