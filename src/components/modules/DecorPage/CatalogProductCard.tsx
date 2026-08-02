// src/components/modules/DecorPage/CatalogProductCard.tsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/types/product.type";

interface CatalogProductCardProps {
  product: Product;
  index: number;
  animating: boolean;
}

export default function CatalogProductCard({
  product,
  index,
  animating,
}: CatalogProductCardProps) {
  const variant = product.variants?.[0];
  const price = Number(variant?.price ?? 0);
  const salePrice = Number(variant?.sale_price ?? 0);

  const hasDiscount = salePrice > 0 && salePrice < price;
  const discount = hasDiscount
    ? Math.round(((price - salePrice) / price) * 100)
    : 0;

  const image =
    variant?.images?.[0]?.image_url ||
    product.thumbnail ||
    "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: (index % 8) * 0.08,
        ease: "easeOut",
      }}
      className={`transition-all duration-300 h-full ${
        animating ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full">
        {/* Image */}
        <Link
          to={`/products/${product.slug}`}
          state={{ currentCategory: "decor" }}
          className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
        >
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block min-h-50 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured === "1" && (
              <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
                HOT SELL
              </span>
            )}
            {discount > 0 && (
              <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
                -{discount}%
              </span>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 flex flex-col">
          <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
            {variant?.sku}
            {product.sub_category?.name && (
              <> • {product.sub_category.name}</>
            )}
          </div>

          <Link
            to={`/products/${product.slug}`}
            state={{ currentCategory: "decor" }}
          >
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-center gap-3 mt-auto pt-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              ৳ {(hasDiscount ? salePrice : price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ৳ {price.toLocaleString()}
              </span>
            )}
          </div>

          {/* View Details */}
          <Link
            to={`/products/${product.slug}`}
            state={{ currentCategory: "decor" }}
            className="
              w-full
              bg-gray-900 dark:bg-white
              text-white dark:text-gray-900
              text-center
              py-3
              mt-4
              rounded-full
              text-[10px]
              font-bold
              tracking-widest
              hover:bg-[#5A5A40]
              dark:hover:bg-gray-100
              transition-colors
              duration-200
              block
            "
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </motion.div>
  );
}