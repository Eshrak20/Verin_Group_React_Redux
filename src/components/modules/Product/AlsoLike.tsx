import { Link, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";

interface AlsoLikeProps {
  subCategoryId: string | number;
  currentSlug: string;
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

export default function AlsoLike({ subCategoryId, currentSlug }: AlsoLikeProps) {
  const navigate = useNavigate();

  const targetSubCategoryId = String(subCategoryId);

  const { data, isLoading } = useGetProductsQuery({
    sub_category_id: Number(targetSubCategoryId),
    per_page: 50,
  });

  const relatedProducts =
    data?.data
      ?.filter((product) => {
        const isNotCurrent = product.slug !== currentSlug;
        const hasVariants = (product.variants?.length ?? 0) > 0;

        const matchesSubCategory =
          String(product.sub_category_id) === targetSubCategoryId ||
          (product.sub_category && String(product.sub_category.id) === targetSubCategoryId);

        return isNotCurrent && hasVariants && matchesSubCategory;
      })
      .slice(0, 4) || [];

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

  // --- ✨ MAIN DESIGN RENDER ---
  return (
    <section className="bg-[#FAF9F6] mt-32 pb-16">
      <div className="">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <h2 className="text-3xl font-serif text-stone-900">
            You may also like
          </h2>
          <Link
            to="/decor"
            state={{ currentCategory: "decor" }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:opacity-70 transition-opacity cursor-pointer"
          >
            View All <span className="text-sm">→</span>
          </Link>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => {
            const variant = product.variants[0];
            const price = variant?.price || "0";
            const salePrice = variant?.sale_price || "0";
            const sku = variant?.sku || "";

            const discount = getDiscount(price, salePrice);
            const displayPrice = getDisplayPrice(price, salePrice);
            const originalPrice = parseFloat(price);
            const image = getImage(product);

            // 🎯 Navigate Function
            const handleCardClick = () => {
              navigate(`/products/${product.slug}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            };

            return (
              <div
                key={product.id}
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
                    {/* SKU & SubCategory Name */}
                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest mb-1.5">
                      {sku}
                      {product.sub_category?.name && (
                        <>
                          <span className="mx-1">•</span>
                          {product.sub_category.name}
                        </>
                      )}
                    </p>

                    {/* Product Title */}
                    <h3 className="text-xl font-serif text-stone-900 leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* PRICE & BUTTON */}
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
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}




