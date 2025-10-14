// ============================================
// File: ./backend/src/controllers/contactController.js
// ============================================

const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Send contact form email
const sendContactEmail = async (contactData) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

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
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${process.env.CONTACT_PHONE || '+91 XXXXX XXXXX'}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${process.env.ADMIN_EMAIL}</p>
        </div>
        
        <p style="margin-top: 30px;">Best regards,<br>
        <strong>Corporate Pehnawa Team</strong></p>
      </div>
    `
  };

  try {
    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    console.log(`✅ Contact form notification sent to admin`);
    
    // Send confirmation email to customer
    await transporter.sendMail(customerMailOptions);
    console.log(`✅ Contact confirmation email sent to ${contactData.email}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending contact emails:', error);
    throw error;
  }
};

// Create new contact submission
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
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
      error: error.message
    });
  }
};

// Get all contact submissions (for admin)
// exports.getAllContacts = async (req, res) => {
//   try {
//     const { status } = req.query;
//     let query = {};
    
//     if (status) query.status = status;
    
//     const contacts = await Contact.find(query).sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       count: contacts.length,
//       data: contacts
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching contacts',
//       error: error.message
//     });
//   }
// };

// // Update contact status (for admin)
// exports.updateContactStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     const contact = await Contact.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );
    
//     if (!contact) {
//       return res.status(404).json({
//         success: false,
//         message: 'Contact not found'
//       });
//     }
    
//     res.status(200).json({
//       success: true,
//       message: 'Contact status updated successfully',
//       data: contact
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Error updating contact status',
//       error: error.message
//     });
//   }
// };