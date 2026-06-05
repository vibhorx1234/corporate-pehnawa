// File: ./backend/src/controllers/cancellationController.js  (NEW)

const Order = require('../models/Order');
const emailService = require('../services/emailService');

const PROCESSING_FEE_PERCENT = 2; // 2% of totalAmount

// POST /api/orders/:id/cancel  (protected — user must own the order)
exports.requestCancellation = async (req, res) => {
  try {
    const { reason, upiId } = req.body;

    if (!upiId || !upiId.trim()) {
      return res.status(400).json({ success: false, message: 'UPI ID is required for refund.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Only the owner can cancel
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Only cancellable if not yet shipped/delivered
    const nonCancellable = ['shipped', 'delivered', 'cancelled'];
    if (nonCancellable.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled once it is ${order.status}.`
      });
    }

    // Calculate refund
    const processingFee = parseFloat((order.totalAmount * PROCESSING_FEE_PERCENT / 100).toFixed(2));
    const refundAmount = parseFloat((order.totalAmount - processingFee).toFixed(2));

    order.status = 'cancelled';
    order.cancellation = {
      requestedAt: new Date(),
      reason: reason || 'Customer requested cancellation',
      upiId: upiId.trim(),
      processingFee,
      refundAmount,
      refundStatus: 'pending'
    };

    await order.save();

    // Send cancellation email to customer
    try {
      await emailService.sendCancellationConfirmation(order);
    } catch (e) {
      console.error('Cancellation email failed:', e.message);
    }

    // Notify admin
    try {
      await emailService.sendCancellationNotificationToAdmin(order);
    } catch (e) {
      console.error('Admin cancellation email failed:', e.message);
    }

    res.status(200).json({
      success: true,
      message: 'Cancellation request submitted successfully.',
      data: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        processingFee,
        refundAmount,
        upiId: order.cancellation.upiId,
        refundStatus: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing cancellation.', error: error.message });
  }
};

// GET /api/orders/:id/cancellation  (protected)
exports.getCancellationDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select('orderNumber totalAmount status cancellation');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cancellation details.', error: error.message });
  }
};