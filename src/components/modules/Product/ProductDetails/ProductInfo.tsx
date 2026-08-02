// src/components/modules/ProductDetails/ProductInfo.tsx

import { MessageCircle, PackageCheck, Tag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product, ProductVariant } from "@/types/product.type";

interface ProductInfoProps {
  product: Product;
  slug?: string;
  currentVariant: ProductVariant | null;
  setSelectedVariant: (variant: ProductVariant) => void;
  setSelectedImage: (index: number) => void;
  price: number;
  salePrice: number;
  hasDiscount: boolean;
  whatsappMessage: string;
}

export default function ProductInfo({
  product,
  slug,
  currentVariant,
  setSelectedVariant,
  setSelectedImage,
  price,
  salePrice,
  hasDiscount,
  whatsappMessage,
}: ProductInfoProps) {
  const whatsappNumber = "8801805734585";

  return (
    <motion.div 
      key={`right-${slug}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="w-full lg:w-1/2 pt-0 sm:pt-2 lg:pt-4"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span className="text-[10px] font-bold text-neutral-900/50 uppercase tracking-widest">
          {product.sub_category?.name || product.category?.name || "DECOR"}
        </span>
        <span className="text-neutral-900/30">•</span>
        <span className="text-[10px] font-mono text-neutral-900/50">
          {currentVariant?.sku || "N/A"}
        </span>
      </div>

      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.15] sm:leading-[1.1] text-brand-text mb-4 sm:mb-6">
        {product.name}
      </h1>

      <div className="flex items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1A1A1A]">
          TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
        </span>
        {hasDiscount && (
          <span className="text-base sm:text-xl text-neutral-900/40 line-through mb-0.5 sm:mb-1">
            TK {price.toLocaleString()}.00
          </span>
        )}
      </div>

      <div className="mb-8 sm:mb-10 max-w-none leading-relaxed
        [&_p]:my-1.5 [&_p]:text-[#1A1A1A]/70 [&_p]:text-sm sm:[&_p]:text-base
        [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 sm:[&_ul]:space-y-3
        [&_ul_li]:text-[#1A1A1A]/70 [&_ul_li]:text-sm sm:[&_ul_li]:text-base [&_ul_li]:leading-snug
        [&_ul_li]:marker:text-[#1A1A1A]/20
        [&_strong]:text-[#1A1A1A] [&_strong]:font-bold
        [&_em]:italic
        [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs sm:[&_table]:text-sm
        [&_th]:border [&_th]:border-gray-200 [&_th]:p-2 [&_th]:bg-gray-50 [&_th]:text-left
        [&_td]:border [&_td]:border-gray-200 [&_td]:p-2
        ">
        {product.short_description && (
          <div dangerouslySetInnerHTML={{ __html: product.short_description }} />
        )}
        {product.description && (
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <PackageCheck className="text-green-600 w-5 h-5 sm:w-6 sm:h-6 stroke-2" />
          <span className="text-sm sm:text-base font-medium text-green-700">In Stock</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-500">
          <Tag className="w-4 h-4 sm:w-5 sm:h-5 stroke-2" />
          <span className="text-sm sm:text-base font-medium">Direct Order</span>
        </div>
      </div>

      {product.variants && product.variants.length > 1 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVariant(v);
                  setSelectedImage(0);
                }}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all ${
                  currentVariant?.id === v.id
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                Option {idx + 1} ({v.sku})
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <a
          href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 sm:gap-3 bg-[#1A1A1A] text-white w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-xs tracking-widest hover:bg-[#5A5A40] transition-colors"
        >
          <MessageCircle size={18} className="sm:w-5 sm:h-5" />
          BUY NOW ON WHATSAPP
        </a>
      </div>

      <p className="text-[10px] text-[#1A1A1A]/50 uppercase mt-3 sm:mt-4 tracking-wider text-center md:text-left">
        Clicking this will open a prefilled WhatsApp chat to process your order.
      </p>
    </motion.div>
  );
}