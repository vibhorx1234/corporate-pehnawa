// File: ./backend/src/middleware/debugMiddleware.js

// Debug middleware to log all incoming requests
exports.logOrderRequest = (req, res, next) => {
  console.log('\n========== ORDER REQUEST DEBUG ==========');
  console.log('📋 Request Body:', JSON.stringify(req.body, null, 2));
  console.log('📎 File:', req.file ? {
    fieldname: req.file.fieldname,
    originalname: req.file.originalname,
    encoding: req.file.encoding,
    mimetype: req.file.mimetype,
    size: req.file.size,
    destination: req.file.destination,
    filename: req.file.filename,
    path: req.file.path
  } : 'No file uploaded');
  console.log('🔑 Body Keys:', Object.keys(req.body));
  console.log('=========================================\n');
  next();
};