import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaCamera } from "react-icons/fa";

// Default gallery images
const defaultGalleryImages = [
  {
    src: "/images/poster.jpg",
    alt: "JNV Campus Memory",
    caption: "Our Beautiful Campus",
  },
  {
    src: "/images/poster.jpg",
    alt: "Alumni Gathering",
    caption: "Alumni Gathering",
  },
  {
    src: "/images/poster.jpg",
    alt: "JNVTA Pride",
    caption: "JNVTA Pride",
  },
  {
    src: "/images/poster.jpg",
    alt: "Classroom",
    caption: "Classroom Memories",
  },
  {
    src: "/images/poster.jpg",
    alt: "Cultural Fest",
    caption: "Cultural Fest",
  },
  {
    src: "/images/poster.jpg",
    alt: "Sports Day",
    caption: "Sports Day",
  },
  {
    src: "/images/poster.jpg",
    alt: "Assembly",
    caption: "Morning Assembly",
  },
  {
    src: "/images/poster.jpg",
    alt: "Friends",
    caption: "Lifelong Friends",
  },
];

const MarqueeRow = ({ images, direction = "left", speed = 25, onImageClick }) => {
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
        {/* Triplicate the images to ensure seamless loop without gaps */}
        {[...images, ...images, ...images].map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => onImageClick(index % images.length)}
            className="relative flex-none w-72 h-56 rounded-xl overflow-hidden cursor-pointer shadow-lg group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500"
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

const Gallery = ({ images = defaultGalleryImages }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Split images for two rows
  const row1Images = images;
  const row2Images = [...images].reverse();

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

      {/* Marquee Rows */}
      <div className="space-y-8">
        <MarqueeRow 
          images={row1Images} 
          direction="left" 
          speed={40} 
          onImageClick={openLightbox} 
        />
        <MarqueeRow 
          images={row2Images} 
          direction="right" 
          speed={50} 
          onImageClick={(idx) => openLightbox(images.length - 1 - idx)} 
        />
      </div>

      {/* Add Photos CTA */}
      <div className="text-center mt-12">
        <button className="btn-outline">
          View All Gallery
        </button>
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
