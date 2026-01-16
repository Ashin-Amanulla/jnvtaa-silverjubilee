import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckSquare, FaSquare } from "react-icons/fa";

/**
 * ImageGrid Component
 * Responsive masonry-style grid for displaying images
 */
const ImageGrid = ({
  images,
  onImageClick,
  selectedKeys = new Set(),
  onSelectionToggle = null,
}) => {
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => new Set([...prev, imageId]));
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No images found in this album</p>
      </div>
    );
  }

  const handleImageClick = (index, e) => {
    // Only open lightbox if clicking on the image itself, not the checkbox
    if (e.target.closest(".selection-checkbox")) {
      return;
    }
    onImageClick(index);
  };

  const handleCheckboxClick = (imageKey, e) => {
    e.stopPropagation();
    if (onSelectionToggle) {
      onSelectionToggle(imageKey);
    }
  };

  const isSelected = (imageKey) => selectedKeys.has(imageKey);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image, index) => {
        const selected = isSelected(image.key);
        return (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`group relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer aspect-square transition-all duration-300 ${
              selected ? "ring-4 ring-[#1A237E] ring-offset-2" : ""
            }`}
            onClick={(e) => handleImageClick(index, e)}
          >
            {/* Loading Skeleton */}
            {!loadedImages.has(image.id) && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            )}

            {/* Image */}
            <img
              src={image.thumbnailLink}
              alt={image.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
              } ${selected ? "scale-95" : "group-hover:scale-110"}`}
              onLoad={() => handleImageLoad(image.id)}
              loading="lazy"
            />

            {/* Selection Overlay - Show subtle overlay on hover when selection is enabled */}
            {onSelectionToggle && (
              <div className="absolute inset-0 bg-[#1A237E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
            )}

            {/* Selection Checkbox - Always visible when selection is enabled */}
            {onSelectionToggle && (
              <div
                className="selection-checkbox absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 cursor-pointer z-20 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white"
                onClick={(e) => handleCheckboxClick(image.key, e)}
              >
                {selected ? (
                  <FaCheckSquare className="w-5 h-5 text-[#1A237E]" />
                ) : (
                  <FaSquare className="w-5 h-5 text-gray-600" />
                )}
              </div>
            )}

            {/* Overlay on Hover - Show image info, but don't interfere with checkbox */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 pointer-events-none">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium text-sm line-clamp-2">
                  {image.name}
                </p>
                {image.folder && (
                  <p className="text-white/70 text-xs mt-1">
                    {image.folder.name}
                  </p>
                )}
              </div>
            </div>

            {/* Zoom Indicator - Only show if selection is not enabled */}
            {!onSelectionToggle && (
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ImageGrid;
