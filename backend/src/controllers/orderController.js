const Order = require('../models/Order');
const Cart = require('../models/Cart');
const emailService = require('../services/emailService');

const parseFormData = (body) => {
  const parsed = { ...body };

  if (body['address[street]']) {
    parsed.address = {
      street: body['address[street]'],
      city: body['address[city]'],
      state: body['address[state]'],
      pincode: body['address[pincode]'],
      country: body['address[country]'] || 'India'
    };
    ['street', 'city', 'state', 'pincode', 'country'].forEach(f => delete parsed[`address[${f}]`]);
  }

  if (body['customMeasurements[bust]']) {
    parsed.customMeasurements = {
      bust: parseFloat(body['customMeasurements[bust]']) || 0,
      waist: parseFloat(body['customMeasurements[waist]']) || 0
    };
    delete parsed['customMeasurements[bust]'];
    delete parsed['customMeasurements[waist]'];
  }

  if (parsed.quantity) parsed.quantity = parseInt(parsed.quantity);
  if (parsed.totalAmount) parsed.totalAmount = parseFloat(parsed.totalAmount);

  return parsed;
};

exports.createOrder = async (req, res) => {
  try {
    // Legacy single-product FormData only
    // Cart-based checkout is handled by paymentController
    console.log('📥 Received legacy order request');
    const parsedBody = parseFormData(req.body);

    if (parsedBody.address && !parsedBody.shippingAddress) {
      parsedBody.shippingAddress = parsedBody.address;
      delete parsedBody.address;
    }

    if (parsedBody.product && !parsedBody.items) {
      parsedBody.items = [{
        product: parsedBody.product,
        productName: parsedBody.productName,
        price: parsedBody.totalAmount / (parsedBody.quantity || 1),
        quantity: parsedBody.quantity || 1,
        sizeType: parsedBody.sizeType,
        standardSize: parsedBody.standardSize,
        customMeasurements: parsedBody.customMeasurements
      }];
      delete parsedBody.product;
      delete parsedBody.productName;
      delete parsedBody.sizeType;
      delete parsedBody.standardSize;
      delete parsedBody.customMeasurements;
    }

    const order = await Order.create(parsedBody);
    const populatedOrder = await Order.findById(order._id).populate('items.product');

    try {
      await emailService.sendOrderConfirmation(populatedOrder);
    } catch (emailError) {
      await Order.findByIdAndDelete(order._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send confirmation email. Order was not created.',
        error: emailError.message
      });
    }

    try {
      await emailService.sendOrderNotificationToAdmin(populatedOrder);
    } catch (emailError) {
      await Order.findByIdAndDelete(order._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to send admin notification. Order was not created.',
        error: emailError.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: populatedOrder
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating order.',
      error: error.message,
      details: error.errors ? Object.values(error.errors).map(e => e.message) : []
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, email, userId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (email) query.email = email;
    if (userId) query.user = userId;

    const orders = await Order.find(query)
      .populate('items.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching orders.', error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching your orders.', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (req.user && order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order.', error: error.message });
  }
};

exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order.', error: error.message });
  }
};

// replace the entire updateOrderStatus function:
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, courierName, awbNumber, note } = req.body;

    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;

    // Capture shipping details when shipped
    if (status === 'shipped') {
      if (!courierName || !awbNumber) {
        return res.status(400).json({ success: false, message: 'Courier name and AWB number are required for shipped status.' });
      }
      order.shipping = {
        courierName,
        awbNumber,
        shippedAt: new Date()
      };
    }

    // Append to status log
    order.statusLogs.push({
      status,
      changedAt: new Date(),
      changedBy: req.user?.email || req.user?.name || 'admin',
      note: note || ''
    });

    await order.save({ validateBeforeSave: false });

    console.log('shipping saved:', JSON.stringify(order.shipping, null, 2));
    console.log('full order shipping field:', order.shipping);

    const statusesToEmail = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (statusesToEmail.includes(status)) {
      try {
        await emailService.sendOrderStatusUpdate(order);
      } catch (e) {
        console.error('Status update email failed:', e.message);
      }
    }

    res.status(200).json({ success: true, message: 'Order status updated.', data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating order status.', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.status(200).json({ success: true, message: 'Order deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting order.', error: error.message });
  }
};