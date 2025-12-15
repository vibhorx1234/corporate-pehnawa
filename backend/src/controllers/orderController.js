// File: ./backend/src/controllers/orderController.js

const Order = require('../models/Order');
const emailService = require('../services/emailService');

// Helper function to parse FormData nested objects
const parseFormData = (body) => {
  const parsed = { ...body };
  
  // Parse address object
  if (body['address[street]']) {
    parsed.address = {
      street: body['address[street]'],
      city: body['address[city]'],
      state: body['address[state]'],
      pincode: body['address[pincode]'],
      country: body['address[country]'] || 'India'
    };
    // Clean up the bracket notation fields
    delete parsed['address[street]'];
    delete parsed['address[city]'];
    delete parsed['address[state]'];
    delete parsed['address[pincode]'];
    delete parsed['address[country]'];
  }
  
  // Parse customMeasurements object
  if (body['customMeasurements[bust]']) {
    parsed.customMeasurements = {
      bust: parseFloat(body['customMeasurements[bust]']) || 0,
      waist: parseFloat(body['customMeasurements[waist]']) || 0
    };
    // Clean up the bracket notation fields
    delete parsed['customMeasurements[bust]'];
    delete parsed['customMeasurements[waist]'];
  }
  
  // Parse numeric fields
  if (parsed.quantity) parsed.quantity = parseInt(parsed.quantity);
  if (parsed.totalAmount) parsed.totalAmount = parseFloat(parsed.totalAmount);
  
  return parsed;
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    console.log('📥 Received order request');
    
    // Parse FormData
    const parsedBody = parseFormData(req.body);
    console.log('📝 Parsed body:', JSON.stringify(parsedBody, null, 2));
    
    const orderData = {
      ...parsedBody
    };
    
    console.log('💾 Creating order with data:', JSON.stringify(orderData, null, 2));
    
    const order = await Order.create(orderData);
    console.log('✅ Order created successfully:', order._id);
    
    const populatedOrder = await Order.findById(order._id).populate('product');
    console.log('✅ Order populated with product details');
    
    // Send confirmation email to customer - MUST succeed
    try {
      console.log('📧 Sending customer confirmation email...');
      await emailService.sendOrderConfirmation(populatedOrder);
      console.log('✅ Customer confirmation email sent successfully');
    } catch (emailError) {
      console.error('❌ CRITICAL: Customer email failed:', emailError.message);
      
      // Delete the order since email failed
      await Order.findByIdAndDelete(order._id);
      console.log('🗑️ Order deleted due to email failure');
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send confirmation email. Order was not created. Please check your email configuration or try again.',
        error: emailError.message
      });
    }
    
    // Send notification email to admin - MUST succeed
    try {
      console.log('📧 Sending admin notification email...');
      await emailService.sendOrderNotificationToAdmin(populatedOrder);
      console.log('✅ Admin notification email sent successfully');
    } catch (emailError) {
      console.error('❌ CRITICAL: Admin email failed:', emailError.message);
      
      // Delete the order since email failed
      await Order.findByIdAndDelete(order._id);
      console.log('🗑️ Order deleted due to email failure');
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send notification email to admin. Order was not created. Please check your email configuration or try again.',
        error: emailError.message
      });
    }
    
    // Both emails sent successfully
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.errors) {
      console.error('Validation errors:', Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })));
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
      details: error.errors ? Object.values(error.errors).map(e => e.message) : []
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, email } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (email) query.email = email;
    
    const orders = await Order.find(query)
      .populate('product')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Get order by order number
exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Send status update email to customer
    await emailService.sendOrderStatusUpdate(order);
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};