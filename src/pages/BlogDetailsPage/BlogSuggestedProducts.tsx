/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Blog/BlogSuggestedProducts.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface BlogSuggestedProductsProps {
  isBangla: boolean;
  suggestedProducts: any[];
}

export default function BlogSuggestedProducts({ isBangla, suggestedProducts }: BlogSuggestedProductsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-slate-800 border border-gray-200/60 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-3"
    >
      <h4 className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-slate-700">
        {isBangla ? "পছন্দসই প্রোডাক্টস" : "Recommended Products"}
      </h4>

      <div className="space-y-3">
        {suggestedProducts.length > 0 ? (
          suggestedProducts.map((product: any, index: number) => {
            const firstVariant = product.variants?.[0];

            const displayPrice =
              firstVariant?.sale_price ||
              firstVariant?.price ||
              product.price ||
              "N/A";

            const displayImage =
              firstVariant?.images?.[0]?.image_url ||
              product.image_url ||
              product.thumbnail ||
              "https://placehold.co/100x100/e2e8f0/94a3b8?text=Product";

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <Link
                  to={`/products/${product.slug ?? product.id}`}
                  className="flex gap-3 group items-center p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:translate-x-1"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-700 border border-gray-200/80 dark:border-slate-600">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-gray-200 truncate transition-colors group-hover:text-black dark:group-hover:text-white">
                      {product.name}
                    </h5>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                      ৳ {displayPrice}
                    </p>
                    <span className="text-[10px] font-semibold hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-200">
                      {isBangla ? "অর্ডার করুন →" : "Buy Now →"}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <p className="text-[11px] text-gray-400 text-center py-2">
            {isBangla ? "কোনো প্রোডাক্ট পাওয়া যায়নি" : "No products available"}
          </p>
        )}
      </div>
    </motion.div>
  );
}