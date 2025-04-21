# Wellness Check-in System

A support system with emergency reporting capabilities.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:

   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMERGENCY_CONTACT_EMAIL=emergency-contact@example.com
   ```

4. For Gmail setup:
   - Enable 2-Step Verification in your Google Account
   - Generate an App Password:
     1. Go to Google Account > Security
     2. Enable 2-Step Verification
     3. Go to App Passwords
     4. Generate a new app password for "Mail"
     5. Use this password in the EMAIL_PASSWORD variable

5. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: Gmail App Password (not your regular password)
- `EMERGENCY_CONTACT_EMAIL`: Email address to receive emergency reports
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `SESSION_SECRET`: Secret key for session security

## Security Notes

- Never commit the `.env` file to version control
- Keep your App Password secure
- Use different email addresses for development and production
- Regularly rotate your App Passwords

## Emergency Features

- Emergency button in top-left corner
- PDF report generation
- Automatic email notifications
- IP address tracking
- Risk level assessment 