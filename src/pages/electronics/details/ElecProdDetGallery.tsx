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
    images[0] ?? "/placeholder.png"
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Main Preview Container */}
      <div className="relative flex min-h-80 sm:min-h-105 w-full items-center justify-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <img
          src={selectedImage}
          alt={productName}
          className="max-h-87.5 w-auto object-contain transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex flex-wrap gap-3">
        {images.map((imgUrl, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedImage(imgUrl)}
            className={`h-20 w-20 overflow-hidden rounded-xl bg-white p-2 border transition-all cursor-pointer ${
              selectedImage === imgUrl
                ? "border-elec ring-2 ring-elec/20 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={imgUrl}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}