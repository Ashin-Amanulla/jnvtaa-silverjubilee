// Try to require sharp, but handle if it's not installed
let sharp;
try {
    sharp = require('sharp');
} catch (error) {
    console.warn('Sharp library not available. Image compression will be disabled.');
    sharp = null;
}

/**
 * Image Processing Utility
 * Compresses and optimizes images for web viewing
 */

// Maximum dimensions for full-size images
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const MAX_QUALITY = 85; // JPEG quality (0-100)

// Thumbnail dimensions
const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 400;
const THUMBNAIL_QUALITY = 75; // Lower quality for thumbnails

/**
 * Process and compress an image buffer
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<Buffer>} Compressed image buffer
 */
async function compressImage(imageBuffer, mimeType) {
    try {
        // If sharp is not available, return original buffer
        if (!sharp) {
            console.warn('Sharp not available, skipping compression');
            return imageBuffer;
        }
        
        let sharpInstance = sharp(imageBuffer);

        // Get image metadata
        const metadata = await sharpInstance.metadata();
        const { width, height, format } = metadata;

        // Determine if resizing is needed
        const needsResize = width > MAX_WIDTH || height > MAX_HEIGHT;

        // Process based on image format
        if (format === 'jpeg' || format === 'jpg') {
            sharpInstance = sharpInstance
                .jpeg({ 
                    quality: MAX_QUALITY,
                    progressive: true, // Progressive JPEG for better web loading
                    mozjpeg: true // Use mozjpeg for better compression
                });
        } else if (format === 'png') {
            sharpInstance = sharpInstance
                .png({ 
                    quality: MAX_QUALITY,
                    compressionLevel: 9, // Maximum compression
                    adaptiveFiltering: true
                });
        } else if (format === 'webp') {
            sharpInstance = sharpInstance
                .webp({ 
                    quality: MAX_QUALITY,
                    effort: 6 // Higher effort = better compression (0-6)
                });
        } else {
            // For other formats (gif, bmp), convert to JPEG
            sharpInstance = sharpInstance
                .jpeg({ 
                    quality: MAX_QUALITY,
                    progressive: true
                });
        }

        // Resize if needed (maintains aspect ratio)
        if (needsResize) {
            sharpInstance = sharpInstance.resize(MAX_WIDTH, MAX_HEIGHT, {
                fit: 'inside', // Fit within dimensions while maintaining aspect ratio
                withoutEnlargement: true // Don't enlarge smaller images
            });
        }

        // Apply compression
        const compressedBuffer = await sharpInstance.toBuffer();

        // Log compression stats
        const originalSize = imageBuffer.length;
        const compressedSize = compressedBuffer.length;
        const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
        const sizeMB = (originalSize / (1024 * 1024)).toFixed(2);
        const compressedMB = (compressedSize / (1024 * 1024)).toFixed(2);
        
        if (originalSize > 1024 * 1024) { // Log if > 1MB
            console.log(`Image compressed: ${sizeMB}MB → ${compressedMB}MB (${compressionRatio}% reduction)`);
        } else {
            console.log(`Image compressed: ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB (${compressionRatio}% reduction)`);
        }

        return compressedBuffer;
    } catch (error) {
        console.error('Error compressing image:', error);
        // Return original buffer if compression fails
        return imageBuffer;
    }
}

/**
 * Generate a thumbnail from an image buffer
 * @param {Buffer} imageBuffer - Original image buffer
 * @returns {Promise<Buffer>} Thumbnail buffer
 */
async function generateThumbnail(imageBuffer) {
    try {
        // If sharp is not available, throw error (should be caught by caller)
        if (!sharp) {
            throw new Error('Sharp library not available');
        }
        
        const thumbnailBuffer = await sharp(imageBuffer)
            .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
                fit: 'cover', // Cover the entire area (may crop)
                position: 'center' // Center the crop
            })
            .jpeg({ 
                quality: THUMBNAIL_QUALITY,
                progressive: true,
                mozjpeg: true
            })
            .toBuffer();

        return thumbnailBuffer;
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw error;
    }
}

/**
 * Process image: compress and generate thumbnail
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {string} mimeType - MIME type of the image
 * @returns {Promise<Object>} Object with compressed image and thumbnail buffers
 */
async function processImage(imageBuffer, mimeType) {
    try {
        // If sharp is not available, return original image without thumbnail
        if (!sharp) {
            return {
                compressed: imageBuffer,
                thumbnail: null,
                originalSize: imageBuffer.length,
                compressedSize: imageBuffer.length,
                thumbnailSize: 0
            };
        }
        
        // Process in parallel for better performance
        const [compressedImage, thumbnail] = await Promise.all([
            compressImage(imageBuffer, mimeType),
            generateThumbnail(imageBuffer)
        ]);

        return {
            compressed: compressedImage,
            thumbnail: thumbnail,
            originalSize: imageBuffer.length,
            compressedSize: compressedImage.length,
            thumbnailSize: thumbnail.length
        };
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

/**
 * Get optimized content type based on original format
 * @param {string} originalMimeType - Original MIME type
 * @returns {string} Optimized MIME type
 */
function getOptimizedContentType(originalMimeType) {
    // Convert all images to JPEG for consistency and better compression
    // except WebP which we keep as WebP
    if (originalMimeType === 'image/webp') {
        return 'image/webp';
    }
    // Convert everything else to JPEG
    return 'image/jpeg';
}

module.exports = {
    compressImage,
    generateThumbnail,
    processImage,
    getOptimizedContentType,
    MAX_WIDTH,
    MAX_HEIGHT,
    THUMBNAIL_WIDTH,
    THUMBNAIL_HEIGHT
};
