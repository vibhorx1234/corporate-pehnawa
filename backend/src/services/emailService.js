// File: ./backend/src/services/emailService.js

const { Resend } = require('resend');
const path = require('path');
const fs = require('fs');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Send order confirmation email to customer
exports.sendOrderConfirmation = async (order) => {
  try {
    console.log('Sending order confirmation via Resend...');

    const result = await resend.emails.send({
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
            <p><strong>Length:</strong> ${order.customMeasurements.length} inches</p>
            <p><strong>Waist:</strong> ${order.customMeasurements.waist} inches</p>
            <p><strong>Shoulder:</strong> ${order.customMeasurements.shoulder} inches</p>
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
    });

    console.log(`✅ Order confirmation email sent to ${order.email} via Resend`);
    console.log('Resend result:', result);
  } catch (error) {
    console.error('❌ Error sending order confirmation email via Resend:', error);
  }
};

// Send order notification to admin with payment screenshot
exports.sendOrderNotificationToAdmin = async (order) => {
  try {
    console.log('Sending order notification to admin via Resend...');

    // Prepare attachments if payment screenshot exists
    const attachments = [];
    
    if (order.paymentScreenshot) {
      try {
        const screenshotPath = path.resolve(order.paymentScreenshot);
        
        // Read file as base64 for Resend
        const fileContent = fs.readFileSync(screenshotPath);
        const base64Content = fileContent.toString('base64');
        const fileExtension = path.extname(order.paymentScreenshot).substring(1);
        
        attachments.push({
          filename: `payment-${order.orderNumber}.${fileExtension}`,
          content: base64Content
        });
      } catch (error) {
        console.error('❌ Error preparing payment screenshot attachment:', error);
      }
    }

    const emailData = {
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
            <p><strong>Length:</strong> ${order.customMeasurements.length} inches</p>
            <p><strong>Waist:</strong> ${order.customMeasurements.waist} inches</p>
            <p><strong>Shoulder:</strong> ${order.customMeasurements.shoulder} inches</p>
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
      `
    };

    // Add attachments if available
    if (attachments.length > 0) {
      emailData.attachments = attachments;
    }

    const result = await resend.emails.send(emailData);

    console.log(`✅ Order notification email sent to admin via Resend with ${attachments.length > 0 ? 'payment screenshot attached' : 'no attachment'}`);
    console.log('Resend result:', result);
  } catch (error) {
    console.error('❌ Error sending order notification email via Resend:', error);
    throw error;
  }
};

// Send order status update to customer
exports.sendOrderStatusUpdate = async (order) => {
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

  try {
    console.log('Sending order status update via Resend...');

    const result = await resend.emails.send({
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
    });

    console.log(`✅ Order status update email sent to ${order.email} via Resend`);
    console.log('Resend result:', result);
  } catch (error) {
    console.error('❌ Error sending order status update email via Resend:', error);
  }
};