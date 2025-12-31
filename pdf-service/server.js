const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/auth');
const { generateCertificate } = require('./controllers/pdfController');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000; // Render default port

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Allow large HTML payloads

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'PDF-Microservice' });
});

// Secured PDF Endpoint
app.post('/api/generate-pdf', authMiddleware, generateCertificate);

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 PDF Service running on port ${PORT}`);
    });
}

module.exports = app;
