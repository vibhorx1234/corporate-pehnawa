// File: ./backend/src/routes/bulkEnquiryRoutes.js

const express = require('express');
const router = express.Router();
const bulkEnquiryController = require('../controllers/bulkEnquiryController');

// GET all bulk enquiries
router.get('/', bulkEnquiryController.getAllBulkEnquiries);

// GET bulk enquiry by enquiry number
router.get('/number/:enquiryNumber', bulkEnquiryController.getBulkEnquiryByNumber);

// GET bulk enquiry by ID
router.get('/:id', bulkEnquiryController.getBulkEnquiryById);

// POST create new bulk enquiry
router.post('/', bulkEnquiryController.createBulkEnquiry);

// PATCH update bulk enquiry status
router.patch('/:id/status', bulkEnquiryController.updateBulkEnquiryStatus);

// DELETE bulk enquiry
router.delete('/:id', bulkEnquiryController.deleteBulkEnquiry);

module.exports = router;