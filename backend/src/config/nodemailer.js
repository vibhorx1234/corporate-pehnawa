// File: ./backend/src/config/nodemailer.js

const nodemailer = require('nodemailer');

// Create transporter with optimized settings for Render
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE === 'true', // true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 60000,
    socketTimeout: 60000,
    pool: false, // Disable pooling for better reliability on Render
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
      ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:@STRENGTH:!DH:!kEDH'
    },
    requireTLS: false,
    opportunisticTLS: true
  };

  console.log('Creating transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    hasPassword: !!config.auth.pass
  });

  return nodemailer.createTransport(config);
};

// Create the transporter
const transporter = createTransporter();

// Verify transporter configuration with retries
const verifyTransporter = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Verifying transporter (attempt ${i + 1}/${retries})...`);
      await transporter.verify();
      console.log('✅ Email transporter verified successfully');
      return true;
    } catch (error) {
      console.error(`Verification attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error('❌ All verification attempts failed');
        return false;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
};

// Verify on startup (but don't block)
verifyTransporter().catch(err => {
  console.error('Initial verification failed:', err.message);
});

module.exports = transporter;