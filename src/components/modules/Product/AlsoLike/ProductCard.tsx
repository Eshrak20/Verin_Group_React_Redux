// src/components/modules/ProductDetails/ProductCard.tsx

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/types/product.type";

interface ProductCardProps {
  product: Product;
  index: number;
}

function getDiscount(price: string, salePrice: string): number {
  const p = parseFloat(price);
  const s = parseFloat(salePrice);
  if (!s || s >= p || p <= 0) return 0;
  return Math.round(((p - s) / p) * 100);
}

function getDisplayPrice(price: string, salePrice: string): number {
  const p = parseFloat(price);
  const s = parseFloat(salePrice);
  return s > 0 && s < p ? s : p;
}

function getImage(product: Product): string {
  return (
    product.variants?.[0]?.images?.[0]?.image_url ||
    product.thumbnail ||
    "/placeholder.jpg"
  );
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const navigate = useNavigate();

  const variant = product.variants[0];
  const price = variant?.price || "0";
  const salePrice = variant?.sale_price || "0";
  const sku = variant?.sku || "";

  const discount = getDiscount(price, salePrice);
  const displayPrice = getDisplayPrice(price, salePrice);
  const originalPrice = parseFloat(price);
  const image = getImage(product);

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      onClick={handleCardClick}
      className="bg-white rounded-[2.2rem] p-4 border border-stone-100 shadow-xs flex flex-col justify-between group cursor-pointer"
    >
      {/* IMAGE WITH BADGES */}
      <div className="relative aspect-4/5 w-full rounded-[1.8rem] overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.jpg";
          }}
        />

        {/* BADGES */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.is_featured === "1" && (
            <span className="bg-[#ff6a00] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xs w-max">
              Hot Sell
            </span>
          )}
          <span className="bg-[#525345] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs w-max">
            New
          </span>
          {discount > 0 && (
            <span className="bg-[#ffaa00] text-stone-950 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-xs w-max">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="mt-5 px-1 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest mb-1.5">
            {sku}
            {product.sub_category?.name && (
              <>
                <span className="mx-1">•</span>
                {product.sub_category.name}
              </>
            )}
          </p>

          <h3 className="text-xl font-serif text-stone-900 leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-base font-bold text-stone-900">
              TK {displayPrice.toLocaleString()}.00
            </span>
            {discount > 0 && (
              <span className="text-xs text-stone-400 line-through">
                TK {originalPrice.toLocaleString()}.00
              </span>
            )}
          </div>

          <button
            type="button"
            className="w-full bg-[#1c1c1c] text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-full transition-all duration-300 group-hover:bg-[#5A5A40] group-hover:shadow-md cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}