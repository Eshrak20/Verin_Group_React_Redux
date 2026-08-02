

import { X } from "lucide-react";
import type { RefObject } from "react";

interface ProductImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImages: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  productName: string;
  imageRef: RefObject<HTMLImageElement | null>;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  zoomPos: { x: number; y: number };
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ProductImageModal({
  isOpen,
  onClose,
  productImages,
  selectedImage,
  setSelectedImage,
  productName,
  imageRef,
  isHovered,
  setIsHovered,
  zoomPos,
  handleMouseMove,
}: ProductImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:cursor-pointer text-white hover:bg-white/20 transition-all"
      >
        <X size={20} />
      </button>

      <div
        className="relative max-w-[95vw] sm:max-w-[90vw] max-h-[70vh] sm:max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center cursor-zoom-in"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          ref={imageRef}
          src={productImages[selectedImage]}
          alt={productName}
          style={{
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: isHovered ? "scale(2.2)" : "scale(1)",
          }}
          className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl transition-transform duration-100 ease-out"
        />
      </div>

      {productImages.length > 1 && (
        <div
          className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto p-2 max-w-[95vw] sm:max-w-[90vw] hide-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {productImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 hover:cursor-pointer ${
                selectedImage === index
                  ? "border-white bg-white/10 opacity-100 scale-105"
                  : "border-transparent opacity-40 hover:opacity-100 bg-white/5"
              }`}
            >
              <img
                src={img}
                alt={`Modal Thumbnail ${index}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}