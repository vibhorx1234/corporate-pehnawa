// // File: ./backend/src/controllers/bulkEnquiryController.js

// const BulkEnquiry = require('../models/BulkEnquiry');
// const emailService = require('../services/emailService');

// // Create new bulk enquiry
// exports.createBulkEnquiry = async (req, res) => {
//   try {
//     const bulkEnquiry = await BulkEnquiry.create(req.body);
//     const populatedEnquiry = await BulkEnquiry.findById(bulkEnquiry._id)
//       .populate('products.product');
    
//     // Send confirmation email to customer
//     await emailService.sendBulkEnquiryConfirmation(populatedEnquiry);
    
//     // Send notification email to admin
//     await emailService.sendBulkEnquiryNotificationToAdmin(populatedEnquiry);
    
//     res.status(201).json({
//       success: true,
//       message: 'Bulk enquiry submitted successfully',
//       data: populatedEnquiry
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error creating bulk enquiry',
//       error: error.message
//     });
//   }
// };

// // Get all bulk enquiries
// exports.getAllBulkEnquiries = async (req, res) => {
//   try {
//     const { status, email } = req.query;
//     let query = {};
    
//     if (status) query.status = status;
//     if (email) query.email = email;
    
//     const enquiries = await BulkEnquiry.find(query)
//       .populate('products.product')
//       .sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: enquiries.length,
//       data: enquiries
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bulk enquiries',
//       error: error.message
//     });
//   }
// };

// // Get single bulk enquiry by ID
// exports.getBulkEnquiryById = async (req, res) => {
//   try {
//     const enquiry = await BulkEnquiry.findById(req.params.id)
//       .populate('products.product');
    
//     if (!enquiry) {
//       return res.status(404).json({
//         success: false,
//         message: 'Bulk enquiry not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: enquiry
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bulk enquiry',
//       error: error.message
//     });
//   }
// };

// // Get bulk enquiry by enquiry number
// exports.getBulkEnquiryByNumber = async (req, res) => {
//   try {
//     const enquiry = await BulkEnquiry.findOne({ 
//       enquiryNumber: req.params.enquiryNumber 
//     }).populate('products.product');
    
//     if (!enquiry) {
//       return res.status(404).json({
//         success: false,
//         message: 'Bulk enquiry not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       data: enquiry
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bulk enquiry',
//       error: error.message
//     });
//   }
// };

// // Update bulk enquiry status
// exports.updateBulkEnquiryStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     const enquiry = await BulkEnquiry.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     ).populate('products.product');
    
//     if (!enquiry) {
//       return res.status(404).json({
//         success: false,
//         message: 'Bulk enquiry not found'
//       });
//     }
    
//     // Send status update email to customer
//     await emailService.sendBulkEnquiryStatusUpdate(enquiry);
    
//     res.status(200).json({
//       success: true,
//       message: 'Bulk enquiry status updated successfully',
//       data: enquiry
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error updating bulk enquiry status',
//       error: error.message
//     });
//   }
// };

// // Delete bulk enquiry
// exports.deleteBulkEnquiry = async (req, res) => {
//   try {
//     const enquiry = await BulkEnquiry.findByIdAndDelete(req.params.id);
    
//     if (!enquiry) {
//       return res.status(404).json({
//         success: false,
//         message: 'Bulk enquiry not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: 'Bulk enquiry deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting bulk enquiry',
//       error: error.message
//     });
//   }
// };