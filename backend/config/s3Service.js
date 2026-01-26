const { S3Client, ListObjectsV2Command, GetObjectCommand, DeleteObjectsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

/**
 * AWS S3 Configuration for Gallery
 * Bucket: jnv-tvm
 */

// Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = 'jnv-tvm';

/**
 * Hardcoded gallery folder configuration
 * Bucket: jnv-tvm
 * Subfolders: alumni-meet-2026, school-old-photos
 */
const GALLERY_FOLDERS = [
    {
        path: 'alumni-meet-2026',
        name: 'Alumni Meet 2026',
        children: [],
    },
    {
        path: 'school-old-photos',
        name: 'School Old Photos',
        children: [],
    },
];

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
 * List all image files in a folder/prefix (with pagination support)
 * @param {string} prefix - S3 folder prefix
 * @param {string} folderName - Display name for the folder
 * @param {string} folderId - ID for the folder
 * @returns {Promise<Array>} Array of image objects
 */
async function listImagesFromFolder(prefix, folderName, folderId) {
    try {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
        const allImageFiles = [];
        let continuationToken = null;

        // Paginate through all objects in the folder
        do {
            const command = new ListObjectsV2Command({
                Bucket: BUCKET_NAME,
                Prefix: prefix,
                ContinuationToken: continuationToken,
            });

            const response = await s3Client.send(command);
            const contents = response.Contents || [];

            // Filter for image files (exclude thumbnails folder)
            const imageFiles = contents.filter(file => {
                const key = file.Key.toLowerCase();
                // Exclude files in thumbnails folder
                if (key.includes('/thumbnails/')) {
                    return false;
                }
                return imageExtensions.some(ext => key.endsWith(ext));
            });

            allImageFiles.push(...imageFiles);
            continuationToken = response.NextContinuationToken;
        } while (continuationToken);

        // Generate URLs for each image
        const images = await Promise.all(
            allImageFiles.map(async (file) => {
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

                // Generate thumbnail URL - thumbnails are stored in {prefix}/thumbnails/{filename}
                let thumbnailUrl = url; // Default to main image URL
                const region = process.env.AWS_REGION || 'ap-south-1';
                
                // Construct thumbnail key: insert 'thumbnails' folder before filename
                const keyParts = file.Key.split('/');
                const filename = keyParts.pop();
                const thumbnailKey = keyParts.length > 0 
                    ? `${keyParts.join('/')}/thumbnails/${filename}`
                    : `thumbnails/${filename}`;
                
                // Generate thumbnail URL (we'll use it even if thumbnail doesn't exist yet - S3 will return 404 if missing)
                if (usePublicUrls) {
                    const encodedThumbnailKey = thumbnailKey.split('/').map(part => encodeURIComponent(part)).join('/');
                    thumbnailUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${encodedThumbnailKey}`;
                } else {
                    // For signed URLs, we'd need to check if thumbnail exists first
                    // For now, use main URL as fallback
                    thumbnailUrl = url;
                }

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

/**
 * Delete objects from S3 bucket
 * @param {Array<string>} keys - Array of S3 object keys to delete
 * @returns {Promise<Object>} Result object with deleted and errors
 */
async function deleteObjectsFromS3(keys) {
    try {
        if (!keys || keys.length === 0) {
            throw new Error('No keys provided for deletion');
        }

        // S3 DeleteObjects can handle up to 1000 objects per request
        // For bulk operations, we'll process in batches of 1000
        const batchSize = 1000;
        const results = {
            deleted: [],
            errors: [],
        };

        for (let i = 0; i < keys.length; i += batchSize) {
            const batch = keys.slice(i, i + batchSize);
            
            const command = new DeleteObjectsCommand({
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: batch.map(key => ({ Key: key })),
                    Quiet: false, // Return detailed response
                },
            });

            const response = await s3Client.send(command);
            
            // Collect successfully deleted keys
            if (response.Deleted) {
                results.deleted.push(...response.Deleted.map(item => item.Key));
            }

            // Collect errors
            if (response.Errors) {
                results.errors.push(...response.Errors.map(error => ({
                    key: error.Key,
                    code: error.Code,
                    message: error.Message,
                })));
            }
        }

        return results;
    } catch (error) {
        console.error('Error deleting objects from S3:', error.message);
        throw error;
    }
}

/**
 * Upload image to S3 bucket
 * @param {Buffer} fileBuffer - File buffer to upload
 * @param {string} folderPath - S3 folder path (e.g., 'jnv-tvm/alumni-meet-2026')
 * @param {string} fileName - Original filename
 * @param {string} contentType - MIME type of the file
 * @param {Buffer} thumbnailBuffer - Optional thumbnail buffer
 * @returns {Promise<Object>} Upload result with key, URL, and thumbnail URL
 */
async function uploadImageToS3(fileBuffer, folderPath, fileName, contentType, thumbnailBuffer = null) {
    try {
        // Sanitize folder path and filename
        const sanitizedPath = folderPath.replace(/^\/+|\/+$/g, '').replace(/\.\./g, '');
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        
        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const uniqueFileName = `${timestamp}-${randomSuffix}-${sanitizedFileName}`;
        
        // Construct S3 keys
        const key = sanitizedPath ? `${sanitizedPath}/${uniqueFileName}` : uniqueFileName;
        const thumbnailKey = thumbnailBuffer 
            ? (sanitizedPath ? `${sanitizedPath}/thumbnails/${uniqueFileName}` : `thumbnails/${uniqueFileName}`)
            : null;

        const region = process.env.AWS_REGION || 'ap-south-1';

        // Upload main image to S3
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: contentType,
            CacheControl: 'max-age=31536000', // Cache for 1 year
        });

        await s3Client.send(command);

        // Upload thumbnail if provided
        let thumbnailUrl = null;
        if (thumbnailBuffer && thumbnailKey) {
            const thumbnailCommand = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: thumbnailKey,
                Body: thumbnailBuffer,
                ContentType: 'image/jpeg',
                CacheControl: 'max-age=31536000', // Cache for 1 year
            });

            await s3Client.send(thumbnailCommand);

            // Generate thumbnail URL
            const encodedThumbnailKey = thumbnailKey.split('/').map(part => encodeURIComponent(part)).join('/');
            thumbnailUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${encodedThumbnailKey}`;
        }

        // Generate public URL
        const encodedKey = key.split('/').map(part => encodeURIComponent(part)).join('/');
        const url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${encodedKey}`;

        return {
            key,
            url,
            thumbnailKey: thumbnailKey || null,
            thumbnailUrl: thumbnailUrl || url, // Fallback to main URL if no thumbnail
            fileName: uniqueFileName,
        };
    } catch (error) {
        console.error('Error uploading image to S3:', error.message);
        throw error;
    }
}

/**
 * Get image count for a specific folder path from S3
 * @param {string} folderPath - Folder path (e.g., 'jnv-tvm/alumni-meet-2026')
 * @returns {Promise<number>} Number of images in the folder
 */
async function getImageCountForFolder(folderPath) {
    try {
        const prefix = folderPath ? `${folderPath}/` : '';
        const command = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: prefix,
        });

        let continuationToken = null;
        let imageCount = 0;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

        // Paginate through all objects
        do {
            const response = await s3Client.send(new ListObjectsV2Command({
                Bucket: BUCKET_NAME,
                Prefix: prefix,
                ContinuationToken: continuationToken,
            }));

            if (response.Contents) {
                // Count only image files
                imageCount += response.Contents.filter(obj => {
                    const key = obj.Key.toLowerCase();
                    return imageExtensions.some(ext => key.endsWith(ext));
                }).length;
            }

            continuationToken = response.NextContinuationToken;
        } while (continuationToken);

        return imageCount;
    } catch (error) {
        console.error(`Error getting image count for folder ${folderPath}:`, error.message);
        return 0; // Return 0 on error to prevent breaking the UI
    }
}

/**
 * List folders using hardcoded configuration with S3 image counts
 * @param {string} prefix - Optional prefix to start from (default: '') - not used with hardcoded folders
 * @returns {Promise<Array>} Hierarchical folder structure with image counts
 */
async function listFoldersRecursively(prefix = '') {
    try {
        // Use hardcoded folder structure
        const folders = JSON.parse(JSON.stringify(GALLERY_FOLDERS)); // Deep clone

        // Fetch image counts for each folder from S3
        const countPromises = [];

        // Function to recursively process folders and add image counts
        const processFolder = async (folder) => {
            // Get image count for this folder
            const imageCount = await getImageCountForFolder(folder.path);
            folder.imageCount = imageCount;

            // Process children recursively
            if (folder.children && folder.children.length > 0) {
                await Promise.all(folder.children.map(child => processFolder(child)));
            }
        };

        // Process all folders in parallel
        await Promise.all(folders.map(folder => processFolder(folder)));

        return folders;
    } catch (error) {
        console.error('Error listing folders recursively from S3:', error.message);
        throw error;
    }
}

module.exports = {
    s3Client,
    getS3Client,
    getBucketName,
    getConfiguredFolders,
    listImagesFromFolder,
    deleteObjectsFromS3,
    uploadImageToS3,
    listFoldersRecursively,
};
