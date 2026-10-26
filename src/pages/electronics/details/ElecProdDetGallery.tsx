import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ElecProdDetGalleryProps {
  images?: string[];
  productName: string;
}

export default function ElecProdDetGallery({
  images = [],
  productName,
}: ElecProdDetGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string>(
    images[0] ?? "/placeholder.png",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Esc কি (Key) চাপলে মোডাল বন্ধ হওয়ার জন্য এবং ব্যাকগ্রাউন্ড স্ক্রোল লক করতে
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // মাউস মুভমেন্ট হ্যান্ডলার (শুধু ফ্রেমের ভেতরে থাকলেই পজিশন ক্যালকুলেট করবে)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // লাইটবক্স মোডাল কন্টেন্ট (পোর্টালের মাধ্যমে বডিতে রেন্ডার হবে)
  const modalContent = isModalOpen ? (
    <div className="fixed inset-0 z-999999 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* Absolute Close Button - ডেসকটপে আগের মতো পারফেক্ট পজিশনে */}
      <button
        type="button"
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-1000000 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/40 hover:scale-105 shadow-lg border border-white/20"
        aria-label="Close preview"
      >
        <X className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Modal Content */}
      <div className="flex flex-col items-center justify-center max-w-5xl w-full h-full max-h-[90vh] gap-6">
        
        {/* Image Frame with overflow-hidden to keep zoom strictly inside */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setZoomPosition({ x: 50, y: 50 });
          }}
          className="relative flex items-center justify-center flex-1 w-full max-w-2xl h-[70vh] overflow-hidden rounded-2xl cursor-crosshair bg-transparent"
        >
          <img
            src={selectedImage}
            alt={productName}
            style={{
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              transform: isHovered ? "scale(2.2)" : "scale(1)",
            }}
            className="max-h-full max-w-full object-contain rounded-2xl transition-transform duration-100 ease-out select-none pointer-events-none"
          />
        </div>

        {/* Modal Bottom Thumbnails */}
        <div className="flex flex-wrap items-center justify-center gap-3 p-2 bg-black/40 rounded-2xl backdrop-blur-md border border-white/10 shrink-0">
          {images.map((imgUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImage(imgUrl)}
              className={`h-16 w-16 cursor-pointer overflow-hidden rounded-xl border p-1 transition-all ${
                selectedImage === imgUrl
                  ? "border-white ring-2 ring-white/50 scale-105"
                  : "border-white/20 opacity-60 hover:opacity-100 hover:border-white/50"
              }`}
            >
              <img
                src={imgUrl}
                alt={`${productName} modal thumbnail ${index + 1}`}
                className="h-full w-full rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="relative flex min-h-80 w-full cursor-pointer items-center justify-center overflow-hidden sm:min-h-105 group"
      >
        <img
          src={selectedImage}
          alt={productName}
          className="max-h-105 w-full object-contain rounded-2xl transition-all duration-300 group-hover:scale-[1.01]"
        />
      </div>

      {/* Page Thumbnails */}
      <div className="flex flex-wrap gap-3">
        {images.map((imgUrl, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedImage(imgUrl)}
            aria-label={`View image ${index + 1}`}
            aria-pressed={selectedImage === imgUrl}
            className={`h-20 w-20 cursor-pointer overflow-hidden rounded-xl border bg-white p-2 transition-all ${
              selectedImage === imgUrl
                ? "border-elec ring-2 ring-elec/20 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={imgUrl}
              alt={`${productName} thumbnail ${index + 1}`}
              className="h-full w-full rounded-lg object-contain"
            />
          </button>
        ))}
      </div>

      {/* Render Lightbox Modal outside current DOM tree via React Portal */}
      {typeof document !== "undefined" && createPortal(modalContent, document.body)}
    </div>
  );
}