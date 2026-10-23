/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SearchPage.tsx

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const query = (searchParams.get("query") || "").trim();
  const categoryId = searchParams.get("category_id");

  // Home: search only
  // Decor: search + category_id = 1
  // Electronics: search + category_id = 2
  const { data, isLoading, isFetching, isError } = useGetProductsQuery(
    {
      search: query,
      ...(categoryId !== null && categoryId !== ""
        ? { category_id: Number(categoryId) }
        : {}),
    },
    {
      skip: !query,
    },
  );

  // API performs the search and category filtering.
  const products = data?.data?.products ?? [];

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-pulse text-center font-semibold text-gray-500">
          Loading results...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-red-500">
        Failed to load search results. Please try again.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 text-xl font-bold text-gray-800 dark:text-white sm:text-2xl"
      >
        Search Results for:{" "}
        <span className="text-blue-600">"{query}"</span>
      </motion.h1>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="py-16 text-center text-gray-500 dark:text-gray-400"
        >
          No products found matching your search.
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: any, index: number) => {
            // Support both API response structures.
            const variant = product.variant ?? product.variants?.[0];

            const productUrl =
              product.category === "Electronics" ? `/electronics/${product.slug}`
                : `/products/${product.slug}`;

            const price = Number(variant?.price ?? 0);
            const salePrice = Number(variant?.sale_price ?? 0);

            const hasDiscount =
              salePrice > 0 && price > 0 && salePrice < price;

            const discount = hasDiscount
              ? Math.round(((price - salePrice) / price) * 100)
              : 0;

            // images may be URL strings or objects containing image_url.
            const firstImage = variant?.images?.[0];

            const image =
              (typeof firstImage === "string"
                ? firstImage
                : firstImage?.image_url) ||
              product.thumbnail ||
              "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";

            const sku = variant?.sku || product.sku || `PD-00${product.id}`;

            const subCategory =
              typeof product.sub_category === "string"
                ? product.sub_category
                : product.sub_category?.name;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.05, 0.3),
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <div className="group relative flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-slate-800 sm:p-6">
                  {/* Product image */}
                  <Link
                    to={productUrl}
                    className="relative mb-4 block w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-slate-700"
                  >
                    <img
                      src={image}
                      alt={product.name}
                      loading="lazy"
                      className="block h-48 w-full object-contain transition-transform duration-500 group-hover:scale-105 sm:h-52"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
                      }}
                    />

                    <div className="absolute left-3 top-3 flex flex-col gap-2">
                      {(product.is_featured === true ||
                        product.is_featured === "1" ||
                        product.is_featured === 1) && (
                          <span className="rounded bg-orange-500 px-2 py-1 text-[9px] font-bold tracking-wider text-white shadow-sm">
                            HOT SELL
                          </span>
                        )}

                      {discount > 0 && (
                        <span className="rounded bg-amber-500 px-2 py-1 text-[9px] font-bold tracking-wider text-white shadow-sm">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Product information */}
                  <div className="flex flex-1 flex-col">
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                      {sku}
                      {subCategory && <> • {subCategory}</>}
                    </div>
                    <Link to={productUrl}>
                      <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-[#00416A] dark:text-white dark:group-hover:text-blue-400">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ৳{" "}
                        {(hasDiscount ? salePrice : price).toLocaleString(
                          "en-BD",
                        )}
                      </span>

                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          ৳ {price.toLocaleString("en-BD")}
                        </span>
                      )}
                    </div>

                    {/* View details */}
                    <Link
                      to={productUrl}
                      className="mt-4 block w-full rounded-full bg-gray-900 py-3 text-center text-[10px] font-bold tracking-widest text-white transition-colors duration-200 hover:bg-[#5A5A40] dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    >
                      VIEW DETAILS
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
