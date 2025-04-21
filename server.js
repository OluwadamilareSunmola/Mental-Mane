const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();
const app = express();

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from current directory

// Endpoint to send emergency report
app.post('/api/emergency', upload.single('report'), async (req, res) => {
    try {
        console.log('Received emergency report request');
        console.log('Request body:', req.body);
        console.log('File:', req.file ? 'Present' : 'Not present');

        const { 
            timestamp, 
            location, 
            userAgent, 
            ipAddress,
            riskLevel,
            emailTitle = 'Emergency Report - Wellness Check-in',
            customMessage = '',
            recipientEmail = 'b94713668@gmail.com'
        } = req.body;

        const reportFile = req.file;

        // Simulate email sending
        console.log('Simulating email send to:', recipientEmail);
        console.log('Email title:', emailTitle);
        console.log('Email content:', customMessage);
        console.log('Report file:', reportFile ? 'Attached' : 'Not attached');

        // Simulate a delay to mimic email sending
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Email simulation complete');
        
        res.json({ 
            success: true, 
            message: 'Emergency report sent successfully',
            simulated: true,
            recipient: recipientEmail
        });
    } catch (error) {
        console.error('Error in emergency report:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to process emergency report',
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 