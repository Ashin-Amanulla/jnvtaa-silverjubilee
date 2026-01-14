const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

/**
 * AWS S3 Configuration for Gallery
 * Bucket: school-jnv
 */

// Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'school-jnv';

/**
 * Get configured folders/prefixes from environment
 * @returns {Array} Array of folder configuration objects
 */
function getConfiguredFolders() {
    const folderPrefixes = process.env.S3_FOLDER_PREFIXES || '';
    const folderNames = process.env.S3_FOLDER_NAMES || '';

    const prefixes = folderPrefixes.split(',').map(p => p.trim()).filter(Boolean);
    const names = folderNames.split(',').map(name => name.trim()).filter(Boolean);

    // If no specific folders configured, return root folder
    if (prefixes.length === 0) {
        return [{ id: 'root', name: 'All Photos', prefix: '' }];
    }

    return prefixes.map((prefix, index) => ({
        id: prefix.replace(/\//g, '-') || 'root', // Create ID from prefix
        name: names[index] || `Album ${index + 1}`,
        prefix: prefix.endsWith('/') ? prefix : `${prefix}/`,
    }));
}

/**
 * List all image files in a folder/prefix
 * @param {string} prefix - S3 folder prefix
 * @param {string} folderName - Display name for the folder
 * @param {string} folderId - ID for the folder
 * @returns {Promise<Array>} Array of image objects
 */
async function listImagesFromFolder(prefix, folderName, folderId) {
    try {
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
        });

        const response = await s3Client.send(command);
        const contents = response.Contents || [];

        // Filter for image files
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        const imageFiles = contents.filter(file => {
            const key = file.Key.toLowerCase();
            return imageExtensions.some(ext => key.endsWith(ext));
        });

        // Generate URLs for each image
        const images = await Promise.all(
            imageFiles.map(async (file) => {
                let url;

                // Check if we should use public URLs (better for caching)
                const usePublicUrls = process.env.USE_PUBLIC_S3_URLS !== 'false'; // Default to true

                if (usePublicUrls) {
                    // Public URL format: https://bucket-name.s3.region.amazonaws.com/key
                    const region = process.env.AWS_REGION || 'ap-south-1';
                    // Handle special characters in key for valid URL
                    const encodedKey = file.Key.split('/').map(part => encodeURIComponent(part)).join('/');
                    url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${encodedKey}`;
                } else {
                    // Fallback to signed URLs
                    const getCommand = new GetObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: file.Key,
                    });
                    // Generate presigned URL valid for 1 hour
                    url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
                }

                // Generate thumbnail URL (same as main URL for now)
                const thumbnailUrl = url;

                // Extract filename from key
                const fileName = file.Key.split('/').pop();

                return {
                    id: file.Key.replace(/[^a-zA-Z0-9]/g, '-'),
                    name: fileName,
                    key: file.Key,
                    url: url,
                    thumbnailLink: thumbnailUrl,
                    createdTime: file.LastModified?.toISOString(),
                    modifiedTime: file.LastModified?.toISOString(),
                    size: file.Size,
                    folder: {
                        id: folderId,
                        name: folderName,
                    },
                };
            })
        );

        return images;
    } catch (error) {
        console.error(`Error listing images from S3 prefix ${prefix}:`, error.message);
        throw error;
    }
}

/**
 * Get S3 client instance
 */
function getS3Client() {
    return s3Client;
}

/**
 * Get bucket name
 */
function getBucketName() {
    return BUCKET_NAME;
}

module.exports = {
    s3Client,
    getS3Client,
    getBucketName,
    getConfiguredFolders,
    listImagesFromFolder,
};
