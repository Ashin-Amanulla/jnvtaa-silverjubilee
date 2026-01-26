import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaImages, FaFolder } from "react-icons/fa";
import { getGalleryTree, fetchFolderImages } from "../../api/galleryApi";

/**
 * GalleryFolderGrid Component
 * Displays gallery folders as macOS-style stacked thumbnail cards
 */
const GalleryFolderGrid = ({ onFolderSelect }) => {
  const [folders, setFolders] = useState([]);
  const [folderThumbnails, setFolderThumbnails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getGalleryTree();
      if (response.success) {
        const allFolders = flattenFolders(response.data.folders || []);
        setFolders(allFolders);
        // Load thumbnails for each folder
        loadThumbnails(allFolders);
      } else {
        setError(response.message || "Failed to load galleries");
      }
    } catch (err) {
      console.error("Error loading galleries:", err);
      setError("Failed to load galleries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Flatten nested folder structure to get all leaf folders
  const flattenFolders = (folders, parentPath = "") => {
    let result = [];
    folders.forEach((folder) => {
      if (folder.children && folder.children.length > 0) {
        result = [...result, ...flattenFolders(folder.children, folder.path)];
      } else {
        result.push(folder);
      }
    });
    // If no leaf folders, return the top-level folders
    if (result.length === 0) {
      return folders;
    }
    return result;
  };

  const loadThumbnails = async (folders) => {
    const thumbnails = {};
    for (const folder of folders) {
      try {
        const response = await fetchFolderImages(folder.path);
        if (response.success && response.data.images) {
          // Get up to 4 images for the stacked thumbnail effect
          thumbnails[folder.path] = response.data.images.slice(0, 4);
        }
      } catch (err) {
        console.error(`Error loading thumbnails for ${folder.path}:`, err);
      }
    }
    setFolderThumbnails(thumbnails);
  };

  const handleFolderClick = (folder) => {
    if (onFolderSelect) {
      onFolderSelect(folder.path, folder.name);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-[#1A237E]/20 border-t-[#1A237E] rounded-full animate-spin mx-auto mb-6" />
        <p className="text-gray-600 text-lg font-medium">Loading galleries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 border-2 border-red-200 rounded-2xl p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadFolders}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-md">
        <FaFolder className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No galleries available yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {folders.map((folder, index) => {
        const thumbnails = folderThumbnails[folder.path] || [];
        return (
          <motion.div
            key={folder.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => handleFolderClick(folder)}
          >
            {/* Stacked Thumbnail Preview - macOS Style */}
            <div className="relative h-48 mb-3">
              {/* Background stacked cards */}
              {thumbnails.length >= 3 && (
                <div
                  className="absolute inset-x-3 top-0 h-40 bg-white rounded-xl shadow-sm transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300"
                  style={{
                    backgroundImage: thumbnails[2]
                      ? `url(${thumbnails[2].thumbnailLink})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              {thumbnails.length >= 2 && (
                <div
                  className="absolute inset-x-2 top-1 h-42 bg-white rounded-xl shadow-md transform rotate-2 group-hover:rotate-4 transition-transform duration-300"
                  style={{
                    backgroundImage: thumbnails[1]
                      ? `url(${thumbnails[1].thumbnailLink})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              )}
              {/* Main/Front card */}
              <div className="absolute inset-0 bg-white rounded-xl shadow-lg overflow-hidden group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300">
                {thumbnails.length > 0 ? (
                  <img
                    src={thumbnails[0].thumbnailLink}
                    alt={folder.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to main image URL if thumbnail fails to load
                      if (thumbnails[0].url && e.target.src !== thumbnails[0].url) {
                        e.target.src = thumbnails[0].url;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1A237E]/10 to-[#3949AB]/20 flex items-center justify-center">
                    <FaImages className="text-5xl text-[#1A237E]/30" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {/* Image count badge */}
              <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-md flex items-center gap-1.5 z-10">
                <FaImages className="w-3 h-3 text-[#1A237E]" />
                <span className="text-sm font-semibold text-gray-700">
                  {folder.imageCount || 0}
                </span>
              </div>
            </div>

            {/* Folder Name */}
            <div className="text-center px-2">
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-[#1A237E] transition-colors duration-300 line-clamp-2">
                {folder.name}
              </h3>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GalleryFolderGrid;
