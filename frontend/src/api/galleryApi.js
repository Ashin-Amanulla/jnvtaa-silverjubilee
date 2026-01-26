import axiosInstance from './axios';

/**
 * Fetch all gallery images from all configured folders
 */
export const fetchAllImages = async () => {
    try {
        const response = await axiosInstance.get('/gallery/images');
        return response.data;
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        throw error;
    }
};

/**
 * Fetch a single random image (optimized)
 */
export const fetchRandomImage = async () => {
    try {
        const response = await axiosInstance.get('/gallery/random');
        return response.data;
    } catch (error) {
        // Don't log 404s as errors in console as they might be expected if no images exist yet
        if (error.response && error.response.status !== 404) {
            console.error('Error fetching random image:', error);
        }
        throw error;
    }
};

/**
 * Fetch images from a specific folder (supports nested paths)
 * @param {string} folderPath - Folder path (e.g., 'jnv-tvm/alumni-meet-2026' or folderId for backward compatibility)
 */
export const fetchFolderImages = async (folderPath) => {
    try {
        const response = await axiosInstance.get(`/gallery/folders/${folderPath}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching images from folder ${folderPath}:`, error);
        throw error;
    }
};

/**
 * Fetch list of configured folders
 */
export const fetchFolders = async () => {
    try {
        const response = await axiosInstance.get('/gallery/folders');
        return response.data;
    } catch (error) {
        console.error('Error fetching folders:', error);
        throw error;
    }
};

/**
 * Delete gallery images from S3
 * @param {Array<string>} keys - Array of S3 object keys to delete
 * @returns {Promise<Object>} Response data with deletion results
 */
export const deleteGalleryImages = async (keys) => {
    try {
        const response = await axiosInstance.delete('/gallery/images', {
            data: { keys },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting gallery images:', error);
        throw error;
    }
};

/**
 * Get hierarchical folder tree structure
 * @returns {Promise<Object>} Response data with folder tree
 */
export const getGalleryTree = async () => {
    try {
        const response = await axiosInstance.get('/gallery/tree');
        return response.data;
    } catch (error) {
        console.error('Error fetching gallery tree:', error);
        throw error;
    }
};

/**
 * Upload images to a specific gallery folder
 * @param {string} galleryPath - Gallery folder path (e.g., 'jnv-tvm/alumni-meet-2026')
 * @param {FileList|Array<File>} files - Files to upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} Response data with uploaded image URLs
 */
export const uploadToGallery = async (galleryPath, files, onProgress) => {
    try {
        // Create FormData
        const formData = new FormData();
        
        // Append files to FormData
        Array.from(files).forEach((file) => {
            formData.append('images', file);
        });

        // Make request with multipart/form-data
        const response = await axiosInstance.post(
            `/gallery/upload/${galleryPath}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                },
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
};
