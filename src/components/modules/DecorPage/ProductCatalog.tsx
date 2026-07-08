/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
// src/components/modules/DecorPage/ProductCatalog.tsx

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";

type SortOption =
  | "Newest First"
  | "Price Low to High"
  | "Price High to Low";

const INITIAL_VISIBLE = 8;

export default function ProductCatalog() {
  const { data, isLoading } = useGetProductsQuery({per_page: 100});

  const products = data?.data ?? [];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] =
    useState<SortOption>("Newest First");
  const [showAllCategories, setShowAllCategories] =
    useState(false);
  const [animating, setAnimating] = useState(false);

  const allSubCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          products
            .map((p) => p.sub_category?.name)
            .filter(Boolean)
        ),
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

  const filteredAndSorted = useMemo(() => {
    let result =
      selectedCategory === "All"
        ? [...products]
        : products.filter(
          (p) =>
            p.sub_category?.name === selectedCategory
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
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  if (isLoading) {
    return (
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <div className="text-center text-gray-500">
          Loading products...
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-2">
            The Catalog
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Browse our collection of {filteredAndSorted.length} items.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              title="Sort Products"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as SortOption)
              }
              className="
                appearance-none
                bg-white dark:bg-slate-800
                border border-gray-200 dark:border-gray-600
                text-black dark:text-white
                py-2.5 pl-4 pr-10
                rounded-full
                font-medium
                focus:ring-2
                focus:ring-[#00416A]
                outline-none
                cursor-pointer
                text-sm
              "
            >
              <option value="Newest First">
                Newest First
              </option>

              <option value="Price Low to High">
                Price Low to High
              </option>

              <option value="Price High to Low">
                Price High to Low
              </option>
            </select>

            <SlidersHorizontal
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap pb-4 mb-8 gap-2">
        {visibleCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`
              whitespace-nowrap
              px-6
              py-2.5
              rounded-full
              font-medium
              transition-all
              duration-200
              text-sm
              ${selectedCategory === cat
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
            onClick={() =>
              setShowAllCategories(!showAllCategories)
            }
            className="
              whitespace-nowrap
              px-6
              py-2.5
              rounded-full
              font-medium
              transition-all
              duration-200
              text-sm
              bg-gray-100
              text-gray-600
              border
              border-gray-200
              hover:bg-gray-200
              hover:text-gray-900
            "
          >
            {showAllCategories
              ? "See Less..."
              : "See More..."}
          </button>
        )}
      </div>

      
      <div
        className={`
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
          transition-opacity
          duration-250
          ${animating ? "opacity-0" : "opacity-100"}
        `}
      >

        {filteredAndSorted.length > 0 ? (
          filteredAndSorted.map((product: Product) => {
            const variant = product.variants?.[0];

            const price = Number(variant?.price ?? 0);
            const salePrice = Number(variant?.sale_price ?? 0);

            const hasDiscount =
              salePrice > 0 && salePrice < price;

            const discount = hasDiscount
              ? Math.round(((price - salePrice) / price) * 100)
              : 0;

            const image =
              variant?.images?.[0]?.image_url ||
              product.thumbnail ||
              "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";

            return (
              <div
                key={product.id}
                className={`transition-all duration-300 ${animating
                    ? "scale-95 opacity-0"
                    : "scale-100 opacity-100"
                  }`}
              >
                <div className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full">

                  {/* Image */}
                  <Link
                    to={`/products/${product.slug}`}
                    className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
                  >
                    <img
                      src={image}
                      alt={product.name}
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

                      {/* new */}
                      {/* {product.is_new === "1" && (
                        <span className="bg-[#00416A] text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
                          NEW
                        </span>
                      )} */}

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
                        <>
                          {" "}• {product.sub_category.name}
                        </>
                      )}
                    </div>

                    <Link to={`/products/${product.slug}`}>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-3 mt-auto pt-2">

                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ৳
                        {(hasDiscount
                          ? salePrice
                          : price
                        ).toLocaleString()}
                      </span>

                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          ৳{price.toLocaleString()}
                        </span>
                      )}

                    </div>

                    {/* View Details */}
                    <Link
                      to={`/products/${product.slug}`}
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
              </div>
            );
          })
        ) : (
          <div className="col-span-4 text-center py-20 text-gray-400">
            <p className="text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}













// /* eslint-disable prefer-const */
// // src/components/modules/DecorPage/ProductCatalog.tsx
// import { useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { SlidersHorizontal } from "lucide-react";
// import { decorProducts } from "@/data/products/decorProducts";

// type SortOption = "Newest First" | "Price Low to High" | "Price High to Low";

// // সব unique subCategory গুলো বের করো
// const allSubCategories = ["All", ...Array.from(new Set(decorProducts.map(p => p.subCategory)))];
// const INITIAL_VISIBLE = 8; // category filter এ কতটা দেখাবে

// export default function ProductCatalog() {
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [sortBy, setSortBy] = useState<SortOption>("Newest First");
//   const [showAllCategories, setShowAllCategories] = useState(false);
//   const [animating, setAnimating] = useState(false);

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
//     let result = selectedCategory === "All"
//       ? [...decorProducts]
//       : decorProducts.filter(p => p.subCategory === selectedCategory);

//     if (sortBy === "Price Low to High") {
//       result.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "Price High to Low") {
//       result.sort((a, b) => b.price - a.price);
//     }
//     // "Newest First" → original array order (id desc)
//     else {
//       result.sort((a, b) => b.id - a.id);
//     }

//     return result;
//   }, [selectedCategory, sortBy]);

//   return (
//     <section className="py-10 px-4 max-w-6xl mx-auto">

//       {/* Header — Title + Sort */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
//         <div>
//           <h2 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-2">
//             The Catalog
//           </h2>
//           <p className="text-gray-500 dark:text-gray-400 text-sm">
//             Browse our collection of {filteredAndSorted.length} items.
//           </p>
//         </div>

//         {/* Sort Dropdown */}
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <select
//               title="Sort Products"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value as SortOption)}
//               className="
//                 appearance-none bg-white dark:bg-slate-800
//                 border border-gray-200 dark:border-gray-600
//                 text-gray-800 dark:text-white
//                 py-2.5 pl-4 pr-10 rounded-full font-medium
//                 focus:ring-2 focus:ring-[#00416A] outline-none
//                 cursor-pointer text-sm
//               "
//             >
//               <option value="Newest First">Newest First</option>
//               <option value="Price Low to High">Price Low to High</option>
//               <option value="Price High to Low">Price High to Low</option>
//             </select>
//             <SlidersHorizontal
//               size={16}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Category Filter Pills */}
//       <div className="flex flex-wrap pb-4 mb-8 gap-2">
//         {visibleCategories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => handleCategoryChange(cat)}
//             className={`
//               whitespace-nowrap px-6 py-2.5 rounded-full font-medium
//               transition-all duration-200 text-sm
//               ${selectedCategory === cat
//                 ? "bg-[#00416A] text-white shadow-md"
//                 : "bg-white dark:bg-slate-800 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:border-[#00416A] dark:hover:border-gray-400"
//               }
//             `}
//           >
//             {cat}
//           </button>
//         ))}

//         {/* See More / Less */}
//         {allSubCategories.length > INITIAL_VISIBLE && (
//           <button
//             onClick={() => setShowAllCategories(!showAllCategories)}
//             className="
//               whitespace-nowrap px-6 py-2.5 rounded-full font-medium
//               transition-all duration-200 text-sm
//               bg-gray-100 text-gray-600 border border-gray-200
//               hover:bg-gray-200 hover:text-gray-900
//             "
//           >
//             {showAllCategories ? "See Less..." : "See More..."}
//           </button>
//         )}
//       </div>

//       {/* Product Grid */}
//       <div
//         className={`
//           grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6
//           transition-opacity duration-250
//           ${animating ? "opacity-0" : "opacity-100"}
//         `}
//       >
//         {filteredAndSorted.length > 0 ? (
//           filteredAndSorted.map((product) => (
//             <div
//               key={product.id}
//               className={`transition-all duration-300 ${animating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
//             >
//               <div className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full">

//                 {/* Image */}
//                 <Link
//                   to={`/product/${product.slug}`}
//                   className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
//                 >
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-auto block min-h-50 object-cover object-center group-hover:scale-105 transition-transform duration-500"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src =
//                         "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
//                     }}
//                   />

//                   {/* Badges */}
//                   <div className="absolute top-3 left-3 flex flex-col gap-2">
//                     {product.isHotSell && (
//                       <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         HOT SELL
//                       </span>
//                     )}
//                     {product.isNew && (
//                       <span className="bg-[#00416A] text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         NEW
//                       </span>
//                     )}
//                     {product.discount! > 0 && (
//                       <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         -{product.discount}%
//                       </span>
//                     )}
//                   </div>
//                 </Link>

//                 {/* Info */}
//                 <div className="flex-1 flex flex-col">
//                   <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
//                     {product.sku} • {product.subCategory}
//                   </div>

//                   <Link to={`/product/${product.slug}`}>
//                     <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
//                       {product.name}
//                     </h3>
//                   </Link>

//                   {/* Price */}
//                   <div className="flex items-center gap-3 mt-auto pt-2">
//                     <span className="text-sm font-bold text-gray-900 dark:text-white">
//                       ৳{product.price.toLocaleString()}
//                     </span>
//                     {product.oldPrice! > product.price && (
//                       <span className="text-xs text-gray-400 line-through">
//                         ৳{product.oldPrice!.toLocaleString()}
//                       </span>
//                     )}
//                   </div>

//                   {/* View Details Button */}
//                   <Link
//                     to={`/products/${product.slug}`}
//                     className="
//                       w-full bg-gray-900 dark:bg-white
//                       text-white dark:text-gray-900
//                       text-center py-3 mt-4 rounded-full
//                       text-[10px] font-bold tracking-widest
//                       hover:bg-[#00416A] dark:hover:bg-gray-100
//                       transition-colors duration-200
//                       block
//                     "
//                   >
//                     VIEW DETAILS
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-4 text-center py-20 text-gray-400">
//             <p className="text-lg">No products found in this category.</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }