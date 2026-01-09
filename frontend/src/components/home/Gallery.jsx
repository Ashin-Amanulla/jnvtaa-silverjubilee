import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaCamera } from "react-icons/fa";

// Default gallery images - add your images to /public/images/gallery/
const defaultGalleryImages = [
  {
    src: "/images/poster.jpeg",
    alt: "JNV Campus Memory",
    caption: "Our Beautiful Campus",
  },
  {
    src: "/images/poster2.jpeg",
    alt: "Alumni Gathering",
    caption: "Alumni Gathering",
  },
  {
    src: "/images/logo.jpeg",
    alt: "JNVTA Logo",
    caption: "JNVTA Pride",
  },
  // Add more images here as you add them to /public/images/gallery/
  // Example:
  // { src: "/images/gallery/batch-photo.jpg", alt: "Batch Photo", caption: "Class of 2000" },
];

const Gallery = ({ images = defaultGalleryImages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Handle keyboard navigation
  React.useEffect(() => {
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
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #3D2512 0%, #F4E8D1 10%, #FDF5E6 50%, #F4E8D1 90%, #3D2512 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <FaCamera className="text-2xl text-[#B8860B]" />
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#5D3A1A]">
              Memories
            </h2>
            <FaCamera className="text-2xl text-[#B8860B]" />
          </div>
          <div className="section-divider" />
          <p className="font-body text-[#8B4513] text-lg max-w-2xl mx-auto">
            A glimpse into our cherished moments and memories
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => openLightbox(index)}
              className="group cursor-pointer"
            >
              {/* Photo Frame */}
              <div className="relative bg-[#FDF5E6] p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-[#B8860B]/20">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden rounded">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover img-sepia group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D2512]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-heading text-[#FDF5E6] text-lg">
                        {image.caption}
                      </p>
                    </div>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#B8860B]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#B8860B]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#B8860B]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#B8860B]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Caption below image */}
                <p className="mt-3 font-body text-center text-[#5D3A1A] text-sm group-hover:text-[#800020] transition-colors">
                  {image.caption}
                </p>

                {/* Tape effect */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#DAA520]/30 -rotate-2 rounded-sm" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Photos CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="font-body text-[#8B4513]/70 italic">
            More memories coming soon...
          </p>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-[#1a0f09]/95 flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 text-[#FDF5E6] hover:text-[#DAA520] transition-colors z-50"
            >
              <HiX className="w-8 h-8" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-[#FDF5E6] hover:text-[#DAA520] transition-colors z-50"
                >
                  <HiChevronLeft className="w-10 h-10" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-[#FDF5E6] hover:text-[#DAA520] transition-colors z-50"
                >
                  <HiChevronRight className="w-10 h-10" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] bg-[#FDF5E6] p-4 sm:p-6 rounded-lg shadow-2xl"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
              <p className="mt-4 font-heading text-center text-[#5D3A1A] text-lg">
                {selectedImage.caption}
              </p>
              
              {/* Image counter */}
              <p className="absolute bottom-2 right-4 font-body text-sm text-[#8B4513]/60">
                {currentIndex + 1} / {images.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
