// // File: ./backend/src/models/BulkEnquiry.js

// const mongoose = require('mongoose');

// const bulkEnquirySchema = new mongoose.Schema({
//   // Company/Customer Information
//   companyName: {
//     type: String,
//     required: [true, 'Company name is required'],
//     trim: true
//   },
//   contactPerson: {
//     type: String,
//     required: [true, 'Contact person name is required'],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     trim: true,
//     lowercase: true
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone number is required'],
//     trim: true
//   },
//   address: {
//     type: String,
//     trim: true
//   },
  
//   // Products and Quantities
//   products: [{
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true
//     },
//     productName: {
//       type: String,
//       required: true
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       min: 1
//     },
//     sizes: [{
//       size: {
//         type: String,
//         enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
//       },
//       quantity: {
//         type: Number,
//         min: 1
//       }
//     }]
//   }],
  
//   // Total Quantity
//   totalQuantity: {
//     type: Number,
//     required: true
//   },
  
//   // Requirements
//   requirements: {
//     type: String,
//     trim: true
//   },
  
//   // Delivery Timeline
//   expectedDeliveryDate: {
//     type: Date
//   },
  
//   // Status
//   status: {
//     type: String,
//     enum: ['pending', 'reviewed', 'quoted', 'accepted', 'rejected'],
//     default: 'pending'
//   },
  
//   // Enquiry Number
//   enquiryNumber: {
//     type: String,
//     unique: true
//   }
// }, {
//   timestamps: true
// });

// // Generate enquiry number before saving
// bulkEnquirySchema.pre('save', function(next) {
//   if (!this.enquiryNumber) {
//     this.enquiryNumber = 'BE' + Date.now() + Math.floor(Math.random() * 1000);
//   }
//   next();
// });

// module.exports = mongoose.model('BulkEnquiry', bulkEnquirySchema);