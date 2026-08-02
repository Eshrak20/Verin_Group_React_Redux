// src/components/modules/ProductDetails/ProductGallery.tsx

import { motion } from "framer-motion";
import type { Product } from "@/types/product.type";

interface ProductGalleryProps {
  product: Product;
  slug?: string;
  productImages: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  discountPercent: number;
  setModalOpen: (open: boolean) => void;
}

export default function ProductGallery({
  product,
  slug,
  productImages,
  selectedImage,
  setSelectedImage,
  discountPercent,
  setModalOpen,
}: ProductGalleryProps) {
  return (
    <motion.div 
      key={`left-${slug}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="w-full lg:w-1/2 flex flex-col gap-3 sm:gap-4"
    >
      <div
        className="w-full bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm relative border border-gray-100 cursor-zoom-in"
        onClick={() => setModalOpen(true)}
      >
        <div className="w-full rounded-2xl sm:rounded-[32px] overflow-hidden relative">
          <img
            src={productImages[selectedImage] || ""}
            alt={product.name}
            className="w-full h-auto block min-h-62.5 sm:min-h-87.5 md:min-h-112.5 lg:min-h-[60%] object-cover"
          />
        </div>

        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex flex-col gap-1.5 sm:gap-2">
          {product.is_featured === "1" && (
            <span className="bg-[#FF5A00] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
              HOT SELL
            </span>
          )}
          <span className="bg-[#5A5A40] text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm uppercase">
            NEW
          </span>
          {discountPercent > 0 && (
            <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded tracking-wider shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>

      {productImages.length > 1 && (
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {productImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all p-1 ${
                selectedImage === index
                  ? "border-neutral-900"
                  : "border-transparent opacity-60 hover:opacity-100 bg-white"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}