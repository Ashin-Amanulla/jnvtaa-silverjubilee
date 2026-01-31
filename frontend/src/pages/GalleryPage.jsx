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
import PageLayout from "../components/shared/PageLayout";
import { KineticText } from "../components/artistic";

/**
 * GalleryPage Component
 * Main gallery page with folder filtering and image viewing - Artistic redesign
 */
const GalleryPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayImages, setDisplayImages] = useState([]);
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
    <PageLayout>
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-[var(--color-bg-primary)]">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full border border-[var(--color-accent-cyan)]/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-[20%] left-[5%] w-48 h-48 rounded-full bg-[var(--color-accent-gold)]/10 blur-3xl"
          />
        </div>

        <div className="container-asymmetric relative z-10 py-32">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-[2px] bg-[var(--color-accent-cyan)]" />
              <span className="text-[var(--color-accent-cyan)] font-display text-sm tracking-[0.3em] uppercase">
                Memories Captured
              </span>
            </motion.div>

            <div className="space-y-2 mb-8">
              <KineticText
                as="h1"
                variant="words"
                delay={0.3}
                className="font-display text-display text-[var(--color-text-primary)] leading-[0.9]"
              >
                GALLERY
              </KineticText>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed"
            >
              Relive the memories through our collection of moments captured during events and gatherings.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ============================================
          GALLERY CONTENT
          ============================================ */}
      <section className="py-20 bg-[var(--color-bg-secondary)]">
        <div className="container-asymmetric">
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
                className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-[var(--color-bg-primary)] border border-[var(--color-text-primary)]/20 p-6"
              >
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleBackToGalleries}
                    className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-primary)] border border-[var(--color-text-primary)]/20 hover:border-[var(--color-accent-coral)] hover:text-[var(--color-accent-coral)] transition-all font-display text-sm tracking-wider"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    BACK
                  </button>
                  <div className="border-l border-[var(--color-text-primary)]/20 pl-6">
                    <h2 className="font-display text-2xl text-[var(--color-text-primary)] mb-1">
                      {currentFolderName.toUpperCase()}
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {displayImages.length}{" "}
                      {displayImages.length === 1 ? "image" : "images"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn-primary"
                >
                  <FaUpload className="w-4 h-4" />
                  <span>UPLOAD PHOTOS</span>
                </button>
              </motion.div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 border-2 border-[var(--color-accent-coral)]/20 border-t-[var(--color-accent-coral)] rounded-full animate-spin mx-auto mb-6" />
                  <p className="text-[var(--color-text-muted)] text-lg font-display tracking-wider">
                    LOADING GALLERY...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto card-brutal p-12 text-center"
                >
                  <FaExclamationTriangle className="text-5xl text-[var(--color-accent-coral)] mx-auto mb-6" />
                  <h3 className="font-display text-2xl text-[var(--color-text-primary)] mb-4">
                    UNABLE TO LOAD GALLERY
                  </h3>
                  <p className="text-[var(--color-text-muted)] mb-8">{error}</p>
                  <button
                    onClick={() => loadFolderImages(currentFolderPath)}
                    className="btn-primary"
                  >
                    TRY AGAIN
                  </button>
                </motion.div>
              )}

              {/* Image Grid */}
              {!loading && !error && displayImages.length > 0 && (
                <ImageGrid
                  images={displayImages}
                  onImageClick={handleImageClick}
                />
              )}

              {/* Empty State */}
              {!loading && !error && displayImages.length === 0 && (
                <div className="text-center py-20 card-brutal p-12">
                  <FaImages className="text-6xl text-[var(--color-text-primary)]/20 mx-auto mb-6" />
                  <p className="text-[var(--color-text-muted)] text-lg mb-6">
                    No images available in this gallery yet
                  </p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary"
                  >
                    <FaUpload className="w-4 h-4" />
                    <span>UPLOAD PHOTOS</span>
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
    </PageLayout>
  );
};

export default GalleryPage;
