import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaImages,
  FaExclamationTriangle,
  FaUpload,
  FaArrowLeft,
} from "react-icons/fa";
import { fetchFolderImages } from "../api/galleryApi";
import ImageGrid from "../components/gallery/ImageGrid";
import ImageLightbox from "../components/gallery/ImageLightbox";
import GalleryFolderGrid from "../components/gallery/GalleryFolderGrid";
import ImageUpload from "../components/gallery/ImageUpload";
import MainNavbar from "../components/shared/MainNavbar";
import Footer from "../components/home/Footer";

/**
 * GalleryPage Component
 * Main gallery page with folder filtering and image viewing
 */
const GalleryPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
  // null means show gallery folder grid, string means show specific folder images
  const [currentFolderPath, setCurrentFolderPath] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (currentFolderPath) {
      loadFolderImages(currentFolderPath);
    }
  }, [currentFolderPath]);

  const loadFolderImages = async (folderPath = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFolderImages(folderPath);

      if (response.success) {
        setDisplayImages(response.data.images || []);
        if (response.data.folder) {
          setCurrentFolderName(response.data.folder.name || "All Photos");
        }
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

  const handleFolderSelect = (folderPath, folderName) => {
    setCurrentFolderPath(folderPath);
    setCurrentFolderName(folderName || formatFolderName(folderPath));
  };

  const formatFolderName = (path) => {
    if (!path) return "";
    const parts = path.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleBackToGalleries = () => {
    setCurrentFolderPath(null);
    setCurrentFolderName("");
    setDisplayImages([]);
  };

  const handleUploadSuccess = () => {
    // Refresh images after successful upload
    loadFolderImages(currentFolderPath);
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
          {/* Show Gallery Folder Grid when no folder is selected */}
          {!currentFolderPath && (
            <GalleryFolderGrid onFolderSelect={handleFolderSelect} />
          )}

          {/* Show folder images when a folder is selected */}
          {currentFolderPath && (
            <div>
              {/* Gallery Header with Back Button and Upload */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToGalleries}
                    className="flex items-center gap-2 px-4 py-2 text-[#1A237E] hover:bg-[#1A237E]/10 rounded-lg transition-colors font-semibold"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    Back to Galleries
                  </button>
                  <div className="border-l border-gray-300 pl-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {currentFolderName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {displayImages.length}{" "}
                      {displayImages.length === 1 ? "image" : "images"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#1A237E] hover:bg-[#283593] text-white font-semibold rounded-lg transition-colors"
                >
                  <FaUpload className="w-4 h-4" />
                  Upload Photos
                </button>
              </motion.div>

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
                    onClick={() => loadFolderImages(currentFolderPath)}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {/* Image Grid - Without selection functionality */}
              {!loading && !error && displayImages.length > 0 && (
                <ImageGrid
                  images={displayImages}
                  onImageClick={handleImageClick}
                />
              )}

              {/* Empty State */}
              {!loading && !error && displayImages.length === 0 && (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                  <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">
                    No images available in this gallery yet
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-[#1A237E] hover:bg-[#283593] text-white font-semibold rounded-lg transition-colors mx-auto"
                  >
                    <FaUpload className="w-4 h-4" />
                    Upload Photos
                  </button>
                </div>
              )}
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

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ImageUpload
                galleryPath={currentFolderPath}
                onUploadSuccess={handleUploadSuccess}
                onClose={() => setShowUploadModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default GalleryPage;
