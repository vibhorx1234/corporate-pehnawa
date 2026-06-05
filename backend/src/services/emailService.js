const EMAIL_API_ENDPOINT = 'https://corporate-pehnawa.vercel.app/send-email';

// ─── Internal helper ──────────────────────────────────────────────────────────

const sendEmailViaApi = async (toEmail, subject, content, attachments = null) => {
  const requestBody = { toEmail, subject, content };
  if (attachments && attachments.length > 0) requestBody.attachments = attachments;

  try {
    console.log(`Sending email to ${toEmail} via external API...`);

    const response = await fetch(EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned status ${response.status}: ${errorText}`);
    }

    console.log(`✅ Email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending email via external API:', error.message);
    throw error;
  }
};

const buildItemsTable = (order) => {
  // New flow: items array present and populated
  const items = order.items && order.items.length > 0 ? order.items : null;

  if (items) {
    const rows = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.sizeType === 'standard'
        ? item.standardSize
        : `Custom (Bust: ${item.customMeasurements?.bust}", Waist: ${item.customMeasurements?.waist}")`}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    return `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: center;">Size</th>
            <th style="padding: 10px; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  // Legacy fallback: single-product virtual fields
  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="padding: 10px; text-align: left;">Product</th>
          <th style="padding: 10px; text-align: center;">Qty</th>
          <th style="padding: 10px; text-align: center;">Size</th>
          <th style="padding: 10px; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${order.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${order.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${order.sizeType === 'standard' ? order.standardSize : 'Custom Size'}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${order.totalAmount?.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>
  `;
};

// Resolve address — new orders use shippingAddress, legacy ones use address virtual
const resolveAddress = (order) => order.shippingAddress || order.address;

// ─── Exports ──────────────────────────────────────────────────────────────────

// Send order confirmation email to customer
exports.sendOrderConfirmation = async (order) => {
  const addr = resolveAddress(order);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #DD7351;">Thank You for Your Order!</h2>
      <p>Dear ${order.customerName},</p>
      <p>Your order has been received successfully.</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total Amount:</strong> <span style="color: #DD7351; font-size: 18px; font-weight: bold;">₹${order.totalAmount?.toLocaleString('en-IN')}</span></p>
        ${buildItemsTable(order)}
      </div>

      <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Delivery Address</h3>
        <p>
          ${addr.street}<br>
          ${addr.city}, ${addr.state}<br>
          ${addr.pincode}, ${addr.country || 'India'}
        </p>
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

// Send order notification to admin
exports.sendOrderNotificationToAdmin = async (order) => {
  const addr = resolveAddress(order);

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
        <p><strong style="color: #DD7351; font-size: 18px;">Total Amount: ₹${order.totalAmount?.toLocaleString('en-IN')}</strong></p>
        ${buildItemsTable(order)}
      </div>

      <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">📦 Delivery Address</h3>
        <p>
          ${addr.street}<br>
          ${addr.city}, ${addr.state}<br>
          ${addr.pincode}, ${addr.country || 'India'}
        </p>
      </div>

      ${order.notes ? `
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">📝 Additional Notes</h3>
        <p>${order.notes}</p>
      </div>
      ` : ''}

      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #666; font-size: 14px;">This is an automated notification from Corporate Pehnawa Order System</p>
      </div>
    </div>
  `;

  await sendEmailViaApi(
    process.env.ADMIN_EMAIL,
    `🛒 New Order Received - ${order.orderNumber}`,
    htmlContent
  );
};

// Send order status update to customer  (unchanged logic, kept as-is)

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

  const emoji = statusEmojis[order.status] || '📋';
  const message = statusMessages[order.status] || 'Your order status has been updated.';

  const shippingBlock = order.status === 'shipped' && order.shipping ? `
    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">🚚 Shipping Details</h3>
      <p><strong>Courier:</strong> ${order.shipping.courierName}</p>
      <p><strong>AWB / Tracking Number:</strong> <code style="background:#eee;padding:2px 8px;border-radius:4px;">${order.shipping.awbNumber}</code></p>
      <p><strong>Shipped On:</strong> ${new Date(order.shipping.shippedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    </div>
  ` : '';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #DD7351;">${emoji} Order Status Update</h2>
      <p>Dear ${order.customerName},</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Status:</strong> <span style="color: #DD7351; font-weight: bold; font-size: 18px;">${order.status.toUpperCase()}</span></p>
        <p>${message}</p>
      </div>

      ${shippingBlock}

      <p>Thank you for shopping with Corporate Pehnawa!</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>Corporate Pehnawa Team</strong></p>
    </div>
  `;

  await sendEmailViaApi(
    order.email,
    `${emoji} Order Status Update - ${order.orderNumber}`,
    htmlContent
  );
};

// APPEND this function to ./backend/src/services/emailService.js
// Paste at the very bottom of the file.

// Send password reset email
exports.sendPasswordResetEmail = async (toEmail, resetUrl, userName) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #DD7351;">Reset Your Password</h2>
      <p>Hi ${userName},</p>
      <p>We received a request to reset the password for your Corporate Pehnawa account.</p>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetUrl}"
          style="background-color: #DD7351; color: white; padding: 14px 32px;
                 text-decoration: none; border-radius: 8px; font-weight: bold;
                 font-size: 16px; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p style="color: #666; font-size: 14px;">
        This link expires in <strong>1 hour</strong>.<br>
        If you didn't request this, you can safely ignore this email — your password won't change.
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 20px;">
        Or copy this link into your browser:<br>
        <a href="${resetUrl}" style="color: #DD7351; word-break: break-all;">${resetUrl}</a>
      </p>

      <p style="margin-top: 30px;">Best regards,<br>
      <strong>Corporate Pehnawa Team</strong></p>
    </div>
  `;

  await sendEmailViaApi(
    toEmail,
    '🔑 Reset Your Password — Corporate Pehnawa',
    htmlContent
  );
};

// File: APPEND to ./backend/src/services/emailService.js
// Paste both functions at the very bottom of the existing file.

// Send cancellation confirmation to customer
exports.sendCancellationConfirmation = async (order) => {
  const { cancellation } = order;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #DD7351;">❌ Order Cancellation Confirmed</h2>
      <p>Dear ${order.customerName},</p>
      <p>Your cancellation request for order <strong>${order.orderNumber}</strong> has been received and processed.</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Cancellation Details</h3>
        <p><strong>Reason for Cancellation:</strong> ${cancellation.reason || 'Not specified'}</p>
      </div>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Refund Details</h3>
        <p><strong>Order Amount:</strong> ₹${order.totalAmount?.toLocaleString('en-IN')}</p>
        <p><strong>Processing Fee (2%):</strong> ₹${cancellation.processingFee?.toLocaleString('en-IN')}</p>
        <p style="font-size: 18px;"><strong>Refund Amount:</strong> <span style="color: #16a34a;">₹${cancellation.refundAmount?.toLocaleString('en-IN')}</span></p>
        <p><strong>Refund UPI ID:</strong> ${cancellation.upiId}</p>
      </div>

      <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">⏳ Processing Time</h3>
        <p>Your refund of <strong>₹${cancellation.refundAmount?.toLocaleString('en-IN')}</strong> will be credited to your UPI ID <strong>(${cancellation.upiId})</strong> within <strong>24 hours</strong>.</p>
        <p style="color: #666; font-size: 13px;">Please note: A 2% processing fee of ₹${cancellation.processingFee?.toLocaleString('en-IN')} has been deducted as per our cancellation policy.</p>
      </div>

      <p>If you have any questions, please contact us and quote your order number.</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>Corporate Pehnawa Team</strong></p>
    </div>
  `;

  await sendEmailViaApi(
    order.email,
    `❌ Order Cancelled — Refund of ₹${cancellation.refundAmount?.toLocaleString('en-IN')} Initiated — ${order.orderNumber}`,
    htmlContent
  );
};

// Notify admin of cancellation request
exports.sendCancellationNotificationToAdmin = async (order) => {
  const { cancellation } = order;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #DD7351;">🔴 Order Cancellation Request</h2>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> <a href="mailto:${order.email}">${order.email}</a></p>
        <p><strong>Order Amount:</strong> ₹${order.totalAmount?.toLocaleString('en-IN')}</p>
        <p><strong>Cancellation Reason:</strong> ${cancellation.reason || 'Not specified'}</p>
      </div>

      <div style="background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">💸 Refund Required</h3>
        <p><strong>Processing Fee (2%):</strong> ₹${cancellation.processingFee?.toLocaleString('en-IN')}</p>
        <p style="font-size: 18px;"><strong>Amount to Refund:</strong> <span style="color: #dc2626;">₹${cancellation.refundAmount?.toLocaleString('en-IN')}</span></p>
        <p><strong>Customer UPI ID:</strong> <code style="background:#eee;padding:2px 6px;border-radius:4px;">${cancellation.upiId}</code></p>
        <p style="color: #666; font-size: 13px;">Please process this refund within 24 hours.</p>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #666; font-size: 14px;">Automated notification — Corporate Pehnawa Admin</p>
      </div>
    </div>
  `;

  await sendEmailViaApi(
    process.env.ADMIN_EMAIL,
    `🔴 Cancellation Request — Refund ₹${cancellation.refundAmount?.toLocaleString('en-IN')} to ${cancellation.upiId} — ${order.orderNumber}`,
    htmlContent
  );
};

// Send payment + order confirmation to customer
exports.sendPaymentConfirmation = async (order) => {
  const addr = resolveAddress(order);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #DD7351;">✅ Payment Confirmed!</h2>
      <p>Dear ${order.customerName},</p>
      <p>Your payment has been received and your order is now confirmed.</p>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Payment ID:</strong> <code>${order.payment?.cashfreePaymentId}</code></p>
        <p><strong>Amount Paid:</strong> <span style="color: #16a34a; font-size: 18px; font-weight: bold;">₹${order.totalAmount?.toLocaleString('en-IN')}</span></p>
        ${buildItemsTable(order)}
      </div>

      <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Delivery Address</h3>
        <p>
          ${addr.street}<br>
          ${addr.city}, ${addr.state}<br>
          ${addr.pincode}, ${addr.country || 'India'}
        </p>
      </div>

      <p>We will start processing your order shortly.</p>
      <p style="margin-top: 30px;">Best regards,<br>
      <strong>Corporate Pehnawa Team</strong></p>
    </div>
  `;

  await sendEmailViaApi(
    order.email,
    `✅ Payment Confirmed — Order ${order.orderNumber}`,
    htmlContent
  );
};