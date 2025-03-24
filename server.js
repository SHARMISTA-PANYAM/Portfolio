// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sgMail = require('@sendgrid/mail'); // Using SendGrid instead of Nodemailer

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the current directory (Website)
app.use(express.static(__dirname));

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request to /contact
app.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields.' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address.' 
            });
        }

        // DEVELOPMENT MODE: Skip actual email sending but return success
        // Change this to false in production
        const DEV_MODE = process.env.NODE_ENV !== 'production';

        if (DEV_MODE) {
            console.log('DEV MODE: Email would have been sent with the following details:');
            console.log(`From: ${email}`);
            console.log(`Name: ${name}`);
            console.log(`Message: ${message}`);
            
            // Return success without actually sending email
            return res.status(200).json({ 
                success: true, 
                message: 'Message captured successfully (DEV MODE)!' 
            });
        }

        // PRODUCTION EMAIL SENDING - only used when DEV_MODE is false
        const apiKey = process.env.SENDGRID_API_KEY;
        
        if (!apiKey) {
            console.error('SendGrid API key is missing. Email cannot be sent.');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error. Please contact the administrator.'
            });
        }
        
        // Set your SendGrid API key
        sgMail.setApiKey(apiKey);

        // You must verify this sender email in your SendGrid account
        const senderEmail = process.env.SENDGRID_VERIFIED_SENDER || 'your-verified-sender@yourdomain.com';
        
        // Prepare email message
        const msg = {
            to: 'sharmistapanyam201@gmail.com', // Your email to receive submissions
            from: senderEmail, // Must be verified in SendGrid
            replyTo: email, // Makes replies go to the person who filled the form
            subject: `Portfolio Contact: New message from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message: 
${message}
            `,
            html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        try {
            // Send email via SendGrid
            await sgMail.send(msg);
            
            res.status(200).json({ 
                success: true, 
                message: 'Message sent successfully!' 
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            
            // Send a detailed error in development
            res.status(500).json({ 
                success: false, 
                message: 'Failed to send email. Please try again later.',
                details: DEV_MODE ? emailError.message : undefined
            });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again later.' 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
});