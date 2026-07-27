/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/SearchPage.tsx
import { useSearchParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import { motion } from "framer-motion"; // 🎯 Framer Motion Import

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  // ✅ ১. URL থেকে category_id রিড করা হচ্ছে
  const categoryId = searchParams.get("category_id");

  // ✅ ২. এপিআই তে category_id পাস করা হচ্ছে
  const { data, isLoading } = useGetProductsQuery(
    {
      search: query,
      ...(categoryId ? { category_id: Number(categoryId) } : {}),
      per_page: 100,
    },
    { skip: !query.trim() }
  );

  const allProducts = data?.data || [];

  // ✅ ৩. ক্লায়েন্ট সাইড ফিল্টারিং - নাম, SKU, Variant SKU এবং Category ID ফিল্টার করা হচ্ছে
  const filteredProducts = allProducts.filter((product: any) => {
    const q = query.toLowerCase();
    const productName = product.name?.toLowerCase() || "";
    const productSku = product.sku?.toLowerCase() || "";

    // ভ্যারিয়েন্টের ভেতর SKU আছে কিনা চেক করা
    const variantMatch = product.variants?.some((variant: any) =>
      variant.sku?.toLowerCase().includes(q)
    );

    const matchesSearch =
      productName.includes(q) || productSku.includes(q) || variantMatch;

    // যদি URL এ category_id থাকে, তবে প্রোডাক্টের category_id ম্যাচ করছে কিনা চেক করা
    const matchesCategory = categoryId
      ? Number(product.category_id) === Number(categoryId) ||
        Number(product.category?.id) === Number(categoryId)
      : true;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center font-semibold text-gray-500 animate-pulse">
          Loading results...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* 🎯 Header Scroll Fade-Up Animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6"
      >
        Search Results for: <span className="text-blue-600">"{query}"</span>
      </motion.h1>

      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16 text-gray-500 dark:text-gray-400"
        >
          No products found matching your search.
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product: any, index: number) => {
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
              /* 🎯 Staggered Scroll Animation for Product Cards */
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05, // একের পর এক সুন্দর smooth entrance dynamic করার জন্য delay
                  ease: "easeOut",
                }}
                className="h-full"
              >
                {/* Product Catalog UI Card */}
                <div className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full">
                  {/* Image & Badges */}
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
                      {discount > 0 && (
                        <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
                      {variant?.sku || `PD-00${product.id}`}
                      {product.sub_category?.name && (
                        <> • {product.sub_category.name}</>
                      )}
                    </div>

                    <Link to={`/products/${product.slug}`}>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price Section */}
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

                    {/* View Details Button */}
                    <Link
                      to={`/products/${product.slug}`}
                      className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center py-3 mt-4 rounded-full text-[10px] font-bold tracking-widest hover:bg-[#5A5A40] dark:hover:bg-gray-100 transition-colors duration-200 block"
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











// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/pages/SearchPage.tsx
// import { useSearchParams, Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// export default function SearchPage() {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("query") || "";
  
//   // ✅ ১. URL থেকে category_id রিড করা হচ্ছে
//   const categoryId = searchParams.get("category_id");

//   // ✅ ২. এপিআই তে category_id পাস করা হচ্ছে
//   const { data, isLoading } = useGetProductsQuery(
//     { 
//       search: query, 
//       ...(categoryId ? { category_id: Number(categoryId) } : {}),
//       per_page: 100 
//     },
//     { skip: !query.trim() }
//   );

//   const allProducts = data?.data || [];

//   // ✅ ৩. ক্লায়েন্ট সাইড ফিল্টারিং - নাম, SKU, Variant SKU এবং Category ID ফিল্টার করা হচ্ছে
//   const filteredProducts = allProducts.filter((product: any) => {
//     const q = query.toLowerCase();
//     const productName = product.name?.toLowerCase() || "";
//     const productSku = product.sku?.toLowerCase() || "";

//     // ভ্যারিয়েন্টের ভেতর SKU আছে কিনা চেক করা
//     const variantMatch = product.variants?.some((variant: any) =>
//       variant.sku?.toLowerCase().includes(q)
//     );

//     const matchesSearch = productName.includes(q) || productSku.includes(q) || variantMatch;

//     // যদি URL এ category_id থাকে, তবে প্রোডাক্টের category_id ম্যাচ করছে কিনা চেক করা
//     const matchesCategory = categoryId
//       ? Number(product.category_id) === Number(categoryId) ||
//         Number(product.category?.id) === Number(categoryId)
//       : true;

//     return matchesSearch && matchesCategory;
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <div className="text-center font-semibold text-gray-500 animate-pulse">
//           Loading results...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
//       <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">
//         Search Results for: <span className="text-blue-600">"{query}"</span>
//       </h1>

//       {filteredProducts.length === 0 ? (
//         <div className="text-center py-16 text-gray-500 dark:text-gray-400">
//           No products found matching your search.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {filteredProducts.map((product: any) => {
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
//               /* ✅ ProductCatalog UI কার্ড ডিজাইন */
//               <div
//                 key={product.id}
//                 className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full"
//               >
//                 {/* Image & Badges */}
//                 <Link
//                   to={`/products/${product.slug}`}
//                   className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
//                 >
//                   <img
//                     src={image}
//                     alt={product.name}
//                     className="w-full h-auto block min-h-50 object-cover object-center group-hover:scale-105 transition-transform duration-500"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src =
//                         "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
//                     }}
//                   />

//                   {/* Badges */}
//                   <div className="absolute top-3 left-3 flex flex-col gap-2">
//                     {product.is_featured === "1" && (
//                       <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         HOT SELL
//                       </span>
//                     )}
//                     {discount > 0 && (
//                       <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         -{discount}%
//                       </span>
//                     )}
//                   </div>
//                 </Link>

//                 {/* Product Info */}
//                 <div className="flex-1 flex flex-col">
//                   <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
//                     {variant?.sku || `PD-00${product.id}`}
//                     {product.sub_category?.name && (
//                       <> • {product.sub_category.name}</>
//                     )}
//                   </div>

//                   <Link to={`/products/${product.slug}`}>
//                     <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
//                       {product.name}
//                     </h3>
//                   </Link>

//                   {/* Price Section */}
//                   <div className="flex items-center gap-3 mt-auto pt-2">
//                     <span className="text-sm font-bold text-gray-900 dark:text-white">
//                       ৳{" "}
//                       {(hasDiscount
//                         ? salePrice
//                         : price
//                       ).toLocaleString()}
//                     </span>
//                     {hasDiscount && (
//                       <span className="text-xs text-gray-400 line-through">
//                         ৳ {price.toLocaleString()}
//                       </span>
//                     )}
//                   </div>

//                   {/* View Details Button */}
//                   <Link
//                     to={`/products/${product.slug}`}
//                     className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center py-3 mt-4 rounded-full text-[10px] font-bold tracking-widest hover:bg-[#5A5A40] dark:hover:bg-gray-100 transition-colors duration-200 block"
//                   >
//                     VIEW DETAILS
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }








// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/pages/SearchPage.tsx
// import { useSearchParams, Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// export default function SearchPage() {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("query") || "";

//   // সার্চ কোয়েরি দিয়ে ডেটা ফেচ করা হচ্ছে
//   const { data, isLoading } = useGetProductsQuery(
//     { search: query, per_page: 100 },
//     { skip: !query.trim() }
//   );

//   const allProducts = data?.data || [];

//   // ✅ ক্লায়েন্ট সাইড ফিল্টারিং - নাম, SKU এবং Variant SKU চেক করা হচ্ছে
//   const filteredProducts = allProducts.filter((product: any) => {
//     const q = query.toLowerCase();
//     const productName = product.name?.toLowerCase() || "";
//     const productSku = product.sku?.toLowerCase() || "";

//     // ভ্যারিয়েন্টের ভেতর SKU আছে কিনা চেক করা
//     const variantMatch = product.variants?.some((variant: any) =>
//       variant.sku?.toLowerCase().includes(q)
//     );

//     return productName.includes(q) || productSku.includes(q) || variantMatch;
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <div className="text-center font-semibold text-gray-500 animate-pulse">
//           Loading results...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
//       <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">
//         Search Results for: <span className="text-blue-600">"{query}"</span>
//       </h1>

//       {filteredProducts.length === 0 ? (
//         <div className="text-center py-16 text-gray-500 dark:text-gray-400">
//           No products found matching your search.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {filteredProducts.map((product: any) => {
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
//               /* ✅ ProductCatalog UI কার্ড ডিজাইন */
//               <div
//                 key={product.id}
//                 className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full"
//               >
//                 {/* Image & Badges */}
//                 <Link
//                   to={`/products/${product.slug}`}
//                   className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
//                 >
//                   <img
//                     src={image}
//                     alt={product.name}
//                     className="w-full h-auto block min-h-50 object-cover object-center group-hover:scale-105 transition-transform duration-500"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src =
//                         "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
//                     }}
//                   />

//                   {/* Badges */}
//                   <div className="absolute top-3 left-3 flex flex-col gap-2">
//                     {product.is_featured === "1" && (
//                       <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         HOT SELL
//                       </span>
//                     )}
//                     {discount > 0 && (
//                       <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         -{discount}%
//                       </span>
//                     )}
//                   </div>
//                 </Link>

//                 {/* Product Info */}
//                 <div className="flex-1 flex flex-col">
//                   <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
//                     {variant?.sku || `PD-00${product.id}`}
//                     {product.sub_category?.name && (
//                       <> • {product.sub_category.name}</>
//                     )}
//                   </div>

//                   <Link to={`/products/${product.slug}`}>
//                     <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
//                       {product.name}
//                     </h3>
//                   </Link>

//                   {/* Price Section */}
//                   <div className="flex items-center gap-3 mt-auto pt-2">
//                     <span className="text-sm font-bold text-gray-900 dark:text-white">
//                       ৳{" "}
//                       {(hasDiscount
//                         ? salePrice
//                         : price
//                       ).toLocaleString()}
//                     </span>
//                     {hasDiscount && (
//                       <span className="text-xs text-gray-400 line-through">
//                         ৳ {price.toLocaleString()}
//                       </span>
//                     )}
//                   </div>

//                   {/* View Details Button */}
//                   <Link
//                     to={`/products/${product.slug}`}
//                     className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center py-3 mt-4 rounded-full text-[10px] font-bold tracking-widest hover:bg-[#5A5A40] dark:hover:bg-gray-100 transition-colors duration-200 block"
//                   >
//                     VIEW DETAILS
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }









// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/pages/SearchPage.tsx
// import { useSearchParams, Link } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// export default function SearchPage() {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("query") || "";

//   // সার্চ কোয়েরি দিয়ে ডেটা ফেচ করা হচ্ছে
//   const { data, isLoading } = useGetProductsQuery(
//     { search: query, per_page: 100 },
//     { skip: !query.trim() }
//   );

//   const allProducts = data?.data || [];

//   // ক্লায়েন্ট সাইড ফিল্টারিং
//   const filteredProducts = allProducts.filter((product: any) => {
//     const productName = product.name?.toLowerCase() || "";
//     return productName.includes(query.toLowerCase());
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <div className="text-center font-semibold text-gray-500 animate-pulse">
//           Loading results...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
//       <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6">
//         Search Results for: <span className="text-blue-600">"{query}"</span>
//       </h1>

//       {filteredProducts.length === 0 ? (
//         <div className="text-center py-16 text-gray-500 dark:text-gray-400">
//           No products found matching your search.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
//           {filteredProducts.map((product: any) => {
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
//               /* ✅ ProductCatalog UI কার্ড ডিজাইন */
//               <div
//                 key={product.id}
//                 className="group relative bg-white dark:bg-slate-800 rounded-3xl flex flex-col transition-all duration-300 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg h-full"
//               >
//                 {/* Image & Badges */}
//                 <Link
//                   to={`/products/${product.slug}`}
//                   className="block relative w-full overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-2xl mb-4"
//                 >
//                   <img
//                     src={image}
//                     alt={product.name}
//                     className="w-full h-auto block min-h-50 object-cover object-center group-hover:scale-105 transition-transform duration-500"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src =
//                         "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";
//                     }}
//                   />

//                   {/* Badges */}
//                   <div className="absolute top-3 left-3 flex flex-col gap-2">
//                     {product.is_featured === "1" && (
//                       <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         HOT SELL
//                       </span>
//                     )}
//                     {discount > 0 && (
//                       <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-1 rounded tracking-wider shadow-sm">
//                         -{discount}%
//                       </span>
//                     )}
//                   </div>
//                 </Link>

//                 {/* Product Info */}
//                 <div className="flex-1 flex flex-col">
//                   <div className="text-[10px] text-gray-400 mb-1 font-mono tracking-widest uppercase">
//                     {variant?.sku || `PD-00${product.id}`}
//                     {product.sub_category?.name && (
//                       <> • {product.sub_category.name}</>
//                     )}
//                   </div>

//                   <Link to={`/products/${product.slug}`}>
//                     <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-[#00416A] dark:group-hover:text-blue-400 transition-colors">
//                       {product.name}
//                     </h3>
//                   </Link>

//                   {/* Price Section */}
//                   <div className="flex items-center gap-3 mt-auto pt-2">
//                     <span className="text-sm font-bold text-gray-900 dark:text-white">
//                       ৳{" "}
//                       {(hasDiscount
//                         ? salePrice
//                         : price
//                       ).toLocaleString()}
//                     </span>
//                     {hasDiscount && (
//                       <span className="text-xs text-gray-400 line-through">
//                         ৳ {price.toLocaleString()}
//                       </span>
//                     )}
//                   </div>

//                   {/* View Details Button */}
//                   <Link
//                     to={`/products/${product.slug}`}
//                     className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center py-3 mt-4 rounded-full text-[10px] font-bold tracking-widest hover:bg-[#5A5A40] dark:hover:bg-gray-100 transition-colors duration-200 block"
//                   >
//                     VIEW DETAILS
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }





