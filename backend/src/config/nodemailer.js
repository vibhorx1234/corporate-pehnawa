// File: ./backend/src/config/nodemailer.js

const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
  pool: false,
  tls: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  }
});

// Verify transporter on startup
transporter.verify()
  .then(() => {
    console.log('✅ Email transporter is ready to send messages');
  })
  .catch((error) => {
    console.error('❌ Email transporter verification failed:', error.message);
  });

module.exports = transporter;