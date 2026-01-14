import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';

/**
 * ImageLightbox Component
 * Full-screen modal for viewing images with navigation
 */
const ImageLightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close lightbox"
        >
          <FaTimes className="text-white text-xl" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
          <p className="text-white font-medium">
            {currentIndex + 1} / {images.length}
          </p>
        </div>

        {/* Download Button */}
        <a
          href={currentImage.url || currentImage.thumbnailLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <FaDownload className="text-white" />
          <span className="text-white font-medium">Download</span>
        </a>

        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <FaChevronLeft className="text-white text-2xl" />
          </button>
        )}

        {/* Next Button */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Next image"
          >
            <FaChevronRight className="text-white text-2xl" />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-7xl max-h-[90vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <img
            src={currentImage.url || currentImage.thumbnailLink}
            alt={currentImage.name}
            className={`max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
            <h3 className="text-white font-semibold text-lg mb-1">{currentImage.name}</h3>
            {currentImage.folder && (
              <p className="text-white/70 text-sm">{currentImage.folder.name}</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;
