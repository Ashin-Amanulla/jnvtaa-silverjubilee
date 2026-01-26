import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFolder, FaFolderOpen, FaChevronRight, FaChevronDown, FaImages } from 'react-icons/fa';
import { getGalleryTree } from '../../api/galleryApi';

/**
 * GalleryTree Component
 * Displays hierarchical folder structure with navigation
 */
const GalleryTree = ({ onFolderSelect, currentPath = '' }) => {
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        loadFolderTree();
    }, []);

    useEffect(() => {
        // Update breadcrumbs based on current path
        if (currentPath) {
            const parts = currentPath.split('/').filter(Boolean);
            const crumbs = [{ path: '', name: 'All Galleries' }];
            let currentPathAcc = '';
            parts.forEach((part) => {
                currentPathAcc = currentPathAcc ? `${currentPathAcc}/${part}` : part;
                const displayName = part
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                crumbs.push({ path: currentPathAcc, name: displayName });
            });
            setBreadcrumbs(crumbs);
        } else {
            setBreadcrumbs([{ path: '', name: 'All Galleries' }]);
        }
    }, [currentPath]);

    const loadFolderTree = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getGalleryTree();
            if (response.success) {
                setFolders(response.data.folders || []);
            } else {
                setError(response.message || 'Failed to load gallery structure');
            }
        } catch (err) {
            console.error('Error loading gallery tree:', err);
            setError(
                err.response?.data?.message ||
                    'Failed to load gallery structure. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleFolder = (folderPath) => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(folderPath)) {
                newSet.delete(folderPath);
            } else {
                newSet.add(folderPath);
            }
            return newSet;
        });
    };

    const handleFolderClick = (folderPath, e) => {
        e.stopPropagation();
        if (onFolderSelect) {
            onFolderSelect(folderPath);
        }
    };

    const handleBreadcrumbClick = (path) => {
        if (onFolderSelect) {
            onFolderSelect(path);
        }
    };

    const renderFolder = (folder, level = 0) => {
        const isExpanded = expandedFolders.has(folder.path);
        const hasChildren = folder.children && folder.children.length > 0;
        const isCurrentPath = currentPath === folder.path;

        return (
            <div key={folder.path} className="mb-1">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        isCurrentPath
                            ? 'bg-[#1A237E] text-white'
                            : 'hover:bg-[#1A237E]/10 text-gray-700'
                    }`}
                    style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
                    onClick={(e) => handleFolderClick(folder.path, e)}
                >
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFolder(folder.path);
                            }}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                            {isExpanded ? (
                                <FaChevronDown className="w-3 h-3" />
                            ) : (
                                <FaChevronRight className="w-3 h-3" />
                            )}
                        </button>
                    )}
                    {!hasChildren && <div className="w-5" />}
                    {isExpanded ? (
                        <FaFolderOpen className="w-4 h-4 flex-shrink-0" />
                    ) : (
                        <FaFolder className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="flex-1 font-medium truncate">{folder.name}</span>
                    {folder.imageCount > 0 && (
                        <span
                            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                isCurrentPath
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            <FaImages className="w-3 h-3" />
                            {folder.imageCount}
                        </span>
                    )}
                </motion.div>
                {hasChildren && isExpanded && (
                    <div className="mt-1">
                        {folder.children.map((child) => renderFolder(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-[#1A237E]/20 border-t-[#1A237E] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 text-sm">Loading gallery structure...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm mb-2">{error}</p>
                <button
                    onClick={loadFolderTree}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                    <nav className="flex items-center gap-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.path}>
                                <button
                                    onClick={() => handleBreadcrumbClick(crumb.path)}
                                    className={`hover:text-[#1A237E] transition-colors ${
                                        index === breadcrumbs.length - 1
                                            ? 'text-[#1A237E] font-semibold'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {crumb.name}
                                </button>
                                {index < breadcrumbs.length - 1 && (
                                    <span className="text-gray-400">/</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>
            )}

            {/* Folder Tree */}
            <div className="max-h-96 overflow-y-auto">
                {folders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No galleries found. Upload images to create galleries.
                    </div>
                ) : (
                    folders.map((folder) => renderFolder(folder))
                )}
            </div>
        </div>
    );
};

export default GalleryTree;
