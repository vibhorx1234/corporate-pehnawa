const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  sizeType: { type: String, enum: ['standard', 'custom'], required: true },
  standardSize: { type: String, enum: ['S', 'M', 'L', 'XL'] },
  customMeasurements: {
    bust: { type: Number },
    waist: { type: Number }
  }
}, { _id: true });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  customerName: { type: String, required: [true, 'Customer name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
  phone: { type: String, required: [true, 'Phone number is required'], trim: true },

  items: {
    type: [orderItemSchema],
    validate: { validator: (arr) => arr.length > 0, message: 'Order must have at least one item.' }
  },

  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },

  totalAmount: { type: Number, required: [true, 'Total amount is required'], min: 0 },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  // NEW: Razorpay payment details
  payment: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
    status: String,
  },

  status: {
    type: String,
    enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },

  notes: { type: String, trim: true },

  orderNumber: { type: String, unique: true },

  utm: {
    source: { type: String, trim: true },
    medium: { type: String, trim: true },
    campaign: { type: String, trim: true },
    term: { type: String, trim: true },
    content: { type: String, trim: true }
  },

  cancellation: {
    requestedAt: { type: Date },
    reason: { type: String, trim: true },
    upiId: { type: String, trim: true },
    processingFee: { type: Number, default: 0 },
    refundAmount: { type: Number, default: 0 },
    refundStatus: { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending' },
    processedAt: { type: Date },
    adminCancelReason: { type: String, trim: true },
  },

  // add inside orderSchema, after the cancellation block:
  shipping: {
    courierName: { type: String, trim: true },
    awbNumber: { type: String, trim: true },
    shippedAt: { type: Date }
  },

  statusLogs: [
    {
      status: { type: String },
      changedAt: { type: Date, default: Date.now },
      changedBy: { type: String, trim: true }, // admin name/email
      note: { type: String, trim: true }
    }
  ]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Backward-compat virtuals
orderSchema.virtual('address').get(function () { return this.shippingAddress; });
orderSchema.virtual('product').get(function () { return this.items?.[0]?.product; });
orderSchema.virtual('productName').get(function () { return this.items?.[0]?.productName; });
orderSchema.virtual('quantity').get(function () { return this.items?.[0]?.quantity; });
orderSchema.virtual('sizeType').get(function () { return this.items?.[0]?.sizeType; });
orderSchema.virtual('standardSize').get(function () { return this.items?.[0]?.standardSize; });
orderSchema.virtual('customMeasurements').get(function () { return this.items?.[0]?.customMeasurements; });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'CP' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);