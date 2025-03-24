# Portfolio Website

This is a personal portfolio website for Sharmista Panyam, built with HTML, CSS, and JavaScript.

## Features

- Responsive design
- Interactive UI elements
- Contact form with SendGrid email integration
- Project showcase
- Skills and experience sections

## Setup Instructions

### Prerequisites

- Node.js (v12 or higher)
- npm (comes with Node.js)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   
## SendGrid Email Setup

The contact form uses SendGrid to securely send emails. To set it up:

1. Create a [SendGrid account](https://signup.sendgrid.com/) (free tier allows 100 emails/day)

2. Set up sender authentication:
   - Go to Settings > Sender Authentication
   - Either verify a single sender email or set up domain authentication
   - **Important**: The `from` email in server.js must be verified in SendGrid

3. Create an API Key:
   - Go to Settings > API Keys
   - Create a new API key with "Mail Send" permissions
   - **Copy the key immediately** - you won't be able to see it again

4. Configure your environment:
   - Create a `.env` file in the project root (do not commit this file to git)
   - Add your SendGrid API key:
     ```
     SENDGRID_API_KEY=your_api_key_here
     ```
   
5. Update server.js configuration:
   - Set `DEV_MODE = false` to enable actual email sending
   - Update the `from` email to your verified sender
   - Make sure the `to` email is correctly set to where you want to receive messages

## Development Mode

For local development without sending actual emails:
- Keep `DEV_MODE = true` in server.js
- Email details will be logged to the console
- The form will appear to work normally to the user

## Deployment

When deploying to production:
1. Set `DEV_MODE = false` in server.js
2. Set up environment variables on your hosting platform
3. Ensure your SendGrid account is properly configured
4. Test the contact form to ensure emails are being delivered

## License

ISC 