const dotenv = require('dotenv');
dotenv.config();



const Contact = require('../models/Contact');

const EMAIL_API_ENDPOINT = 'https://corporate-pehnawa.vercel.app/send-email';

/**
 * Helper function to send an email using the external API endpoint.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} content - The HTML content of the email.
 */
const sendEmailViaApi = async (toEmail, subject, content) => {
  const requestBody = {
    toEmail: toEmail,
    subject: subject,
    content: content
  };

  try {
    console.log(`Sending email to ${toEmail} via external API...`);
    
    const response = await fetch(EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    console.log(requestBody)
    // Check for HTTP errors (e.g., 400, 500)
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

// Send contact form email
const sendContactEmail = async (contactData) => {
  // Email to admin - HTML content
  const adminHtmlContent = `
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
  `;

  // Confirmation email to customer - HTML content
  const customerHtmlContent = `
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
  `;

  try {
    console.log('Attempting to send contact emails...');
    

    // Send email to admin
    await sendEmailViaApi(
      process.env.ADMIN_EMAIL,
      `New Contact Form Submission: ${contactData.subject}`,
      adminHtmlContent
    );
    console.log(`✅ Contact form notification sent to admin`);
    console.log("------------",contactData)
    // Send confirmation email to customer
    await sendEmailViaApi(
      contactData.email,
      'Thank you for contacting Corporate Pehnawa',
      customerHtmlContent
    );
    console.log(`✅ Contact confirmation email sent to ${contactData.email}`);
    
    console.log('✅ Contact emails sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending contact emails:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
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
    
    console.log('✅ Contact saved to database:', contact._id);
    
    // Send emails
    try {
      await sendContactEmail({ name, email, subject, message });
      console.log('✅ Contact emails sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email sending failed but contact was saved:', emailError.message);
      // Still return success since we saved the contact
      return res.status(201).json({
        success: true,
        message: 'Your message has been received. However, we encountered an issue sending the confirmation email. We will respond to your inquiry soon!',
        data: contact
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: contact
    });
  } catch (error) {
    console.error('❌ Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again or contact us directly.',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// Get all contacts (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// Get single contact by ID (admin only)
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};