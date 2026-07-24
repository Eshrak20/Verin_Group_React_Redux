import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";

function getDiscount(price: string | number, salePrice: string | number): number {
  const p = typeof price === "number" ? price : parseFloat(price);
  const s = typeof salePrice === "number" ? salePrice : parseFloat(salePrice);
  if (!s || s >= p) return 0;
  return Math.round(((p - s) / p) * 100);
}

function getImage(product: Product): string {
  return (
    product.variants?.[0]?.images?.[0]?.image_url ||
    product.thumbnail ||
    "/placeholder.jpg"
  );
}

function getDisplayPrice(price: string | number, salePrice: string | number): number {
  const p = typeof price === "number" ? price : parseFloat(price);
  const s = typeof salePrice === "number" ? salePrice : parseFloat(salePrice);
  return s > 0 && s < p ? s : p;
}

export default function FeaturedPieces() {
  // const navigate = useNavigate();
  const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

  // 🎯 ElectronicsFeaturedProducts এর মতো সেফ ফিল্টারিং
  const featuredItems = useMemo(() => {
    const allProducts = Array.isArray(data)
      ? data
      : data?.data ?? [];

    return allProducts.filter((p) => {
      const isDecor = p.category?.name?.toLowerCase().includes("decor");

      const isFeatured =
        p.is_featured === true ||
        p.is_featured === 1 ||
        p.is_featured === "1";

      const hasVariants = (p.variants?.length ?? 0) > 0;

      return isDecor && isFeatured && hasVariants;
    });
  }, [data]);

  if (isLoading) {
    return (
      <section className="bg-[#fbfbf8] py-10 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="h-7 sm:h-9 w-40 sm:w-52 bg-stone-200 rounded animate-pulse" />
            <div className="h-4 w-32 sm:w-36 bg-stone-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <div>
        {/* SECTION HEADER */}
        <div className="flex flex-row items-end justify-between mb-6 sm:mb-8 lg:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-stone-900 tracking-wide">
              Featured Pieces
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 sm:mt-2">
              Our currently hottest selling items.
            </p>
          </div>
          {/* <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-stone-900 hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap"
          >
            View All <span className="text-xs sm:text-sm">→</span>
          </button> */}
        </div>

        {/* PRODUCT GRID */}
        {featuredItems.length === 0 ? (
          <div className="w-full text-center py-10 text-stone-400">
            No featured products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredItems.map((product: Product) => {
              const variant = product.variants?.[0];
              const price = variant?.price ?? 0;
              const salePrice = variant?.sale_price ?? 0;
              const discount = getDiscount(price, salePrice);
              const displayPrice = getDisplayPrice(price, salePrice);
              const originalPrice = typeof price === "number" ? price : parseFloat(price);
              const image = getImage(product);
              const sku = variant?.sku;

              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  state={{ currentCategory: "decor" }}
                  className="bg-white rounded-[1.8rem] sm:rounded-[2.2rem] p-3.5 sm:p-4 border border-stone-100 shadow-xs flex flex-col justify-between group cursor-pointer"
                >
                  {/* IMAGE CONTAINER WITH BADGES */}
                  <div className="relative aspect-4/5 w-full rounded-[1.4rem] sm:rounded-[1.8rem] overflow-hidden bg-stone-100">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />

                    {/* FLOATING BADGES */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 z-10">
                      {discount > 0 && (
                        <span className="bg-[#ffaa00] text-stone-950 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-xs w-max">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="mt-4 sm:mt-5 px-1 flex-1 flex flex-col justify-between">
                    <div>
                      {/* SKU & SubCategory */}
                      <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest mb-1 sm:mb-1.5 truncate">
                        {sku}
                        {product.sub_category?.name && (
                          <>
                            <span className="mx-1">•</span>
                            {product.sub_category.name}
                          </>
                        )}
                      </p>

                      {/* Product Title */}
                      <h3 className="text-lg sm:text-xl font-serif text-stone-900 leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    {/* PRICE & BUTTON */}
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

