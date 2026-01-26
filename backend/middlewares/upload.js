const multer = require('multer');
const path = require('path');

/**
 * File upload middleware using multer with memory storage
 * Files are stored in memory and then uploaded to S3
 */

// Allowed image MIME types
const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
];

// Allowed file extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

// Maximum file size: 50MB (will be compressed before upload to S3)
// This allows large images to be uploaded, which will then be compressed and resized
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// Configure multer with memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // Check MIME type
    if (allowedMimeTypes.includes(file.mimetype)) {
        // Also check file extension as additional validation
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`), false);
        }
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 20, // Maximum 20 files per request
    },
});

/**
 * Middleware for handling multiple image uploads
 * Accepts up to 20 files with field name 'images'
 */
const uploadImages = upload.array('images', 20);

/**
 * Middleware wrapper to handle multer errors gracefully
 */
const handleUpload = (req, res, next) => {
    uploadImages(req, res, (err) => {
        if (err) {
            // Handle multer errors
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File size exceeds 50MB limit. Images will be automatically compressed after upload.',
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        message: 'Too many files. Maximum 20 files allowed per upload',
                    });
                }
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        success: false,
                        message: 'Unexpected file field. Use "images" as the field name',
                    });
                }
            }
            
            // Handle other errors (file type, etc.)
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error',
            });
        }

        // Validate that files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded. Please select at least one image.',
            });
        }

        next();
    });
};

module.exports = {
    uploadImages,
    handleUpload,
};
