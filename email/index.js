// index.js

// 1. Import required modules
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

// 2. Initialize the Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// 3. Create a Nodemailer transporter
// This is the object that will send the email.
// We configure it to use Gmail and our credentials from the .env file.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your 16-digit App Password
  },
});

// 4. Create the API endpoint
app.post('/send-email', async (req, res) => {
  // Extract data from the request body
  const { toEmail, subject, content } = req.body;

  console.log(toEmail,subject,content)

  // Simple validation
  if (!toEmail || !subject || !content) {
    return res.status(400).send('Missing required fields: toEmail, subject, or content');
  }

  // 5. Define the email options
  const mailOptions = {
    from: `"Your Server Name" <${process.env.EMAIL_USER}>`, // Sender address (must be your Gmail)
    to: toEmail, // Recipient's email address
    subject: subject, // Subject line
    text: content, // Plain text body
    // html: "<b>Hello world?</b>", // You can also send HTML content
  };

  // 6. Send the email
  try {
    // The await keyword waits for the sendMail method to complete
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', toEmail);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

// 7. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});