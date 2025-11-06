// File: ./backend/src/services/emailService.js

const nodemailer = require('nodemailer');
const path = require('path');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
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
      minVersion: 'TLSv1.2',
      ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:@STRENGTH:!DH:!kEDH'
    },
    requireTLS: false,
    opportunisticTLS: true
  });
};

// Send order confirmation email to customer
exports.sendOrderConfirmation = async (order) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DD7351;">Thank You for Your Order!</h2>
        <p>Dear ${order.customerName},</p>
        <p>Your order has been received successfully.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Product:</strong> ${order.productName}</p>
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          <p><strong>Size:</strong> ${order.sizeType === 'standard' ? order.standardSize : 'Custom Size'}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        </div>
        
        ${order.sizeType === 'custom' ? `
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Custom Measurements</h3>
          <p><strong>Bust:</strong> ${order.customMeasurements.bust} inches</p>
          <p><strong>Waist:</strong> ${order.customMeasurements.waist} inches</p>
        </div>
        ` : ''}
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Delivery Address</h3>
          <p>${order.address.street}<br>
          ${order.address.city}, ${order.address.state}<br>
          ${order.address.pincode}, ${order.address.country}</p>
        </div>
        
        <p>We will process your order and send you updates via email.</p>
        <p>If you have any questions, please contact us.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>
        <strong>Corporate Pehnawa Team</strong></p>
      </div>
    `
  };

  try {
    console.log('Verifying transporter for order confirmation...');
    await transporter.verify();
    console.log('✅ Transporter verified');

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${order.email}`);
    
    transporter.close();
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    transporter.close();
    throw error; // Rethrow to handle in controller
  }
};

// Send order notification to admin with payment screenshot attached
exports.sendOrderNotificationToAdmin = async (order) => {
  const transporter = createTransporter();

  const attachments = [];
  
  if (order.paymentScreenshot) {
    try {
      const screenshotPath = path.resolve(order.paymentScreenshot);
      
      attachments.push({
        filename: `payment-${order.orderNumber}.${path.extname(order.paymentScreenshot).substring(1)}`,
        path: screenshotPath,
        contentType: 'image/' + path.extname(order.paymentScreenshot).substring(1)
      });
    } catch (error) {
      console.error('❌ Error attaching payment screenshot:', error);
    }
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order Received - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DD7351;">🛒 New Order Received</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> <a href="mailto:${order.email}">${order.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${order.phone}">${order.phone}</a></p>
          <p><strong>Product:</strong> ${order.productName}</p>
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          <p><strong>Size:</strong> ${order.sizeType === 'standard' ? order.standardSize : 'Custom Size'}</p>
          <p><strong style="color: #DD7351; font-size: 18px;">Total Amount: ₹${order.totalAmount}</strong></p>
        </div>
        
        ${order.sizeType === 'custom' ? `
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📏 Custom Measurements</h3>
          <p><strong>Bust:</strong> ${order.customMeasurements.bust} inches</p>
          <p><strong>Waist:</strong> ${order.customMeasurements.waist} inches</p>
        </div>
        ` : ''}
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📦 Delivery Address</h3>
          <p>${order.address.street}<br>
          ${order.address.city}, ${order.address.state}<br>
          ${order.address.pincode}, ${order.address.country}</p>
        </div>
        
        ${order.notes ? `
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📝 Additional Notes</h3>
          <p>${order.notes}</p>
        </div>
        ` : ''}
        
        <div style="background-color: #fff9c4; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #fbc02d;">
          <h3 style="margin-top: 0;">💳 Payment Verification</h3>
          <p><strong>Payment Screenshot:</strong> ${order.paymentScreenshot ? 'Attached to this email' : 'Not uploaded'}</p>
          <p style="font-size: 14px; color: #666;">Please verify the payment screenshot attached below and update the order status accordingly.</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <p style="color: #666; font-size: 14px;">This is an automated notification from Corporate Pehnawa Order System</p>
        </div>
      </div>
    `,
    attachments: attachments
  };

  try {
    console.log('Verifying transporter for admin notification...');
    await transporter.verify();
    console.log('✅ Transporter verified');

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order notification email sent to admin with ${attachments.length > 0 ? 'payment screenshot attached' : 'no attachment'}`);
    
    transporter.close();
  } catch (error) {
    console.error('❌ Error sending order notification email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    transporter.close();
    throw error; // Rethrow to handle in controller
  }
};

// Send order status update to customer
exports.sendOrderStatusUpdate = async (order) => {
  const transporter = createTransporter();

  const statusMessages = {
    confirmed: 'Your order has been confirmed and is being processed.',
    processing: 'Your order is currently being processed.',
    shipped: 'Your order has been shipped and is on its way!',
    delivered: 'Your order has been delivered successfully.',
    cancelled: 'Your order has been cancelled.'
  };

  const statusEmojis = {
    confirmed: '✅',
    processing: '⚙️',
    shipped: '🚚',
    delivered: '📦',
    cancelled: '❌'
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.email,
    subject: `${statusEmojis[order.status]} Order Status Update - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DD7351;">${statusEmojis[order.status]} Order Status Update</h2>
        <p>Dear ${order.customerName},</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Status:</strong> <span style="color: #DD7351; font-weight: bold; font-size: 18px;">${order.status.toUpperCase()}</span></p>
          <p>${statusMessages[order.status]}</p>
        </div>
        
        <p>Thank you for shopping with Corporate Pehnawa!</p>
        
        <p style="margin-top: 30px;">Best regards,<br>
        <strong>Corporate Pehnawa Team</strong></p>
      </div>
    `
  };

  try {
    console.log('Verifying transporter for order status update...');
    await transporter.verify();
    console.log('✅ Transporter verified');

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order status update email sent to ${order.email}`);
    
    transporter.close();
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    transporter.close();
  }
};