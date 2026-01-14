import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchAllImages } from "../../api/galleryApi";

// Default fallback images in case API fails or returns empty
// Default fallback is now empty as we rely on S3
const defaultGalleryImages = [];

const MarqueeRow = ({ images, direction = "left", speed = 25, onImageClick }) => {
  // If no images, don't render anything
  if (!images || images.length === 0) return null;

  // Ensure we have enough images to loop smoothly
  const displayImages = images.length < 5 ? [...images, ...images, ...images, ...images] : [...images, ...images];

  return (
    <div className="flex overflow-hidden relative">
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : 0 }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
        className="flex gap-6 py-4 flex-nowrap"
      >
        {displayImages.map((image, index) => (
          <motion.div
            key={`${image.src}-${index}`}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => onImageClick(index % images.length)}
            className="relative flex-none w-72 h-56 rounded-xl overflow-hidden cursor-pointer shadow-lg group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            <img
              src={image.src}
              alt={image.alt || "Gallery Image"}
              className="w-full h-full object-cover transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            <p className="absolute bottom-4 left-4 text-white font-medium z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              {image.caption}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await fetchAllImages();
        if (data.success && data.data.allImages.length > 0) {
          const apiImages = data.data.allImages.map((img) => ({
            src: img.url,
            alt: img.folder.name,
            caption: img.folder.name,
          }));
          
          // Shuffle images for random display
          const shuffledImages = apiImages.sort(() => 0.5 - Math.random());
          setImages(shuffledImages);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Split images for two rows if we have enough
  const midPoint = Math.ceil(images.length / 2);
  const row1Images = images.slice(0, midPoint);
  const row2Images = images.length > 1 ? images.slice(midPoint) : images;
  
  // If not enough images for 2 rows, just duplicate (only if we have images)
  const finalRow1 = row1Images.length > 0 ? row1Images : [];
  const finalRow2 = row2Images.length > 0 ? row2Images : [];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const goToNext = (e) => {
    e.stopPropagation();
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious(e);
      if (e.key === "ArrowRight") goToNext(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentIndex]);

  return (
    <section
      id="gallery"
      className="relative py-20 overflow-hidden bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
            <FaCamera className="text-[#1A237E]" />
            <span className="text-sm font-semibold text-[#1A237E] uppercase tracking-wider">
              Silver Jubilee Memories
            </span>
          </div>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#1A237E] mb-6">
            Capturing 25 Years of Excellence
          </h2>
          <div className="section-divider-modern" />
          <p className="font-body text-gray-600 text-lg max-w-2xl mx-auto">
            A visual journey through our shared history, celebrating the moments that defined us.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
           <div className="w-12 h-12 border-4 border-[#1A237E]/20 border-t-[#1A237E] rounded-full animate-spin"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No images found in the gallery.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <MarqueeRow 
            images={finalRow1} 
            direction="left" 
            speed={300} 
            onImageClick={(idx) => openLightbox(idx)} 
          />
          <MarqueeRow 
            images={finalRow2} 
            direction="right" 
            speed={300} 
            onImageClick={(idx) => openLightbox(midPoint + idx)} 
          />
        </div>
      )}

      {/* Add Photos CTA */}
      <div className="text-center mt-12">
        <Link to="/gallery" className="btn-outline inline-block">
          View All Gallery
        </Link>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-[#05091A]/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
            >
              <HiX className="w-8 h-8" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
                >
                  <HiChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
                >
                  <HiChevronRight className="w-10 h-10" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl max-h-[90vh]"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <p className="font-heading text-center text-white text-xl">
                  {selectedImage.caption}
                </p>
                <p className="text-center text-white/60 text-sm mt-1">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
