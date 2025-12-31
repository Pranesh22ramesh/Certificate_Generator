const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const { uploadPDF } = require('../utils/upload');

// Helper: Generate QR Code Data URL
const generateQR = async (data) => {
    try {
        return await QRCode.toDataURL(data);
    } catch (err) {
        console.error('QR Gen Failed', err);
        return null;
    }
};

/**
 * Handle PDF Generation Request
 */
const generateCertificate = async (req, res) => {
    const { certificateId, design, placeholders } = req.body;

    try {
        // 1. Validate Input
        if (!certificateId || !design?.templateHtml) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: certificateId or design.templateHtml"
            });
        }

        // 2. Generate QR Code
        const qrCodeDataUrl = await generateQR(placeholders.VERIFICATION_URL || 'https://google.com');

        // 3. Replace Placeholders
        let htmlContent = design.templateHtml;

        // Inject Standard Placeholders
        Object.keys(placeholders).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(regex, placeholders[key]);
        });

        // Inject QR Code (Special Case)
        htmlContent = htmlContent.replace(/{{QR_CODE}}/g, qrCodeDataUrl);


        // 4. Generate PDF with Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Important for Render/Docker
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Set content and wait for network idle (images loaded)
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            landscape: design.orientation === 'landscape',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        await browser.close();

        // 5. Upload to Cloudinary
        console.log(`Uploading ${certificateId} to Cloudinary...`);
        const pdfUrl = await uploadPDF(pdfBuffer, certificateId);

        // 6. Return Success Response
        return res.status(200).json({
            success: true,
            certificateId,
            pdfUrl,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'PDF generation failed'
        });
    }
};

module.exports = { generateCertificate };
