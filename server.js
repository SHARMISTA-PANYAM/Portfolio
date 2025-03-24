const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer'); // If you want to send emails

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
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Set up nodemailer transporter (if you want to send emails)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sharmistapanyam201@gmail.com', // Your email
            pass: 'Sharmiuc@123', // Your email password or app password
        },
    });

    const mailOptions = {
        from: email,
        to: 'sharmistapanyam201@gmail.com', // Your email to receive submissions
        subject: `New message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); // Log the error for debugging
            return res.status(500).send('Error sending email');
        }
        res.status(200).send('Message sent successfully');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});