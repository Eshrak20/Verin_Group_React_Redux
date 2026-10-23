import { useState } from "react";

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

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative flex min-h-80 w-full items-center justify-center overflow-hidden sm:min-h-105">
        <img
          src={selectedImage}
          alt={productName}
          className="max-h-105 w-full object-contain rounded-2xl transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
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
    </div>
  );
}