// File: ./backend/src/models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Customer Information
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  
  // Order Details
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1
  },
  
  // Size Selection
  sizeType: {
    type: String,
    enum: ['standard', 'custom'],
    required: true
  },
  standardSize: {
    type: String,
    enum: ['S', 'M', 'L', 'XL']
  },
  customMeasurements: {
    bust: { type: Number },
    length: { type: Number },
    waist: { type: Number },
    shoulder: { type: Number }
  },
  
  // Payment Information
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  paymentScreenshot: {
    type: String,
    required: [true, 'Payment screenshot is required']
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Additional Notes
  notes: {
    type: String,
    trim: true
  },
  
  // Order Number
  orderNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'CP' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);