// File: ./backend/src/services/fileService.js

const fs = require('fs');
const path = require('path');

// Delete file
exports.deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      return resolve();
    }

    const fullPath = path.join(__dirname, '../../', filePath);

    fs.access(fullPath, fs.constants.F_OK, (err) => {
      if (err) {
        // File doesn't exist, resolve anyway
        return resolve();
      }

      fs.unlink(fullPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
          return reject(unlinkErr);
        }
        resolve();
      });
    });
  });
};

// Check if file exists
exports.fileExists = (filePath) => {
  return new Promise((resolve) => {
    if (!filePath) {
      return resolve(false);
    }

    const fullPath = path.join(__dirname, '../../', filePath);
    fs.access(fullPath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

// Get file size
exports.getFileSize = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      return resolve(0);
    }

    const fullPath = path.join(__dirname, '../../', filePath);
    fs.stat(fullPath, (err, stats) => {
      if (err) {
        return reject(err);
      }
      resolve(stats.size);
    });
  });
};

// Create directory if it doesn't exist
exports.ensureDirectoryExists = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

// Get file MIME type
exports.getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf'
  };
  return mimeTypes[ext] || 'application/octet-stream';
};