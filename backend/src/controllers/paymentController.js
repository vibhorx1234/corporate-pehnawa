const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const emailService = require('../services/emailService');

function getRazorpay() {                  // ← runs only when called
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const razorpay = getRazorpay();

/**
 * POST /api/payments/create-order
 */
exports.createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name images price discountedPrice inStock'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    const outOfStock = cart.items.filter((item) => !item.product?.inStock);
    if (outOfStock.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Out of stock: ${outOfStock.map((i) => i.productName).join(', ')}`,
      });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Razorpay requires amount in paise (multiply by 100)
    const amountInPaise = Math.round(totalAmount * 100);

    if (amountInPaise < 100) {
      return res.status(400).json({ success: false, message: 'Order amount is too low.' });
    }

    const receipt = 'CP' + Date.now() + Math.floor(Math.random() * 1000);

    console.log('\n========= Creating Razorpay Order =========');
    console.log('Receipt:', receipt);
    console.log('User:', req.user.email);
    console.log('Amount (paise):', amountInPaise);
    console.log('===========================================\n');

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
    });

    console.log('\n========= Razorpay Order Created =========');
    console.log(JSON.stringify(rzpOrder, null, 2));
    console.log('==========================================\n');

    return res.status(200).json({
      success: true,
      orderId: rzpOrder.id,         // rzp_order_id — sent to frontend
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (error) {
    console.error('Create Payment Order Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order.',
      error: error?.error || error?.message || error,
    });
  }
};

/**
 * POST /api/payments/verify
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
      notes,
    } = req.body;

    console.log('\n========= VERIFY PAYMENT =========');
    console.log('Razorpay Order ID :', razorpay_order_id);
    console.log('Razorpay Payment ID:', razorpay_payment_id);
    console.log('==================================\n');

    // ── 1. Validate required fields ──────────────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment fields.' });
    }

    // ── 2. Verify HMAC-SHA256 signature ──────────────────────────────────────
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch!');
      return res.status(400).json({ success: false, message: 'Payment verification failed: signature mismatch.' });
    }

    console.log('Signature verified ✓');

    // ── 3. Idempotency — prevent duplicate orders ─────────────────────────────
    const existingOrder = await Order.findOne({
      'payment.razorpayOrderId': razorpay_order_id,
    });

    if (existingOrder) {
      console.log('Order already exists:', existingOrder._id);
      return res.status(200).json({ success: true, message: 'Order already exists.', data: existingOrder });
    }

    // ── 4. Build order from cart ──────────────────────────────────────────────
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name images price discountedPrice inStock'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      productName: item.productName,
      productImage: item.productImage,
      price: item.price,
      quantity: item.quantity,
      sizeType: item.sizeType,
      standardSize: item.standardSize,
      customMeasurements: item.customMeasurements,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ── 5. Persist order ──────────────────────────────────────────────────────
    const order = await Order.create({
      user: req.user._id,
      customerName: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      items,
      shippingAddress,
      totalAmount,
      notes,
      status: 'confirmed',
      paymentStatus: 'paid',
      payment: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
        status: 'paid',
      },
    });

    console.log('Order Created:', order._id);

    // ── 6. Clear cart ─────────────────────────────────────────────────────────
    try {
      cart.items = [];
      await cart.save();
      console.log('Cart cleared.');
    } catch (err) {
      console.error('Cart clear failed:', err.message);
    }

    // ── 7. Send emails ────────────────────────────────────────────────────────
    try {
      await emailService.sendPaymentConfirmation(order);
      console.log('Payment confirmation email sent.');
    } catch (err) {
      console.error('Confirmation email failed:', err.message);
    }

    try {
      await emailService.sendOrderNotificationToAdmin(order);
      console.log('Admin notification email sent.');
    } catch (err) {
      console.error('Admin email failed:', err.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      data: order,
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed.',
      error: error?.message || error,
    });
  }
};