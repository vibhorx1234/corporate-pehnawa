const fs = require('fs').promises;
const path = require('path');

const EMAIL_API_ENDPOINT = 'https://corporate-pehnawa.vercel.app/send-email';

/**
 * Helper function to send an email using the external API endpoint.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} content - The HTML content of the email.
 * @param {Array} attachments - Optional array of attachments.
 */
const sendEmailViaApi = async (toEmail, subject, content, attachments = null) => {
    const requestBody = {
        toEmail: toEmail,
        subject: subject,
        content: content
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
        requestBody.attachments = attachments;
    }

    try {
        console.log(`Sending email to ${toEmail} via external API...`);
        
        const response = await fetch(EMAIL_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API returned status ${response.status}: ${errorText}`);
        }

        console.log(`✅ Email sent successfully to ${toEmail}`);
        return; 
    } catch (error) {
        console.error('❌ Error sending email via external API:', error.message);
        throw error;
    }
};

// Send order confirmation email to customer
exports.sendOrderConfirmation = async (order) => {
    const htmlContent = `
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
    `;

    await sendEmailViaApi(
        order.email,
        `Order Confirmation - ${order.orderNumber}`,
        htmlContent
    );
};

// Send order notification to admin with payment screenshot attached
exports.sendOrderNotificationToAdmin = async (order) => {
    const htmlContent = `
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
            <p style="font-size: 14px; color: #666;">Please verify the payment and update the order status accordingly.</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #666; font-size: 14px;">This is an automated notification from Corporate Pehnawa Order System</p>
          </div>
        </div>
    `;

    // Prepare attachment if payment screenshot exists
    let attachments = null;
    if (order.paymentScreenshot) {
        try {
            // Read the file and convert to base64
            const fileBuffer = await fs.readFile(order.paymentScreenshot);
            const base64Content = fileBuffer.toString('base64');
            
            // Get file extension
            const fileExtension = path.extname(order.paymentScreenshot);
            const filename = `payment-screenshot-${order.orderNumber}${fileExtension}`;
            
            attachments = [{
                filename: filename,
                content: base64Content,
                encoding: 'base64'
            }];
            
            console.log(`✅ Payment screenshot prepared for attachment: ${filename}`);
        } catch (error) {
            console.error('❌ Error reading payment screenshot:', error.message);
            // Continue without attachment if file read fails
        }
    }

    await sendEmailViaApi(
        process.env.ADMIN_EMAIL,
        `🛒 New Order Received - ${order.orderNumber}`,
        htmlContent,
        attachments // Pass the attachments
    );
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

    const subject = `${statusEmojis[order.status]} Order Status Update - ${order.orderNumber}`;

    const htmlContent = `
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
    `;

    await sendEmailViaApi(
        order.email,
        subject,
        htmlContent
    );
};