import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllImages } from "../api/galleryApi";

const TVCarouselPage = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const imageRefs = useRef({});

  // Configuration
  const TRANSITION_DURATION = 1.5; // seconds
  const DISPLAY_DURATION = 6000; // milliseconds (6 seconds per image)

  // Fetch images on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAllImages();
        
        if (response.success && response.data?.allImages?.length > 0) {
          const allImages = response.data.allImages;
          setImages(allImages);
          setCurrentIndex(0);
        } else {
          setError("No images found in gallery");
        }
      } catch (err) {
        console.error("Failed to load gallery images:", err);
        setError("Failed to load images. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  // Preload next image
  useEffect(() => {
    if (images.length > 0) {
      const nextIndex = (currentIndex + 1) % images.length;
      const nextImage = images[nextIndex];
      
      if (nextImage?.url && !imageRefs.current[nextImage.id]) {
        const img = new Image();
        img.src = nextImage.url;
        imageRefs.current[nextImage.id] = img;
      }
    }
  }, [currentIndex, images]);

  // Auto-rotation interval
  useEffect(() => {
    if (images.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, DISPLAY_DURATION);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, isPaused]);

  // Keyboard controls (optional - for manual navigation)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (images.length === 0) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          setCurrentIndex((prev) => (prev + 1) % images.length);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
          break;
        case " ":
          e.preventDefault();
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [images.length]);

  // Handle click to pause/resume
  const handleClick = () => {
    setIsPaused((prev) => !prev);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center px-4">
          <div className="text-white text-2xl font-semibold mb-2">Error</div>
          <p className="text-white/80 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  // No images state
  if (images.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center px-4">
          <div className="text-white text-2xl font-semibold mb-2">No Images</div>
          <p className="text-white/80 text-lg">No images found in the gallery.</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black overflow-hidden cursor-none"
      onClick={handleClick}
      style={{ cursor: isPaused ? 'default' : 'none' }}
    >
      {/* Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage.id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: TRANSITION_DURATION }}
          className="absolute inset-0"
        >
          <img
            src={currentImage.url}
            alt={currentImage.name || `Gallery Image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            style={{ objectFit: 'contain' }}
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      {/* Optional: Progress indicator (bottom right) */}
      <div className="absolute bottom-4 right-4 text-white/60 text-sm font-medium z-10 pointer-events-none">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Optional: Pause indicator */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        >
          <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-lg">
            <p className="text-white text-lg font-medium">Paused - Click to resume</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TVCarouselPage;
