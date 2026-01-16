const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

/**
 * Gallery Routes
 * Base path: /api/gallery
 */

// Get all gallery images from all configured folders
router.get('/images', galleryController.getGalleryImages);

// Get a random image (optimized for hero section)
router.get('/random', galleryController.getRandomImage);

// Get list of configured folders
router.get('/folders', galleryController.getFolders);

// Get images from a specific folder
router.get('/folders/:folderId', galleryController.getFolderImages);

// Delete gallery images (public)
router.delete('/images', galleryController.deleteGalleryImages);

module.exports = router;
