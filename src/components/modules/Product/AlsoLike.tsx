import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";

interface AlsoLikeProps {
  subCategoryName?: string;
  currentSlug: string;
}

function normalizeCategory(value?: string | null): string {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
    product.variant?.images?.[0] ||
    product.thumbnail ||
    "/placeholder.jpg"
  );
}

// 🔑 Helper Function: Clean prefix e.g., 'verin_decor' -> 'decor'
function getCleanCategoryPath(product?: Product): string {
  if (!product) return "products";

  // Check category or sub_category slug/name
  const rawSlug =
    product.category ||
    product.sub_category ||
    "";

  // Strip prefixes like "verin_" or any underscore-separated prefix
  const cleanSlug = rawSlug
    .toLowerCase()
    .replace(/^.*_/, "") // Remove everything up to and including the last underscore
    .trim();

  return cleanSlug || "products";
}

export default function AlsoLike({ subCategoryName, currentSlug }: AlsoLikeProps) {
  const navigate = useNavigate();
  const targetSubCategorySlug = String(subCategoryName);
  console.log(targetSubCategorySlug);


  const { data, isLoading, isError, error } = useGetProductsQuery({
    category_id: 1
  });

  console.log("Products API:", data?.data.products);
  console.log("Target subcategory:", subCategoryName);
  console.log(
    "Available subcategories:",
    data?.data.products?.map((product) => product.sub_category),
  );
  console.log("Products API error:", isError ? error : null);

  const targetSubCategory = normalizeCategory(subCategoryName);

  const relatedProducts =
    data?.data.products
      ?.filter((product) => {
        const isNotCurrent = product.slug !== currentSlug;

        const matchesSubCategory =
          normalizeCategory(product.sub_category) === targetSubCategory;

        return (
          isNotCurrent &&
          Boolean(targetSubCategory) &&
          matchesSubCategory &&
          product.variant !== null
        );
      })
      .slice(0, 4) ?? [];

  // --- 💡 Dynamic Route Resolution ---
  const firstProduct = relatedProducts[0];
  const cleanCategory = getCleanCategoryPath(firstProduct);
  const viewAllPath = `/${cleanCategory}`;

  // --- ⏳ LOADING SKELETON STATE ---
  if (isLoading) {
    return (
      <section className="bg-[#FAF9F6] py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-stone-900 mb-10">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-[2.2rem] p-4 border border-stone-100 animate-pulse"
              >
                <div className="aspect-4/5 w-full rounded-[1.8rem] bg-stone-200" />
                <div className="mt-5 px-1 space-y-3">
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-5 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                  <div className="h-10 bg-stone-200 rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- 🛑 EMPTY STATE ---
  if (relatedProducts.length === 0) return null;

  // --- ✨ MAIN DESIGN RENDER WITH SCROLL ANIMATION ---
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#FAF9F6] mt-32 pb-16"
    >
      <div>
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <h2 className="text-3xl font-serif text-stone-900">
            You may also like
          </h2>
          <Link
            to={viewAllPath}
            state={{ currentCategory: cleanCategory }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:opacity-70 transition-opacity cursor-pointer"
          >
            View All <span className="text-sm">→</span>
          </Link>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product, index) => {
            const variant = product.variant;
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
                key={product.id}
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
                    {Boolean(product.is_featured) && (
                      <span className="rounded bg-[#FF5A00] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        HOT SELL
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
                      {product.sub_category && (
                        <>
                          <span className="mx-1">•</span>
                          {product.sub_category}
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
          })}
        </div>
      </div>
    </motion.section>
  );
}