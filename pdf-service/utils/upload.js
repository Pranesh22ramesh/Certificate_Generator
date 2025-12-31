const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload Buffer to Cloudinary
 * @param {Buffer} buffer - PDF Buffer
 * @param {String} publicId - Certificate ID
 * @returns {Promise<String>} Secure URL
 */
const uploadPDF = (buffer, publicId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'certificate-generator/certificates',
                public_id: publicId,
                resource_type: 'raw', // Important for PDF
                format: 'pdf',
                overwrite: true
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );

        uploadStream.end(buffer);
    });
};

module.exports = { uploadPDF };
