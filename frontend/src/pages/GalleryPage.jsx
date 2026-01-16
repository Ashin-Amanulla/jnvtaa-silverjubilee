import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaImages,
  FaExclamationTriangle,
  FaTrash,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";
import { fetchAllImages, deleteGalleryImages } from "../api/galleryApi";
import ImageGrid from "../components/gallery/ImageGrid";
import ImageLightbox from "../components/gallery/ImageLightbox";
import MainNavbar from "../components/shared/MainNavbar";
import Footer from "../components/home/Footer";

/**
 * GalleryPage Component
 * Main gallery page with folder filtering and image viewing
 */
const GalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [imagesByFolder, setImagesByFolder] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAllImages();

      if (response.success) {
        setAllImages(response.data.allImages || []);
        setImagesByFolder(response.data.imagesByFolder || []);
      } else {
        setError(response.message || "Failed to load gallery images");
      }
    } catch (err) {
      console.error("Error loading gallery:", err);
      setError(
        err.response?.data?.message ||
          "Failed to connect to the server. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleLightboxNavigate = (newIndex) => {
    setCurrentImageIndex(newIndex);
  };

  // Get images to display based on selected folder
  const displayImages =
    selectedFolder === "all"
      ? allImages
      : imagesByFolder.find((f) => f.folder.id === selectedFolder)?.images ||
        [];

  // Handle selection toggle
  const handleSelectionToggle = (imageKey) => {
    setSelectedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageKey)) {
        newSet.delete(imageKey);
      } else {
        newSet.add(imageKey);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedKeys.size === displayImages.length) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(displayImages.map((img) => img.key)));
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedKeys(new Set());
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    if (selectedKeys.size > 0) {
      setShowDeleteConfirm(true);
    }
  };

  // Handle delete confirmation cancel
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Handle delete confirmation confirm
  const handleDeleteConfirm = async () => {
    if (selectedKeys.size === 0) return;

    try {
      setDeleting(true);
      setShowDeleteConfirm(false);

      const keysToDelete = Array.from(selectedKeys);
      const response = await deleteGalleryImages(keysToDelete);

      if (response.success || response.data?.deletedCount > 0) {
        // Clear selection
        setSelectedKeys(new Set());

        // Refresh gallery
        await loadGalleryImages();
      } else {
        setError(response.message || "Failed to delete images");
      }
    } catch (err) {
      console.error("Error deleting images:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete images. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Clear selection when folder changes
  useEffect(() => {
    setSelectedKeys(new Set());
  }, [selectedFolder]);

  return (
    <div className="min-h-screen bg-[#FDF4E6]">
      <MainNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1A237E] via-[#283593] to-[#3949AB] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] animate-[slide_20s_linear_infinite]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <FaImages className="text-6xl mb-6 mx-auto" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl text-white/90">
              Relive the memories through our collection of moments captured
              during the event
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Bulk Action Controls */}
          {!loading && !error && displayImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1A237E] hover:bg-[#1A237E]/10 rounded-lg transition-colors"
                >
                  {selectedKeys.size === displayImages.length ? (
                    <>
                      <FaCheckSquare className="w-5 h-5" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <FaSquare className="w-5 h-5" />
                      Select All
                    </>
                  )}
                </button>
                {selectedKeys.size > 0 && (
                  <>
                    <span className="text-sm text-gray-600">
                      {selectedKeys.size} image
                      {selectedKeys.size !== 1 ? "s" : ""} selected
                    </span>
                    <button
                      onClick={handleClearSelection}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
              {selectedKeys.size > 0 && (
                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                  {deleting
                    ? "Deleting..."
                    : `Delete ${selectedKeys.size} Image${
                        selectedKeys.size !== 1 ? "s" : ""
                      }`}
                </button>
              )}
            </motion.div>
          )}

          {/* Folder Filter Tabs */}
          {!loading && !error && imagesByFolder.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedFolder("all")}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    selectedFolder === "all"
                      ? "bg-[#1A237E] text-white shadow-lg scale-105"
                      : "bg-white text-[#1A237E] hover:bg-[#1A237E]/10"
                  }`}
                >
                  All Photos ({allImages.length})
                </button>
                {imagesByFolder.map((folderData) => (
                  <button
                    key={folderData.folder.id}
                    onClick={() => setSelectedFolder(folderData.folder.id)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      selectedFolder === folderData.folder.id
                        ? "bg-[#1A237E] text-white shadow-lg scale-105"
                        : "bg-white text-[#1A237E] hover:bg-[#1A237E]/10"
                    }`}
                  >
                    {folderData.folder.name} ({folderData.images.length})
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-[#1A237E]/20 border-t-[#1A237E] rounded-full animate-spin mx-auto mb-6" />
              <p className="text-gray-600 text-lg font-medium">
                Loading gallery...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
            >
              <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-800 mb-3">
                Unable to Load Gallery
              </h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={loadGalleryImages}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Image Grid */}
          {!loading && !error && (
            <ImageGrid
              images={displayImages}
              onImageClick={handleImageClick}
              selectedKeys={selectedKeys}
              onSelectionToggle={handleSelectionToggle}
            />
          )}

          {/* Empty State */}
          {!loading && !error && displayImages.length === 0 && (
            <div className="text-center py-20">
              <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No images available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && displayImages.length > 0 && (
        <ImageLightbox
          images={displayImages}
          currentIndex={currentImageIndex}
          onClose={handleLightboxClose}
          onNavigate={handleLightboxNavigate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedKeys.size} image
              {selectedKeys.size !== 1 ? "s" : ""}? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
