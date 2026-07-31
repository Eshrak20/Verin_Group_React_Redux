/* eslint-disable react-hooks/purity */
/* eslint-disable prefer-const */
// src/components/modules/DecorPage/ProductCatalog.tsx

import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer"; // 🎯 Lazy Fetching

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";

type SortOption =
  | "Newest First"
  | "Price Low to High"
  | "Price High to Low";

const SORT_OPTIONS: SortOption[] = [
  "Newest First",
  "Price Low to High",
  "Price High to Low",
];

const INITIAL_VISIBLE = 8;

export default function ProductCatalog() {
  // 🎯 Lazy Fetching Setup
  const { ref: containerRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: "300px",
  });

  // 🎯 skip: !inView দিয়ে API Call ডিলে করা হয়েছে
  const { data, isLoading } = useGetProductsQuery(
    { per_page: 100 },
    { skip: !inView }
  );

  const products = useMemo(() => {
    const allProducts = data?.data ?? [];
    return allProducts.filter(
      (p) => p.category?.name?.toLowerCase().includes("decor")
    );
  }, [data]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("Newest First");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSubCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products
            .map((p) => p.sub_category?.name)
            .filter(Boolean)
        )
      ),
    ],
    [products]
  );

  const visibleCategories = showAllCategories
    ? allSubCategories
    : allSubCategories.slice(0, INITIAL_VISIBLE);

  const handleCategoryChange = (cat: string) => {
    if (cat === selectedCategory) return;

    setAnimating(true);

    setTimeout(() => {
      setSelectedCategory(cat);
      setAnimating(false);
    }, 250);
  };

  // 🎯 Fisher-Yates Shuffle Algorithm for Random Products on "All"
  const shuffledProducts = useMemo(() => {
    if (!products.length) return [];
    const array = [...products];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [products]);

  // 🎯 Filtered and Sorted Logic
  const filteredAndSorted = useMemo(() => {
    let result =
      selectedCategory === "All"
        ? [...shuffledProducts]
        : products.filter(
            (p) => p.sub_category?.name === selectedCategory
          );

    if (sortBy === "Price Low to High") {
      result.sort(
        (a, b) =>
          Number(a.variants?.[0]?.price ?? 0) -
          Number(b.variants?.[0]?.price ?? 0)
      );
    } else if (sortBy === "Price High to Low") {
      result.sort(
        (a, b) =>
          Number(b.variants?.[0]?.price ?? 0) -
          Number(a.variants?.[0]?.price ?? 0)
      );
    } else if (sortBy === "Newest First" && selectedCategory !== "All") {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, shuffledProducts, selectedCategory, sortBy]);

  // 🎯 Loading & Skeleton State before user scrolls into view
  if (!inView || isLoading) {
    return (
      <section
        ref={containerRef}
        id="catalog-section"
        className="py-6 sm:py-10 scroll-mt-12"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8">
          <div>
            <div className="h-8 w-44 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-6 border border-gray-100 dark:border-gray-700 animate-pulse"
            >
              <div className="aspect-square w-full rounded-2xl bg-gray-200 dark:bg-slate-700 mb-4" />
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="catalog-section"
      className="py-6 sm:py-10 scroll-mt-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-4 sm:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-1 sm:mb-2">
            The Catalog
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            Browse our collection of {filteredAndSorted.length} items.
          </p>
        </motion.div>

        {/* Custom Responsive Dropdown Box */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="
              flex items-center justify-between gap-2.5
              w-full sm:w-auto min-w-42.5
              bg-white dark:bg-slate-800
              border border-gray-200 dark:border-gray-700
              hover:border-gray-400 dark:hover:border-gray-500
              text-gray-800 dark:text-gray-200
              py-2 px-4
              rounded-full
              text-xs sm:text-sm font-medium
              shadow-sm hover:shadow
              transition-all duration-200
              cursor-pointer
            "
          >
            <span className="flex items-center gap-2 truncate">
              <SlidersHorizontal size={14} className="text-gray-500" />
              <span>{sortBy}</span>
            </span>
            <ChevronDown
              size={15}
              className={`text-gray-400 transition-transform duration-200 ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu Popup */}
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl py-1.5 z-30 transition-all duration-200">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortBy(option);
                    setIsSortOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-left font-medium transition-colors
                    ${
                      sortBy === option
                        ? "text-[#00416A] dark:text-blue-400 bg-gray-50 dark:bg-slate-700/50"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/30"
                    }
                  `}
                >
                  <span>{option}</span>
                  {sortBy === option && (
                    <Check size={14} className="text-[#00416A] dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto mb-4 sm:mb-8 gap-2 no-scrollbar">
        {visibleCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`
              whitespace-nowrap
              px-5 sm:px-6
              py-2 sm:py-2.5
              rounded-full
              font-medium
              transition-all
              duration-200
              text-xs sm:text-sm
              ${
                selectedCategory === cat
                  ? "bg-[#5A5A40] text-white shadow-md"
                  : " dark:bg-slate-800 text-black dark:text-white border border-gray-200 dark:border-gray-600 hover:border-[#00416A] hover:cursor-pointer dark:hover:border-gray-400"
              }
            `}
          >
            {cat}
          </button>
        ))}

        {allSubCategories.length > INITIAL_VISIBLE && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="
              whitespace-nowrap
              px-5 sm:px-6
              py-2 sm:py-2.5
              rounded-full
              font-medium
              transition-all
              duration-200
              text-xs sm:text-sm
              bg-gray-100
              text-gray-600
              border
              border-gray-200
              hover:bg-gray-200
              hover:text-gray-900
            "
          >
            {showAllCategories ? "See Less..." : "See More..."}
          </button>
        )}
      </div>

      {/* Product Grid */}
      <div
        className={`
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4 sm:gap-6
          transition-opacity
          duration-250
          ${animating ? "opacity-0" : "opacity-100"}
        `}
      >
        {filteredAndSorted.length > 0 ? (
          filteredAndSorted.map((product: Product, index: number) => {
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
              /* Scroll Animation for each Card */
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
                  animating
                    ? "scale-95 opacity-0"
                    : "scale-100 opacity-100"
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
                        ৳{" "}
                        {(hasDiscount
                          ? salePrice
                          : price
                        ).toLocaleString()}
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
          })
        ) : (
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-20 text-gray-400">
            <p className="text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}











// /* eslint-disable react-hooks/purity */
// /* eslint-disable prefer-const */
// // src/components/modules/DecorPage/ProductCatalog.tsx

// import { useState, useMemo, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
// import { motion } from "framer-motion";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product } from "@/types/product.type";

// type SortOption =
//   | "Newest First"
//   | "Price Low to High"
//   | "Price High to Low";

// const SORT_OPTIONS: SortOption[] = [
//   "Newest First",
//   "Price Low to High",
//   "Price High to Low",
// ];

// const INITIAL_VISIBLE = 8;

// export default function ProductCatalog() {
//   const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

//   const products = useMemo(() => {
//     const allProducts = data?.data ?? [];
//     return allProducts.filter(
//       (p) => p.category?.name?.toLowerCase().includes("decor")
//     );
//   }, [data]);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [sortBy, setSortBy] = useState<SortOption>("Newest First");
//   const [showAllCategories, setShowAllCategories] = useState(false);
//   const [animating, setAnimating] = useState(false);
//   const [isSortOpen, setIsSortOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsSortOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const allSubCategories = useMemo(
//     () => [
//       "All",
//       ...Array.from(
//         new Set(
//           products
//             .map((p) => p.sub_category?.name)
//             .filter(Boolean)
//         )
//       ),
//     ],
//     [products]
//   );

//   const visibleCategories = showAllCategories
//     ? allSubCategories
//     : allSubCategories.slice(0, INITIAL_VISIBLE);

//   const handleCategoryChange = (cat: string) => {
//     if (cat === selectedCategory) return;

//     setAnimating(true);

//     setTimeout(() => {
//       setSelectedCategory(cat);
//       setAnimating(false);
//     }, 250);
//   };

//   // 🎯 Fisher-Yates Shuffle Algorithm for Random Products on "All"
//   const shuffledProducts = useMemo(() => {
//     if (!products.length) return [];
//     const array = [...products];
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }, [products]);

//   // 🎯 Filtered and Sorted Logic
//   const filteredAndSorted = useMemo(() => {
//     let result =
//       selectedCategory === "All"
//         ? [...shuffledProducts]
//         : products.filter(
//             (p) => p.sub_category?.name === selectedCategory
//           );

//     if (sortBy === "Price Low to High") {
//       result.sort(
//         (a, b) =>
//           Number(a.variants?.[0]?.price ?? 0) -
//           Number(b.variants?.[0]?.price ?? 0)
//       );
//     } else if (sortBy === "Price High to Low") {
//       result.sort(
//         (a, b) =>
//           Number(b.variants?.[0]?.price ?? 0) -
//           Number(a.variants?.[0]?.price ?? 0)
//       );
//     } else if (sortBy === "Newest First" && selectedCategory !== "All") {
//       result.sort((a, b) => b.id - a.id);
//     }

//     return result;
//   }, [products, shuffledProducts, selectedCategory, sortBy]);

//   if (isLoading) {
//     return (
//       <section className="py-10 px-4 max-w-6xl mx-auto">
//         <div className="text-center text-gray-500">
//           Loading products...
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section id="catalog-section" className="py-6 sm:py-10 scroll-mt-12">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-4 sm:mb-10">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//         >
//           <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-1 sm:mb-2">
//             The Catalog
//           </h2>

//           <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
//             Browse our collection of {filteredAndSorted.length} items.
//           </p>
//         </motion.div>

//         {/* Custom Responsive Dropdown Box */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             type="button"
//             onClick={() => setIsSortOpen(!isSortOpen)}
//             className="
//               flex items-center justify-between gap-2.5
//               w-full sm:w-auto min-w-42.5
//               bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-gray-700
//               hover:border-gray-400 dark:hover:border-gray-500
//               text-gray-800 dark:text-gray-200
//               py-2 px-4
//               rounded-full
//               text-xs sm:text-sm font-medium
//               shadow-sm hover:shadow
//               transition-all duration-200
//               cursor-pointer
//             "
//           >
//             <span className="flex items-center gap-2 truncate">
//               <SlidersHorizontal size={14} className="text-gray-500" />
//               <span>{sortBy}</span>
//             </span>
//             <ChevronDown
//               size={15}
//               className={`text-gray-400 transition-transform duration-200 ${
//                 isSortOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {/* Dropdown Menu Popup */}
//           {isSortOpen && (
//             <div className="absolute right-0 top-full mt-2 w-full sm:w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl py-1.5 z-30 transition-all duration-200">
//               {SORT_OPTIONS.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => {
//                     setSortBy(option);
//                     setIsSortOpen(false);
//                   }}
//                   className={`
//                     w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-left font-medium transition-colors
//                     ${
//                       sortBy === option
//                         ? "text-[#00416A] dark:text-blue-400 bg-gray-50 dark:bg-slate-700/50"
//                         : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/30"
//                     }
//                   `}
//                 >
//                   <span>{option}</span>
//                   {sortBy === option && (
//                     <Check size={14} className="text-[#00416A] dark:text-blue-400" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Category Filter */}
//       <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto mb-4 sm:mb-8 gap-2 no-scrollbar">
//         {visibleCategories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => handleCategoryChange(cat)}
//             className={`
//               whitespace-nowrap
//               px-5 sm:px-6
//               py-2 sm:py-2.5
//               rounded-full
//               font-medium
//               transition-all
//               duration-200
//               text-xs sm:text-sm
//               ${
//                 selectedCategory === cat
//                   ? "bg-[#5A5A40] text-white shadow-md"
//                   : " dark:bg-slate-800 text-black dark:text-white border border-gray-200 dark:border-gray-600 hover:border-[#00416A] hover:cursor-pointer dark:hover:border-gray-400"
//               }
//             `}
//           >
//             {cat}
//           </button>
//         ))}

//         {allSubCategories.length > INITIAL_VISIBLE && (
//           <button
//             onClick={() => setShowAllCategories(!showAllCategories)}
//             className="
//               whitespace-nowrap
//               px-5 sm:px-6
//               py-2 sm:py-2.5
//               rounded-full
//               font-medium
//               transition-all
//               duration-200
//               text-xs sm:text-sm
//               bg-gray-100
//               text-gray-600
//               border
//               border-gray-200
//               hover:bg-gray-200
//               hover:text-gray-900
//             "
//           >
//             {showAllCategories ? "See Less..." : "See More..."}
//           </button>
//         )}
//       </div>

//       {/* Product Grid */}
//       <div
//         className={`
//           grid
//           grid-cols-1
//           sm:grid-cols-2
//           md:grid-cols-3
//           lg:grid-cols-4
//           gap-4 sm:gap-6
//           transition-opacity
//           duration-250
//           ${animating ? "opacity-0" : "opacity-100"}
//         `}
//       >
//         {filteredAndSorted.length > 0 ? (
//           filteredAndSorted.map((product: Product, index: number) => {
//             const variant = product.variants?.[0];
//             const price = Number(variant?.price ?? 0);
//             const salePrice = Number(variant?.sale_price ?? 0);

//             const hasDiscount = salePrice > 0 && salePrice < price;
//             const discount = hasDiscount
//               ? Math.round(((price - salePrice) / price) * 100)
//               : 0;

//             const image =
//               variant?.images?.[0]?.image_url ||
//               product.thumbnail ||
//               "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";

//             return (
//               /* Scroll Animation for each Card */
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-50px" }}
//                 transition={{
//                   duration: 0.4,
//                   delay: (index % 8) * 0.08,
//                   ease: "easeOut",
//                 }}
//                 className={`transition-all duration-300 h-full ${
//                   animating
//                     ? "scale-95 opacity-0"
//                     : "scale-100 opacity-100"
//                 }`}
//               >
//                 <div className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full">
//                   {/* Image */}
//                   <Link
//                     to={`/products/${product.slug}`}
//                     state={{ currentCategory: "decor" }}
//                     className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
//                   >
//                     <img
//                       src={image}
//                       alt={product.name}
//                       className="w-full h-auto block min-h-50 object-cover object-center group-hover:scale-105 transition-transform duration-500"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
//                       }}
//                     />

//                     {/* Badges */}
//                     <div className="absolute top-3 left-3 flex flex-col gap-2">
//                       {product.is_featured === "1" && (
//                         <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                           HOT SELL
//                         </span>
//                       )}
//                       {discount > 0 && (
//                         <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                           -{discount}%
//                         </span>
//                       )}
//                     </div>
//                   </Link>

//                   {/* Info */}
//                   <div className="flex-1 flex flex-col">
//                     <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
//                       {variant?.sku}
//                       {product.sub_category?.name && (
//                         <> • {product.sub_category.name}</>
//                       )}
//                     </div>

//                     <Link
//                       to={`/products/${product.slug}`}
//                       state={{ currentCategory: "decor" }}
//                     >
//                       <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
//                         {product.name}
//                       </h3>
//                     </Link>

//                     {/* Price */}
//                     <div className="flex items-center gap-3 mt-auto pt-2">
//                       <span className="text-sm font-bold text-gray-900 dark:text-white">
//                         ৳{" "}
//                         {(hasDiscount
//                           ? salePrice
//                           : price
//                         ).toLocaleString()}
//                       </span>
//                       {hasDiscount && (
//                         <span className="text-xs text-gray-400 line-through">
//                           ৳ {price.toLocaleString()}
//                         </span>
//                       )}
//                     </div>

//                     {/* View Details */}
//                     <Link
//                       to={`/products/${product.slug}`}
//                       state={{ currentCategory: "decor" }}
//                       className="
//                         w-full
//                         bg-gray-900 dark:bg-white
//                         text-white dark:text-gray-900
//                         text-center
//                         py-3
//                         mt-4
//                         rounded-full
//                         text-[10px]
//                         font-bold
//                         tracking-widest
//                         hover:bg-[#5A5A40]
//                         dark:hover:bg-gray-100
//                         transition-colors
//                         duration-200
//                         block
//                       "
//                     >
//                       VIEW DETAILS
//                     </Link>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })
//         ) : (
//           <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-20 text-gray-400">
//             <p className="text-lg">No products found in this category.</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
















// /* eslint-disable prefer-const */
// // src/components/modules/DecorPage/ProductCatalog.tsx

// import { useState, useMemo, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
// import { motion } from "framer-motion"; // 🎯 Framer Motion Import

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product } from "@/types/product.type";

// type SortOption =
//   | "Newest First"
//   | "Price Low to High"
//   | "Price High to Low";

// const SORT_OPTIONS: SortOption[] = [
//   "Newest First",
//   "Price Low to High",
//   "Price High to Low",
// ];

// const INITIAL_VISIBLE = 8;

// export default function ProductCatalog() {
//   const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

//   const products = useMemo(() => {
//     const allProducts = data?.data ?? [];
//     return allProducts.filter(
//       (p) => p.category?.name?.toLowerCase().includes("decor")
//     );
//   }, [data]);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [sortBy, setSortBy] = useState<SortOption>("Newest First");
//   const [showAllCategories, setShowAllCategories] = useState(false);
//   const [animating, setAnimating] = useState(false);
//   const [isSortOpen, setIsSortOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsSortOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const allSubCategories = useMemo(
//     () => [
//       "All",
//       ...Array.from(
//         new Set(
//           products
//             .map((p) => p.sub_category?.name)
//             .filter(Boolean)
//         )
//       ),
//     ],
//     [products]
//   );

//   const visibleCategories = showAllCategories
//     ? allSubCategories
//     : allSubCategories.slice(0, INITIAL_VISIBLE);

//   const handleCategoryChange = (cat: string) => {
//     if (cat === selectedCategory) return;

//     setAnimating(true);

//     setTimeout(() => {
//       setSelectedCategory(cat);
//       setAnimating(false);
//     }, 250);
//   };

//   const filteredAndSorted = useMemo(() => {
//     let result =
//       selectedCategory === "All"
//         ? [...products]
//         : products.filter(
//             (p) => p.sub_category?.name === selectedCategory
//           );

//     if (sortBy === "Price Low to High") {
//       result.sort(
//         (a, b) =>
//           Number(a.variants?.[0]?.price ?? 0) -
//           Number(b.variants?.[0]?.price ?? 0)
//       );
//     } else if (sortBy === "Price High to Low") {
//       result.sort(
//         (a, b) =>
//           Number(b.variants?.[0]?.price ?? 0) -
//           Number(a.variants?.[0]?.price ?? 0)
//       );
//     } else {
//       result.sort((a, b) => b.id - a.id);
//     }

//     return result;
//   }, [products, selectedCategory, sortBy]);

//   if (isLoading) {
//     return (
//       <section className="py-10 px-4 max-w-6xl mx-auto">
//         <div className="text-center text-gray-500">
//           Loading products...
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section id="catalog-section" className="py-6 sm:py-10 scroll-mt-12">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-4 sm:mb-10">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//         >
//           <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-1 sm:mb-2">
//             The Catalog
//           </h2>

//           <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
//             Browse our collection of {filteredAndSorted.length} items.
//           </p>
//         </motion.div>

//         {/* Custom Responsive Dropdown Box */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             type="button"
//             onClick={() => setIsSortOpen(!isSortOpen)}
//             className="
//               flex items-center justify-between gap-2.5
//               w-full sm:w-auto min-w-42.5
//               bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-gray-700
//               hover:border-gray-400 dark:hover:border-gray-500
//               text-gray-800 dark:text-gray-200
//               py-2 px-4
//               rounded-full
//               text-xs sm:text-sm font-medium
//               shadow-sm hover:shadow
//               transition-all duration-200
//               cursor-pointer
//             "
//           >
//             <span className="flex items-center gap-2 truncate">
//               <SlidersHorizontal size={14} className="text-gray-500" />
//               <span>{sortBy}</span>
//             </span>
//             <ChevronDown
//               size={15}
//               className={`text-gray-400 transition-transform duration-200 ${
//                 isSortOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {/* Dropdown Menu Popup */}
//           {isSortOpen && (
//             <div className="absolute right-0 top-full mt-2 w-full sm:w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl py-1.5 z-30 transition-all duration-200">
//               {SORT_OPTIONS.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => {
//                     setSortBy(option);
//                     setIsSortOpen(false);
//                   }}
//                   className={`
//                     w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-left font-medium transition-colors
//                     ${
//                       sortBy === option
//                         ? "text-[#00416A] dark:text-blue-400 bg-gray-50 dark:bg-slate-700/50"
//                         : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/30"
//                     }
//                   `}
//                 >
//                   <span>{option}</span>
//                   {sortBy === option && (
//                     <Check size={14} className="text-[#00416A] dark:text-blue-400" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Category Filter */}
//       <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto mb-4 sm:mb-8 gap-2 no-scrollbar">
//         {visibleCategories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => handleCategoryChange(cat)}
//             className={`
//               whitespace-nowrap
//               px-5 sm:px-6
//               py-2 sm:py-2.5
//               rounded-full
//               font-medium
//               transition-all
//               duration-200
//               text-xs sm:text-sm
//               ${
//                 selectedCategory === cat
//                   ? "bg-[#5A5A40] text-white shadow-md"
//                   : " dark:bg-slate-800 text-black dark:text-white border border-gray-200 dark:border-gray-600 hover:border-[#00416A] hover:cursor-pointer dark:hover:border-gray-400"
//               }
//             `}
//           >
//             {cat}
//           </button>
//         ))}

//         {allSubCategories.length > INITIAL_VISIBLE && (
//           <button
//             onClick={() => setShowAllCategories(!showAllCategories)}
//             className="
//               whitespace-nowrap
//               px-5 sm:px-6
//               py-2 sm:py-2.5
//               rounded-full
//               font-medium
//               transition-all
//               duration-200
//               text-xs sm:text-sm
//               bg-gray-100
//               text-gray-600
//               border
//               border-gray-200
//               hover:bg-gray-200
//               hover:text-gray-900
//             "
//           >
//             {showAllCategories ? "See Less..." : "See More..."}
//           </button>
//         )}
//       </div>

//       {/* Product Grid */}
//       <div
//         className={`
//           grid
//           grid-cols-1
//           sm:grid-cols-2
//           md:grid-cols-3
//           lg:grid-cols-4
//           gap-4 sm:gap-6
//           transition-opacity
//           duration-250
//           ${animating ? "opacity-0" : "opacity-100"}
//         `}
//       >
//         {filteredAndSorted.length > 0 ? (
//           filteredAndSorted.map((product: Product, index: number) => {
//             const variant = product.variants?.[0];
//             const price = Number(variant?.price ?? 0);
//             const salePrice = Number(variant?.sale_price ?? 0);

//             const hasDiscount = salePrice > 0 && salePrice < price;
//             const discount = hasDiscount
//               ? Math.round(((price - salePrice) / price) * 100)
//               : 0;

//             const image =
//               variant?.images?.[0]?.image_url ||
//               product.thumbnail ||
//               "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";

//             return (
//               /* 🎯 Scroll Animation for each Card */
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-50px" }}
//                 transition={{
//                   duration: 0.4,
//                   delay: (index % 8) * 0.08, // গ্রিডের প্রথম ৮টা আইটেমে স্মুথ স্ট্যাগার এফেক্ট
//                   ease: "easeOut",
//                 }}
//                 className={`transition-all duration-300 h-full ${
//                   animating
//                     ? "scale-95 opacity-0"
//                     : "scale-100 opacity-100"
//                 }`}
//               >
//                 <div className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full">
//                   {/* Image */}
//                   <Link
//                     to={`/products/${product.slug}`}
//                     state={{ currentCategory: "decor" }}
//                     className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
//                   >
//                     <img
//                       src={image}
//                       alt={product.name}
//                       className="w-full h-auto block min-h-50 object-cover object-center group-hover:scale-105 transition-transform duration-500"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
//                       }}
//                     />

//                     {/* Badges */}
//                     <div className="absolute top-3 left-3 flex flex-col gap-2">
//                       {product.is_featured === "1" && (
//                         <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                           HOT SELL
//                         </span>
//                       )}
//                       {discount > 0 && (
//                         <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                           -{discount}%
//                         </span>
//                       )}
//                     </div>
//                   </Link>

//                   {/* Info */}
//                   <div className="flex-1 flex flex-col">
//                     <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
//                       {variant?.sku}
//                       {product.sub_category?.name && (
//                         <> • {product.sub_category.name}</>
//                       )}
//                     </div>

//                     <Link
//                       to={`/products/${product.slug}`}
//                       state={{ currentCategory: "decor" }}
//                     >
//                       <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
//                         {product.name}
//                       </h3>
//                     </Link>

//                     {/* Price */}
//                     <div className="flex items-center gap-3 mt-auto pt-2">
//                       <span className="text-sm font-bold text-gray-900 dark:text-white">
//                         ৳{" "}
//                         {(hasDiscount
//                           ? salePrice
//                           : price
//                         ).toLocaleString()}
//                       </span>
//                       {hasDiscount && (
//                         <span className="text-xs text-gray-400 line-through">
//                           ৳ {price.toLocaleString()}
//                         </span>
//                       )}
//                     </div>

//                     {/* View Details */}
//                     <Link
//                       to={`/products/${product.slug}`}
//                       state={{ currentCategory: "decor" }}
//                       className="
//                         w-full
//                         bg-gray-900 dark:bg-white
//                         text-white dark:text-gray-900
//                         text-center
//                         py-3
//                         mt-4
//                         rounded-full
//                         text-[10px]
//                         font-bold
//                         tracking-widest
//                         hover:bg-[#5A5A40]
//                         dark:hover:bg-gray-100
//                         transition-colors
//                         duration-200
//                         block
//                       "
//                     >
//                       VIEW DETAILS
//                     </Link>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })
//         ) : (
//           <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-20 text-gray-400">
//             <p className="text-lg">No products found in this category.</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }










// /* eslint-disable prefer-const */
// // src/components/modules/DecorPage/ProductCatalog.tsx

// import { useState, useMemo, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product } from "@/types/product.type";

// type SortOption =
//   | "Newest First"
//   | "Price Low to High"
//   | "Price High to Low";

// const SORT_OPTIONS: SortOption[] = [
//   "Newest First",
//   "Price Low to High",
//   "Price High to Low",
// ];

// const INITIAL_VISIBLE = 8;

// export default function ProductCatalog() {
//   const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

//   const products = useMemo(() => {
//     const allProducts = data?.data ?? [];
//     return allProducts.filter(
//       (p) => p.category?.name?.toLowerCase().includes("decor")
//     );
//   }, [data]);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [sortBy, setSortBy] = useState<SortOption>("Newest First");
//   const [showAllCategories, setShowAllCategories] = useState(false);
//   const [animating, setAnimating] = useState(false);
//   const [isSortOpen, setIsSortOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsSortOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const allSubCategories = useMemo(
//     () => [
//       "All",
//       ...Array.from(
//         new Set(
//           products
//             .map((p) => p.sub_category?.name)
//             .filter(Boolean)
//         )
//       ),
//     ],
//     [products]
//   );

//   const visibleCategories = showAllCategories
//     ? allSubCategories
//     : allSubCategories.slice(0, INITIAL_VISIBLE);

//   const handleCategoryChange = (cat: string) => {
//     if (cat === selectedCategory) return;

//     setAnimating(true);

//     setTimeout(() => {
//       setSelectedCategory(cat);
//       setAnimating(false);
//     }, 250);
//   };

//   const filteredAndSorted = useMemo(() => {
//     let result =
//       selectedCategory === "All"
//         ? [...products]
//         : products.filter(
//           (p) => p.sub_category?.name === selectedCategory
//         );

//     if (sortBy === "Price Low to High") {
//       result.sort(
//         (a, b) =>
//           Number(a.variants?.[0]?.price ?? 0) -
//           Number(b.variants?.[0]?.price ?? 0)
//       );
//     } else if (sortBy === "Price High to Low") {
//       result.sort(
//         (a, b) =>
//           Number(b.variants?.[0]?.price ?? 0) -
//           Number(a.variants?.[0]?.price ?? 0)
//       );
//     } else {
//       result.sort((a, b) => b.id - a.id);
//     }

//     return result;
//   }, [products, selectedCategory, sortBy]);

//   if (isLoading) {
//     return (
//       <section className="py-10 px-4 max-w-6xl mx-auto">
//         <div className="text-center text-gray-500">
//           Loading products...
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-6 sm:py-10">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
//         <div>
//           <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-1 sm:mb-2">
//             The Catalog
//           </h2>

//           <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
//             Browse our collection of {filteredAndSorted.length} items.
//           </p>
//         </div>

//         {/* Custom Responsive Dropdown Box */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             type="button"
//             onClick={() => setIsSortOpen(!isSortOpen)}
//             className="
//               flex items-center justify-between gap-2.5
//               w-full sm:w-auto min-w-42.5
//               bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-gray-700
//               hover:border-gray-400 dark:hover:border-gray-500
//               text-gray-800 dark:text-gray-200
//               py-2 px-4
//               rounded-full
//               text-xs sm:text-sm font-medium
//               shadow-sm hover:shadow
//               transition-all duration-200
//               cursor-pointer
//             "
//           >
//             <span className="flex items-center gap-2 truncate">
//               <SlidersHorizontal size={14} className="text-gray-500" />
//               <span>{sortBy}</span>
//             </span>
//             <ChevronDown
//               size={15}
//               className={`text-gray-400 transition-transform duration-200 ${
//                 isSortOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {/* Dropdown Menu Popup */}
//           {isSortOpen && (
//             <div className="absolute right-0 top-full mt-2 w-full sm:w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl py-1.5 z-30 transition-all duration-200">
//               {SORT_OPTIONS.map((option) => (
//                 <button
//                   key={option}
//                   onClick={() => {
//                     setSortBy(option);
//                     setIsSortOpen(false);
//                   }}
//                   className={`
//                     w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-left font-medium transition-colors
//                     ${
//                       sortBy === option
//                         ? "text-[#00416A] dark:text-blue-400 bg-gray-50 dark:bg-slate-700/50"
//                         : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/30"
//                     }
//                   `}
//                 >
//                   <span>{option}</span>
//                   {sortBy === option && (
//                     <Check size={14} className="text-[#00416A] dark:text-blue-400" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Category Filter */}
//       <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto pb-4 mb-6 sm:mb-8 gap-2 no-scrollbar">
//         {visibleCategories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => handleCategoryChange(cat)}
//             className={`
//               whitespace-nowrap
//               px-5 sm:px-6
//               py-2 sm:py-2.5
//               rounded-full
//               font-medium
//               transition-all
//               duration-200
//               text-xs sm:text-sm
//               ${
//                 selectedCategory === cat
//                   ? "bg-[#5A5A40] text-white shadow-md"
//                   : " dark:bg-slate-800 text-black dark:text-white border border-gray-200 dark:border-gray-600 hover:border-[#00416A] hover:cursor-pointer dark:hover:border-gray-400"
//               }
//             `}
//           >
//             {cat}
//           </button>
//         ))}

//         {allSubCategories.length > INITIAL_VISIBLE && (
//           <button
//             onClick={() => setShowAllCategories(!showAllCategories)}
//             className="
//               whitespace-nowrap
//               px-5 sm:px-6
//               py-2 sm:py-2.5
//               rounded-full
//               font-medium
//               transition-all
//               duration-200
//               text-xs sm:text-sm
//               bg-gray-100
//               text-gray-600
//               border
//               border-gray-200
//               hover:bg-gray-200
//               hover:text-gray-900
//             "
//           >
//             {showAllCategories ? "See Less..." : "See More..."}
//           </button>
//         )}
//       </div>

//       {/* Product Grid */}
//       <div
//         className={`
//           grid
//           grid-cols-1
//           sm:grid-cols-2
//           md:grid-cols-3
//           lg:grid-cols-4
//           gap-4 sm:gap-6
//           transition-opacity
//           duration-250
//           ${animating ? "opacity-0" : "opacity-100"}
//         `}
//       >
//         {filteredAndSorted.length > 0 ? (
//           filteredAndSorted.map((product: Product) => {
//             const variant = product.variants?.[0];
//             const price = Number(variant?.price ?? 0);
//             const salePrice = Number(variant?.sale_price ?? 0);

//             const hasDiscount = salePrice > 0 && salePrice < price;
//             const discount = hasDiscount
//               ? Math.round(((price - salePrice) / price) * 100)
//               : 0;

//             const image =
//               variant?.images?.[0]?.image_url ||
//               product.thumbnail ||
//               "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";

//             return (
//               <div
//                 key={product.id}
//                 className={`transition-all duration-300 ${
//                   animating
//                     ? "scale-95 opacity-0"
//                     : "scale-100 opacity-100"
//                 }`}
//               >
//                 <div className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full">
//                   {/* Image */}
//                   <Link
//                     to={`/products/${product.slug}`}
//                     state={{ currentCategory: "decor" }}
//                     className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
//                   >
//                     <img
//                       src={image}
//                       alt={product.name}
//                       className="w-full h-auto block min-h-50 object-cover object-center group-hover:scale-105 transition-transform duration-500"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
//                       }}
//                     />

//                     {/* Badges */}
//                     <div className="absolute top-3 left-3 flex flex-col gap-2">
//                       {product.is_featured === "1" && (
//                         <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                           HOT SELL
//                         </span>
//                       )}
//                       {discount > 0 && (
//                         <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                           -{discount}%
//                         </span>
//                       )}
//                     </div>
//                   </Link>

//                   {/* Info */}
//                   <div className="flex-1 flex flex-col">
//                     <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
//                       {variant?.sku}
//                       {product.sub_category?.name && (
//                         <> • {product.sub_category.name}</>
//                       )}
//                     </div>

//                     <Link
//                       to={`/products/${product.slug}`}
//                       state={{ currentCategory: "decor" }}
//                     >
//                       <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
//                         {product.name}
//                       </h3>
//                     </Link>

//                     {/* Price */}
//                     <div className="flex items-center gap-3 mt-auto pt-2">
//                       <span className="text-sm font-bold text-gray-900 dark:text-white">
//                         ৳{" "}
//                         {(hasDiscount
//                           ? salePrice
//                           : price
//                         ).toLocaleString()}
//                       </span>
//                       {hasDiscount && (
//                         <span className="text-xs text-gray-400 line-through">
//                           ৳ {price.toLocaleString()}
//                         </span>
//                       )}
//                     </div>

//                     {/* View Details */}
//                     <Link
//                       to={`/products/${product.slug}`}
//                       state={{ currentCategory: "decor" }}
//                       className="
//                         w-full
//                         bg-gray-900 dark:bg-white
//                         text-white dark:text-gray-900
//                         text-center
//                         py-3
//                         mt-4
//                         rounded-full
//                         text-[10px]
//                         font-bold
//                         tracking-widest
//                         hover:bg-[#5A5A40]
//                         dark:hover:bg-gray-100
//                         transition-colors
//                         duration-200
//                         block
//                       "
//                     >
//                       VIEW DETAILS
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-20 text-gray-400">
//             <p className="text-lg">No products found in this category.</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }


