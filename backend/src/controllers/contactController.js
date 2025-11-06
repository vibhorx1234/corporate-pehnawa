// ============================================
// File: ./backend/src/controllers/contactController.js
// ============================================

const Contact = require('../models/Contact');
const transporter = require('../config/nodemailer');

// Send contact form email with optimized configuration
const sendContactEmail = async (contactData) => {
  // Verify connection before sending
  try {
    console.log('Verifying transporter for contact email...');
    await transporter.verify();
    console.log('✅ Transporter verified for contact email');
  } catch (error) {
    console.error('❌ Transporter verification failed:', error.message);
    throw new Error('Email service connection failed. Please try again later.');
  }

  // Email to admin
  const adminMailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Form Submission: ${contactData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DD7351;">New Contact Form Submission</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Contact Details</h3>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
        </div>
        
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Message</h3>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
        
        <p><strong>Received at:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #fff3e0; border-left: 4px solid #DD7351;">
          <p style="margin: 0;"><strong>Reply to this customer at:</strong> ${contactData.email}</p>
        </div>
      </div>
    `
  };

  // Confirmation email to customer
  const customerMailOptions = {
    from: process.env.EMAIL_FROM,
    to: contactData.email,
    subject: 'Thank you for contacting Corporate Pehnawa',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DD7351;">Thank You for Contacting Us!</h2>
        <p>Dear ${contactData.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Message</h3>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
        
        <p>Our team typically responds within 24-48 hours during business days.</p>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #e8f5e9; border-radius: 5px;">
          <h4 style="margin-top: 0;">Need Immediate Assistance?</h4>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${process.env.CONTACT_PHONE || '+91 91662 13263'}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${process.env.ADMIN_EMAIL}</p>
        </div>
        
        <p style="margin-top: 30px;">Best regards,<br>
        <strong>Corporate Pehnawa Team</strong></p>
      </div>
    `
  };

  try {
    console.log('Attempting to send contact emails...');
    
    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    console.log(`✅ Contact form notification sent to admin`);
    
    // Send confirmation email to customer
    await transporter.sendMail(customerMailOptions);
    console.log(`✅ Contact confirmation email sent to ${contactData.email}`);
    
    console.log('✅ Contact emails sent successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Error sending contact emails:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    throw error;
  }
};

// Create new contact submission
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Save to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });
    
    // Send emails
    await sendContactEmail({ name, email, subject, message });
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: contact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again or contact us directly.',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};