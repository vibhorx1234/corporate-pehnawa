// File: ./backend/src/middleware/uploadMiddleware.js

const upload = require('../config/multer');

// Handle single file upload with error handling
exports.uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);
    
    uploadHandler(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size is too large. Maximum size is 5MB.'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading file'
        });
      }
      
      next();
    });
  };
};

// Handle multiple file uploads
exports.uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName, maxCount);
    
    uploadHandler(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size is too large. Maximum size is 5MB per file.'
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            message: `Too many files. Maximum ${maxCount} files allowed.`
          });
        }
        
        return res.status(400).json({
          success: false,
          message: err.message || 'Error uploading files'
        });
      }
      
      next();
    });
  };
};

// Validate file type
exports.validateFileType = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }
    
    next();
  };
};