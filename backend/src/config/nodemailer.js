// File: ./backend/src/config/nodemailer.js

const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Create a transporter-like wrapper for compatibility with existing code
const transporter = {
  sendMail: async (mailOptions) => {
    try {
      console.log('Sending email via Resend...');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);

      const result = await resend.emails.send({
        from: mailOptions.from || process.env.EMAIL_FROM,
        to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
        subject: mailOptions.subject,
        html: mailOptions.html,
        // Resend supports attachments differently - we'll handle this if needed
        attachments: mailOptions.attachments || []
      });

      console.log('✅ Email sent successfully via Resend');
      console.log('Result:', result);
      
      return { messageId: result.id };
    } catch (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }
  },

  verify: async () => {
    // Verify API key is configured
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key not configured');
    }
    console.log('✅ Resend transporter ready');
    return true;
  },

  close: () => {
    // No need to close Resend connection
    console.log('✅ Resend transporter closed');
  }
};

// Verify on startup
transporter.verify().catch(err => {
  console.error('❌ Resend verification failed:', err.message);
});

module.exports = transporter;