import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCloudUploadAlt,
    FaTimes,
    FaCheckCircle,
    FaExclamationCircle,
    FaImage,
} from 'react-icons/fa';
import { uploadToGallery } from '../../api/galleryApi';

/**
 * ImageUpload Component
 * Drag-and-drop file upload with preview and progress
 */
const ImageUpload = ({ galleryPath, onUploadSuccess, onClose }) => {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Maximum file size: 10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

    const validateFile = (file) => {
        if (!allowedTypes.includes(file.type)) {
            return {
                valid: false,
                error: `Invalid file type. Allowed: JPG, PNG, GIF, WEBP, BMP`,
            };
        }
        if (file.size > MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `File size exceeds 10MB limit`,
            };
        }
        return { valid: true };
    };

    const handleFileSelect = (selectedFiles) => {
        const fileArray = Array.from(selectedFiles);
        const validFiles = [];
        const errors = [];

        fileArray.forEach((file) => {
            const validation = validateFile(file);
            if (validation.valid) {
                validFiles.push(file);
            } else {
                errors.push(`${file.name}: ${validation.error}`);
            }
        });

        if (errors.length > 0) {
            setError(errors.join('\n'));
        }

        if (validFiles.length > 0) {
            const newFiles = [...files, ...validFiles];
            setFiles(newFiles);

            // Generate previews
            const newPreviews = [];
            validFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newPreviews.push({
                        file,
                        preview: e.target.result,
                        name: file.name,
                        size: file.size,
                    });
                    if (newPreviews.length === validFiles.length) {
                        setPreviews((prev) => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFileSelect(droppedFiles);
        }
    };

    const handleFileInputChange = (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles.length > 0) {
            handleFileSelect(selectedFiles);
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError('Please select at least one image to upload');
            return;
        }

        try {
            setUploading(true);
            setError(null);
            setUploadProgress(0);

            const response = await uploadToGallery(
                galleryPath || '',
                files,
                (progress) => {
                    setUploadProgress(progress);
                }
            );

            if (response.success) {
                setSuccess(true);
                setFiles([]);
                setPreviews([]);
                
                // Call success callback after a short delay
                setTimeout(() => {
                    if (onUploadSuccess) {
                        onUploadSuccess(response.data);
                    }
                    if (onClose) {
                        onClose();
                    }
                }, 1500);
            } else {
                setError(response.message || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(
                err.response?.data?.message ||
                    'Failed to upload images. Please try again.'
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Upload Photos</h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={uploading}
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Success Message */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                    >
                        <FaCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-800 font-medium">
                            Images uploaded successfully!
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                        <div className="flex items-start gap-3">
                            <FaExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-800 font-medium mb-1">Upload Error</p>
                                <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Drop Zone */}
            <div
                ref={dropZoneRef}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                        ? 'border-[#1A237E] bg-[#1A237E]/5'
                        : 'border-gray-300 hover:border-[#1A237E]/50'
                }`}
            >
                <FaCloudUploadAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                    Drag and drop images here, or click to select
                </p>
                <p className="text-gray-500 text-sm mb-4">
                    Supported formats: JPG, PNG, GIF, WEBP, BMP (Max 10MB per file)
                </p>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-6 py-2 bg-[#1A237E] hover:bg-[#283593] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                    Select Files
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={uploading}
                />
            </div>

            {/* File Previews */}
            {previews.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Selected Files ({previews.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                        {previews.map((preview, index) => (
                            <div
                                key={index}
                                className="relative group border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <img
                                    src={preview.preview}
                                    alt={preview.name}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => removeFile(index)}
                                        disabled={uploading}
                                        className="text-white hover:text-red-400 transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-2 bg-white">
                                    <p className="text-xs text-gray-600 truncate" title={preview.name}>
                                        {preview.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {formatFileSize(preview.size)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {uploading && (
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Uploading...</span>
                        <span className="text-sm text-gray-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="bg-[#1A237E] h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {previews.length > 0 && !success && (
                <div className="mt-6 flex gap-3 justify-end">
                    {onClose && (
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="px-6 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                        className="px-6 py-2 bg-[#1A237E] hover:bg-[#283593] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FaImage className="w-4 h-4" />
                                Upload {files.length} {files.length === 1 ? 'Image' : 'Images'}
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
