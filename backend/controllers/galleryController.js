const { getConfiguredFolders, listImagesFromFolder } = require('../config/s3Service');

/**
 * Gallery Controller - AWS S3 Implementation
 * Fetches images from S3 bucket: school-jnv
 */

/**
 * Get all gallery images from configured S3 folders
 */
exports.getGalleryImages = async (req, res) => {
    try {
        const folders = getConfiguredFolders();

        if (folders.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No S3 folders configured. Please set S3_FOLDER_PREFIXES in .env file.',
            });
        }

        // Fetch images from all configured folders in parallel
        const imagePromises = folders.map(folder =>
            listImagesFromFolder(folder.prefix, folder.name, folder.id)
        );

        const imageArrays = await Promise.all(imagePromises);
        const allImages = imageArrays.flat();

        // Group images by folder for easier frontend handling
        const imagesByFolder = folders.map(folder => ({
            folder: {
                id: folder.id,
                name: folder.name,
            },
            images: allImages.filter(img => img.folder.id === folder.id),
        }));

        res.json({
            success: true,
            data: {
                allImages,
                imagesByFolder,
                totalImages: allImages.length,
                totalFolders: folders.length,
            },
        });
    } catch (error) {
        console.error('Error in getGalleryImages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch gallery images from S3',
            error: error.message,
        });
    }
};

/**
 * Get a single random image from any configured folder
 * Optimized to minimize S3 calls
 */
exports.getRandomImage = async (req, res) => {
    try {
        const folders = getConfiguredFolders();

        if (folders.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No S3 folders configured',
            });
        }

        // Pick a random folder to sample from
        // We try up to 3 times in case a folder is empty
        let randomImage = null;
        let attempts = 0;
        const maxAttempts = 3;

        // Shuffle folders to try in random order
        const shuffledFolders = [...folders].sort(() => 0.5 - Math.random());

        while (!randomImage && attempts < maxAttempts && attempts < shuffledFolders.length) {
            const folder = shuffledFolders[attempts];
            try {
                const images = await listImagesFromFolder(folder.prefix, folder.name, folder.id);
                if (images.length > 0) {
                    randomImage = images[Math.floor(Math.random() * images.length)];
                }
            } catch (err) {
                console.warn(`Failed to list images from folder ${folder.name} for random selection:`, err.message);
            }
            attempts++;
        }

        if (randomImage) {
            res.json({
                success: true,
                data: randomImage,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No images found in configured folders',
            });
        }
    } catch (error) {
        console.error('Error in getRandomImage:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch random image',
            error: error.message,
        });
    }
};

/**
 * Get images from a specific folder
 */
exports.getFolderImages = async (req, res) => {
    try {
        const { folderId } = req.params;
        const folders = getConfiguredFolders();

        // Find folder configuration
        const folderConfig = folders.find(f => f.id === folderId);

        if (!folderConfig) {
            return res.status(404).json({
                success: false,
                message: 'Folder not found in configuration',
            });
        }

        const images = await listImagesFromFolder(folderConfig.prefix, folderConfig.name, folderConfig.id);

        res.json({
            success: true,
            data: {
                folder: {
                    id: folderConfig.id,
                    name: folderConfig.name,
                },
                images,
                totalImages: images.length,
            },
        });
    } catch (error) {
        console.error('Error in getFolderImages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch folder images from S3',
            error: error.message,
        });
    }
};

/**
 * Get list of configured folders
 */
exports.getFolders = async (req, res) => {
    try {
        const folders = getConfiguredFolders();

        res.json({
            success: true,
            data: {
                folders: folders.map(f => ({ id: f.id, name: f.name })),
                totalFolders: folders.length,
            },
        });
    } catch (error) {
        console.error('Error in getFolders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch folders',
            error: error.message,
        });
    }
};
