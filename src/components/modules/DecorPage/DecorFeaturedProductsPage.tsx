
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";

export default function DecorFeaturedProductsPage() {
  const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

  // 🎯 শুধুমাত্র Decor ক্যাটাগরির ALL Featured Products ফিল্টারিং
  const featuredProducts = useMemo(() => {
    const allProducts = Array.isArray(data) ? data : data?.data ?? [];

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
      <div className="max-w-6xl mx-auto px-4 py-16 text-center text-stone-500 animate-pulse">
        Loading all featured items...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto lg:px-0 px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-bold mb-2">
          All Featured Pieces
        </h1>
        <p className="text-stone-500 text-sm">
          Explore our complete collection of hot selling items.
        </p>
      </div>

      {/* Grid */}
      {featuredProducts.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          No featured products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product: Product) => {
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
              "/placeholder.jpg";

            return (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                state={{ currentCategory: "decor" }}
                className="bg-white rounded-[1.8rem] sm:rounded-[2.2rem] p-3.5 sm:p-4 border border-stone-100 shadow-xs flex flex-col justify-between group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-4/5 w-full rounded-[1.4rem] sm:rounded-[1.8rem] overflow-hidden bg-stone-100">
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                  />
                  {discount > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#ffaa00] text-stone-950 text-[9px] font-black tracking-wider px-2.5 py-1 rounded-xs">
                        -{discount}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-4 px-1 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest mb-1 truncate">
                      {variant?.sku} {product.sub_category?.name && `• ${product.sub_category.name}`}
                    </p>
                    <h3 className="text-lg font-serif text-stone-900 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-sm font-bold text-stone-900">
                        TK {(hasDiscount ? salePrice : price).toLocaleString()}.00
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-stone-400 line-through">
                          TK {price.toLocaleString()}.00
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="w-full bg-[#1c1c1c] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest py-3 rounded-full group-hover:bg-[#5A5A40] transition-colors"
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
  );
}