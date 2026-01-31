import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaImages, FaFolder } from "react-icons/fa";
import { getGalleryTree, fetchFolderImages } from "../../api/galleryApi";

/**
 * GalleryFolderGrid Component
 * Displays gallery folders as premium dark-themed cards with hover effects
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

  const flattenFolders = (folders, parentPath = "") => {
    let result = [];
    folders.forEach((folder) => {
      if (folder.children && folder.children.length > 0) {
        result = [...result, ...flattenFolders(folder.children, folder.path)];
      } else {
        result.push(folder);
      }
    });
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
      <div className="text-center py-24">
        <div className="w-20 h-20 border-3 border-[var(--color-accent-coral)]/20 border-t-[var(--color-accent-coral)] rounded-full animate-spin mx-auto mb-8" />
        <p className="text-[var(--color-text-muted)] text-lg font-display tracking-[0.3em] uppercase">
          Loading Galleries...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 bg-[var(--color-bg-primary)] border border-[var(--color-accent-coral)]/30 p-12">
        <p className="text-[var(--color-accent-coral)] mb-6 text-lg">{error}</p>
        <button
          onClick={loadFolders}
          className="btn-primary"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-24 bg-[var(--color-bg-primary)] border border-[var(--color-text-primary)]/10 p-12">
        <FaFolder className="text-7xl text-[var(--color-text-primary)]/20 mx-auto mb-6" />
        <p className="text-[var(--color-text-muted)] text-lg font-display tracking-wider">
          NO GALLERIES AVAILABLE YET
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {folders.map((folder, index) => {
        const thumbnails = folderThumbnails[folder.path] || [];
        return (
          <motion.div
            key={folder.path}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => handleFolderClick(folder)}
          >
            {/* Card Container */}
            <motion.div
              className="relative bg-[var(--color-bg-primary)] border border-[var(--color-text-primary)]/10 hover:border-[var(--color-accent-coral)] transition-all duration-500 overflow-hidden"
              whileHover={{ y: -8 }}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* Stacked thumbnails background effect */}
                {thumbnails.length >= 3 && (
                  <div
                    className="absolute inset-2 bg-[var(--color-bg-secondary)] rounded transform -rotate-2 group-hover:-rotate-4 transition-transform duration-500 opacity-60"
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
                    className="absolute inset-1 bg-[var(--color-bg-secondary)] rounded transform rotate-1 group-hover:rotate-3 transition-transform duration-500 opacity-80"
                    style={{
                      backgroundImage: thumbnails[1]
                        ? `url(${thumbnails[1].thumbnailLink})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}
                
                {/* Main Image */}
                <div className="absolute inset-0 overflow-hidden">
                  {thumbnails.length > 0 ? (
                    <img
                      src={thumbnails[0].thumbnailLink}
                      alt={folder.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        if (thumbnails[0].url && e.target.src !== thumbnails[0].url) {
                          e.target.src = thumbnails[0].url;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-accent-coral)]/10 to-[var(--color-accent-cyan)]/10 flex items-center justify-center">
                      <FaImages className="text-6xl text-[var(--color-text-primary)]/20" />
                    </div>
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Image Count Badge */}
                <div className="absolute top-4 right-4 bg-[var(--color-accent-coral)] rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg">
                  <FaImages className="w-3.5 h-3.5 text-white" />
                  <span className="text-sm font-display font-bold text-white tracking-wide">
                    {folder.imageCount || 0}
                  </span>
                </div>

                {/* Folder Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl text-white mb-1 group-hover:text-[var(--color-accent-coral)] transition-colors duration-300 line-clamp-2">
                    {folder.name.toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="text-[var(--color-accent-coral)] font-display text-sm tracking-wider">
                      VIEW GALLERY
                    </span>
                    <span className="text-[var(--color-accent-coral)]">→</span>
                  </div>
                </div>

                {/* Corner Accent */}
                <div 
                  className="absolute -bottom-4 -right-4 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ 
                    background: 'linear-gradient(135deg, transparent 50%, rgba(255,107,107,0.2) 50%)' 
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GalleryFolderGrid;
