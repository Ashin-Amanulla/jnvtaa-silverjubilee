const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const galleryController = require('../controllers/galleryController');
const { handleUpload } = require('../middlewares/upload');

/**
 * Gallery Routes
 * Base path: /api/gallery
 */

// Rate limiting for upload endpoint (10 requests per hour per IP)
const uploadRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 requests per hour
    message: {
        success: false,
        message: 'Too many upload requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Get hierarchical folder tree structure
router.get('/tree', galleryController.getGalleryTree);

// Get all gallery images from all configured folders
router.get('/images', galleryController.getGalleryImages);

// Get a random image (optimized for hero section)
router.get('/random', galleryController.getRandomImage);

// Get list of configured folders (backward compatibility)
router.get('/folders', galleryController.getFolders);

// Get images from a specific folder (supports nested paths like jnv-tvm/alumni-meet-2026)
// Using wildcard to capture full path including slashes
router.get('/folders/*', galleryController.getFolderImages);

// Upload images to a specific gallery folder (public, rate limited)
router.post('/upload/*', uploadRateLimiter, handleUpload, galleryController.uploadGalleryImages);

// Delete gallery images (public)
router.delete('/images', galleryController.deleteGalleryImages);

module.exports = router;
