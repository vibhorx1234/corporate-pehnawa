// File: ./backend/src/services/emailService.js

const transporter = require('../config/nodemailer');
const path = require('path');

// Send order confirmation email to customer
exports.sendOrderConfirmation = async (order) => {
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
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${order.email}`);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
  }
};

// Send order notification to admin with payment screenshot attached
exports.sendOrderNotificationToAdmin = async (order) => {
  // Build attachments array
  const attachments = [];
  
  // Add payment screenshot if it exists
  if (order.paymentScreenshot) {
    try {
      // Get the absolute path to the file
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
    subject: `🛍️ New Order Received - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DD7351;">🛍️ New Order Received</h2>
        
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
    `,
    attachments: attachments // Add attachments here
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Order notification email sent to admin with ${attachments.length > 0 ? 'payment screenshot attached' : 'no attachment'}`);
  } catch (error) {
    console.error('❌ Error sending order notification email:', error);
    throw error; // Rethrow to handle in controller if needed
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
    await transporter.sendMail(mailOptions);
    console.log(`✅ Order status update email sent to ${order.email}`);
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
  }
};

// Send bulk enquiry confirmation to customer
// exports.sendBulkEnquiryConfirmation = async (enquiry) => {
//   const productsList = enquiry.products.map(item => 
//     `<li>${item.productName} - Quantity: ${item.quantity}</li>`
//   ).join('');

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: enquiry.email,
//     subject: `Bulk Enquiry Confirmation - ${enquiry.enquiryNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #E87845;">Thank You for Your Bulk Enquiry!</h2>
//         <p>Dear ${enquiry.contactPerson},</p>
//         <p>We have received your bulk enquiry.</p>
        
//         <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="margin-top: 0;">Enquiry Details</h3>
//           <p><strong>Enquiry Number:</strong> ${enquiry.enquiryNumber}</p>
//           <p><strong>Company:</strong> ${enquiry.companyName}</p>
//           <p><strong>Total Quantity:</strong> ${enquiry.totalQuantity}</p>
          
//           <h4>Products:</h4>
//           <ul style="list-style-type: none; padding-left: 0;">
//             ${productsList}
//           </ul>
//         </div>
        
//         <p>Our team will review your enquiry and get back to you within 24-48 hours with a detailed quotation.</p>
        
//         <p style="margin-top: 30px;">Best regards,<br>
//         <strong>Corporate Pehnawa Team</strong></p>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Bulk enquiry confirmation email sent to ${enquiry.email}`);
//   } catch (error) {
//     console.error('❌ Error sending bulk enquiry confirmation email:', error);
//   }
// };

// Send bulk enquiry notification to admin
// exports.sendBulkEnquiryNotificationToAdmin = async (enquiry) => {
//   const productsList = enquiry.products.map(item => {
//     const sizesList = item.sizes && item.sizes.length > 0 
//       ? item.sizes.map(s => `${s.size}: ${s.quantity}`).join(', ')
//       : 'Not specified';
//     return `<li>${item.productName} - Quantity: ${item.quantity} (Sizes: ${sizesList})</li>`;
//   }).join('');

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: process.env.ADMIN_EMAIL,
//     subject: `New Bulk Enquiry - ${enquiry.enquiryNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #E87845;">New Bulk Enquiry Received</h2>
        
//         <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="margin-top: 0;">Enquiry Details</h3>
//           <p><strong>Enquiry Number:</strong> ${enquiry.enquiryNumber}</p>
//           <p><strong>Company:</strong> ${enquiry.companyName}</p>
//           <p><strong>Contact Person:</strong> ${enquiry.contactPerson}</p>
//           <p><strong>Email:</strong> ${enquiry.email}</p>
//           <p><strong>Phone:</strong> ${enquiry.phone}</p>
//           <p><strong>Total Quantity:</strong> ${enquiry.totalQuantity}</p>
          
//           <h4>Products:</h4>
//           <ul style="list-style-type: none; padding-left: 0;">
//             ${productsList}
//           </ul>
//         </div>
        
//         ${enquiry.requirements ? `
//         <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <h3 style="margin-top: 0;">Requirements</h3>
//           <p>${enquiry.requirements}</p>
//         </div>
//         ` : ''}
        
//         ${enquiry.expectedDeliveryDate ? `
//         <p><strong>Expected Delivery:</strong> ${new Date(enquiry.expectedDeliveryDate).toLocaleDateString()}</p>
//         ` : ''}
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Bulk enquiry notification email sent to admin`);
//   } catch (error) {
//     console.error('❌ Error sending bulk enquiry notification email:', error);
//   }
// };

// Send bulk enquiry status update to customer
// exports.sendBulkEnquiryStatusUpdate = async (enquiry) => {
//   const statusMessages = {
//     reviewed: 'Your bulk enquiry has been reviewed by our team.',
//     quoted: 'We have prepared a quotation for your bulk enquiry. Our team will contact you soon.',
//     accepted: 'Your bulk enquiry has been accepted. We will proceed with your order.',
//     rejected: 'We regret to inform you that we cannot fulfill this bulk enquiry at this time.'
//   };

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: enquiry.email,
//     subject: `Bulk Enquiry Status Update - ${enquiry.enquiryNumber}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #E87845;">Bulk Enquiry Status Update</h2>
//         <p>Dear ${enquiry.contactPerson},</p>
        
//         <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
//           <p><strong>Enquiry Number:</strong> ${enquiry.enquiryNumber}</p>
//           <p><strong>Status:</strong> <span style="color: #E87845; font-weight: bold;">${enquiry.status.toUpperCase()}</span></p>
//           <p>${statusMessages[enquiry.status]}</p>
//         </div>
        
//         <p>Thank you for choosing Corporate Pehnawa!</p>
        
//         <p style="margin-top: 30px;">Best regards,<br>
//         <strong>Corporate Pehnawa Team</strong></p>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`✅ Bulk enquiry status update email sent to ${enquiry.email}`);
//   } catch (error) {
//     console.error('❌ Error sending bulk enquiry status update email:', error);
//   }
// };