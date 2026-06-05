// File: ./backend/src/routes/adminRoutes.js  (NEW)

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// All admin routes require auth + admin role
router.use(protect);
router.use(restrictTo('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboardSummary);

// Orders
router.get('/orders', adminController.getAllOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);
router.patch('/orders/:id/refund-status', adminController.updateRefundStatus);

// Analytics
router.get('/analytics/revenue', adminController.getRevenueAnalytics);
router.get('/analytics/customers', adminController.getCustomerAnalytics);

// Customers
router.get('/customers', adminController.getCustomers);
router.get('/customers/:id', adminController.getCustomerDetail);

// Abandoned carts
router.get('/abandoned-carts', adminController.getAbandonedCarts);

router.get('/analytics/ga4', adminController.getGA4Analytics);

module.exports = router;