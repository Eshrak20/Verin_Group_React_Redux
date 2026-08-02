import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/types/product.type";
import { getDiscount, getDisplayPrice, getImage } from "@/utils/products.utils";


interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const variant = product.variants?.[0];
  const price = variant?.price ?? 0;
  const salePrice = variant?.sale_price ?? 0;
  const discount = getDiscount(price, salePrice);
  const displayPrice = getDisplayPrice(price, salePrice);
  const originalPrice = typeof price === "number" ? price : parseFloat(String(price));
  const image = getImage(product);
  const sku = variant?.sku;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="h-full"
    >
      <Link
        to={`/products/${product.slug}`}
        state={{ currentCategory: "decor" }}
        className="bg-white rounded-[1.8rem] sm:rounded-[2.2rem] p-3.5 sm:p-4 border border-stone-100 shadow-xs flex flex-col justify-between group cursor-pointer h-full"
      >
        <div className="relative aspect-4/5 w-full rounded-[1.4rem] sm:rounded-[1.8rem] overflow-hidden bg-stone-100">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.jpg";
            }}
          />

          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <span className="bg-[#ffaa00] text-stone-950 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-xs w-max">
                -{discount}%
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-5 px-1 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest mb-1 sm:mb-1.5 truncate">
              {sku}
              {product.sub_category?.name && (
                <>
                  <span className="mx-1">•</span>
                  {product.sub_category.name}
                </>
              )}
            </p>

            <h3 className="text-lg sm:text-xl font-serif text-stone-900 leading-snug line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
              <span className="text-sm sm:text-base font-bold text-stone-900">
                TK {displayPrice.toLocaleString()}.00
              </span>
              {discount > 0 && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                  TK {originalPrice.toLocaleString()}.00
                </span>
              )}
            </div>

            <button
              type="button"
              className="w-full bg-[#1c1c1c] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest py-3 sm:py-3.5 rounded-full transition-all duration-300 group-hover:bg-[#5A5A40] group-hover:shadow-md cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}