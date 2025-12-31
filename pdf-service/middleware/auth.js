const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.PDF_SERVICE_SECRET;

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== API_KEY) {
        return res.status(403).json({
            success: false,
            error: 'Unauthorized PDF service access'
        });
    }

    next();
};

module.exports = authMiddleware;
