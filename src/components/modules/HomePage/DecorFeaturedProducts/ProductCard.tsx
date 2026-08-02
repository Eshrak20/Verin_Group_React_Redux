

import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types/product.type";


interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const navigate = useNavigate();

  const variant = product.variants?.[0];
  const price = Number(variant?.sale_price ?? variant?.price ?? 0);
  const oldPrice = Number(variant?.price ?? 0);
  const image =
    variant?.images?.[0]?.image_url ||
    product.thumbnail ||
    "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      onClick={() => navigate(`/products/${product.slug}`)}
      className="shrink-0 flex flex-col hover:cursor-pointer group w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
    >
      <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
        <div
          className="
            absolute bottom-2 left-1/2 -translate-x-1/2
            opacity-0 group-hover:opacity-100
            translate-y-2 group-hover:translate-y-0
            transition-all duration-300
          "
        >
          <span
            className="
              bg-white text-gray-900 text-[10px] sm:text-xs font-bold
              px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md
              hover:bg-gray-100 transition-colors whitespace-nowrap items-center gap-1 inline-block
            "
          >
            <ShoppingCart size={12} className="inline-block mr-1" />
            Buy Now
          </span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-sm sm:text-base lg:text-lg home-black-text font-medium truncate group-hover:text-[#003557] transition-colors duration-200">
          {product.name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs sm:text-sm font-bold home-black-text">
            ৳{price.toLocaleString()}
          </span>
          {oldPrice > price && (
            <span className="text-[10px] sm:text-xs home-red-text line-through">
              ৳{oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}