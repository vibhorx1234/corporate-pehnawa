// File: ./backend/src/models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  collection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: [true, 'Collection is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL']
  }],
  fabric: {
    type: String,
    trim: true
  },
  care: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);