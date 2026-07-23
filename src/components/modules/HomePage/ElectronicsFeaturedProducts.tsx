/* eslint-disable react-hooks/exhaustive-deps */

import { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import { useGetProductsQuery } from "@/redux/services/product/product.api";
import type { Product } from "@/types/product.type";

const VISIBLE = 5;
const GAP = 12;

export default function ElectronicsFeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

  const electronicsProducts = useMemo(() => {
    const allProducts = data?.data ?? [];

    return allProducts.filter((p) => {
      const isElectronics = p.category?.name?.toLowerCase().includes("electronics");

      const isFeatured =
        p.is_featured === true ||
        p.is_featured === 1 ||
        p.is_featured === "1";

      return isElectronics && isFeatured;
    });
  }, [data]);

  const getCardWidth = () => {
    const el = scrollRef.current;
    if (!el) return 170;

    let currentVisible = VISIBLE;
    if (window.innerWidth < 640) {
      currentVisible = 2; // Small devices (mobile)
    } else if (window.innerWidth < 1024) {
      currentVisible = 3; // Medium devices (tablet)
    }

    return (el.clientWidth - GAP * (currentVisible - 1)) / currentVisible;
  };

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = getCardWidth();
    el.scrollBy({
      left: dir === "left" ? -(cardWidth + GAP) : cardWidth + GAP,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  const autoScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const cardWidth = getCardWidth();
      el.scrollBy({ left: cardWidth + GAP, behavior: "smooth" });
    }
    setTimeout(checkScroll, 350);
  };

  const startAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(autoScroll, 3000);
  };

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  useEffect(() => {
    checkScroll();
    if (electronicsProducts.length > 0) {
      startAuto();
    }
    return () => stopAuto();
  }, [electronicsProducts]);

  if (isLoading) {
    return (
      <section className="py-8">
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-6">
          Electronics Featured Products
        </h2>
        <div className="text-center text-gray-500 py-10 animate-pulse">
          Loading electronics products...
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8">
      <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6">
        Electronics Featured Products
      </h2>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
            className="
              absolute left-1 sm:left-2 lg:left-4 top-[40%] -translate-y-1/2 z-10
              w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-700/90 lg:bg-white lg:dark:bg-slate-700
              border border-gray-200 dark:border-gray-600
              flex items-center justify-center shadow-md hover:cursor-pointer
              text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
            "
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {electronicsProducts.length === 0 ? (
            <div className="w-full text-center py-10 text-gray-400">
              No featured electronics products found.
            </div>
          ) : (
            electronicsProducts.map((product: Product) => {
              const variant = product.variants?.[0];
              const price = Number(variant?.price ?? 0);
              const salePrice = Number(variant?.sale_price ?? 0);
              const hasDiscount = salePrice > 0 && salePrice < price;

              const image =
                variant?.images?.[0]?.image_url ||
                product.thumbnail ||
                "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";

              return (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  state={{ currentCategory: "electronics" }}
                  className="shrink-0 flex flex-col group hover:cursor-pointer w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
                >
                  {/* Image Box */}
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
                    {/* Image with zoom effect */}
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
                      }}
                    />

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                    {/* Buy Now Button */}
                    <div className="
                      absolute bottom-2 left-1/2 -translate-x-1/2
                      opacity-0 group-hover:opacity-100
                      translate-y-2 group-hover:translate-y-0
                      transition-all duration-300
                    ">
                      <span className="
                        bg-white text-gray-900 text-[10px] sm:text-xs font-bold
                        px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md
                        hover:bg-gray-100 transition-colors whitespace-nowrap items-center gap-1 inline-block
                      ">
                        <ShoppingCart size={12} className="inline-block mr-1" />
                        Buy Now
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-2 px-0.5">
                    <p className="text-sm sm:text-base lg:text-lg home-black-text font-medium truncate group-hover:text-[#003557] transition-colors duration-200">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs sm:text-sm font-bold home-black-text">
                        ৳{(hasDiscount ? salePrice : price).toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] sm:text-xs home-red-text line-through">
                          ৳{price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {canScrollRight && electronicsProducts.length > VISIBLE && (
          <button
            onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
            className="
              absolute right-1 sm:right-2 lg:right-4 top-[40%] -translate-y-1/2 z-10
              w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-700/90 lg:bg-white lg:dark:bg-slate-700
              border border-gray-200 dark:border-gray-600
              flex items-center justify-center shadow-md hover:cursor-pointer
              text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
            "
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-4 sm:mt-6">
        <Link
          to="/electronics"
          state={{ currentCategory: "electronics" }}
          className="
            flex items-center gap-2
            bg-[#262626] hover:bg-[#003557] text-white
            text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full
            transition-colors duration-200
          "
        >
          View All Products
          <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}













// /* eslint-disable react-hooks/exhaustive-deps */

// import { useRef, useState, useEffect, useMemo } from "react";
// import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
// import { Link } from "react-router-dom";

// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product } from "@/types/product.type";

// const VISIBLE = 5;
// const GAP = 12;

// export default function ElectronicsFeaturedProducts() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

  
//   const electronicsProducts = useMemo(() => {
//     const allProducts = data?.data ?? [];

//     return allProducts.filter((p) => {
      
//       const isElectronics = p.category?.name?.toLowerCase().includes("electronics");

      
//       const isFeatured =
//         p.is_featured === true ||
//         p.is_featured === 1 ||
//         p.is_featured === "1";

//       return isElectronics && isFeatured;
//     });
//   }, [data]);

//   const getCardWidth = () => {
//     const el = scrollRef.current;
//     if (!el) return 170;
//     return (el.clientWidth - GAP * (VISIBLE - 1)) / VISIBLE;
//   };

//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
//   };

//   const scroll = (dir: "left" | "right") => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const cardWidth = getCardWidth();
//     el.scrollBy({
//       left: dir === "left" ? -(cardWidth + GAP) : cardWidth + GAP,
//       behavior: "smooth",
//     });
//     setTimeout(checkScroll, 350);
//   };

//   const autoScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
//     if (atEnd) {
//       el.scrollTo({ left: 0, behavior: "smooth" });
//     } else {
//       const cardWidth = getCardWidth();
//       el.scrollBy({ left: cardWidth + GAP, behavior: "smooth" });
//     }
//     setTimeout(checkScroll, 350);
//   };

//   const startAuto = () => {
//     if (autoRef.current) clearInterval(autoRef.current);
//     autoRef.current = setInterval(autoScroll, 3000);
//   };

//   const stopAuto = () => {
//     if (autoRef.current) clearInterval(autoRef.current);
//   };

//   useEffect(() => {
//     checkScroll();
//     if (electronicsProducts.length > 0) {
//       startAuto();
//     }
//     return () => stopAuto();
//   }, [electronicsProducts]);


//   if (isLoading) {
//     return (
//       <section className="py-8">
//         <h2 className="text-center text-4xl font-bold home-black-text mb-6">
//           Electronics Featured Products
//         </h2>
//         <div className="text-center text-gray-500 py-10 animate-pulse">
//           Loading electronics products...
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-8">
//       <h2 className="text-center text-4xl font-bold home-black-text mb-6">
//         Electronics Featured Products
//       </h2>

//       <div className="relative">
//         {canScrollLeft && (
//           <button
//             onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
//             className="
//               absolute left-4 top-[40%] -translate-y-1/2 z-10
//               w-8 h-8 rounded-full bg-white dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronLeft size={16} />
//           </button>
//         )}

//         <div
//           ref={scrollRef}
//           onScroll={checkScroll}
//           onMouseEnter={stopAuto}
//           onMouseLeave={startAuto}
//           className="flex gap-3 overflow-x-auto pb-2"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           {electronicsProducts.length === 0 ? (
//             <div className="w-full text-center py-10 text-gray-400">
//               No featured electronics products found.
//             </div>
//           ) : (
//             electronicsProducts.map((product: Product) => {
//               const variant = product.variants?.[0];
//               const price = Number(variant?.price ?? 0);
//               const salePrice = Number(variant?.sale_price ?? 0);
//               const hasDiscount = salePrice > 0 && salePrice < price;

//               const image =
//                 variant?.images?.[0]?.image_url ||
//                 product.thumbnail ||
//                 "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";

//               return (

//                 <Link
//                   key={product.id}
//                   to={`/products/${product.slug}`}
//                   state={{ currentCategory: "electronics" }}
//                   className="shrink-0 flex flex-col group hover:cursor-pointer"
//                   style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
//                 >
//                   {/* Image Box */}
//                   <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">

//                     {/* Image with zoom effect */}
//                     <img
//                       src={image}
//                       alt={product.name}
//                       className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-110"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
//                       }}
//                     />

//                     {/* Dark overlay on hover */}
//                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

//                     {/* Buy Now Button */}
//                     <div className="
//                       absolute bottom-2 left-1/2 -translate-x-1/2
//                       opacity-0 group-hover:opacity-100
//                       translate-y-2 group-hover:translate-y-0
//                       transition-all duration-300
//                     ">

//                       <span className="
//                         bg-white text-gray-900 text-xs font-bold
//                         px-4 py-1.5 rounded-full shadow-md
//                         hover:bg-gray-100 transition-colors whitespace-nowrap items-center gap-1 inline-block
//                       ">
//                         <ShoppingCart size={12} className="inline-block mr-1" />
//                         Buy Now
//                       </span>
//                     </div>
//                   </div>

//                   {/* Info */}
//                   <div className="mt-2 px-0.5">
//                     <p className="text-lg home-black-text font-medium truncate group-hover:text-[#003557] transition-colors duration-200">
//                       {product.name}
//                     </p>
//                     <div className="flex items-center gap-1.5 mt-1">
//                       <span className="text-sm font-bold home-black-text">
//                         ৳{(hasDiscount ? salePrice : price).toLocaleString()}
//                       </span>
//                       {hasDiscount && (
//                         <span className="text-xs home-red-text line-through">
//                           ৳{price.toLocaleString()}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })
//           )}
//         </div>

//         {canScrollRight && electronicsProducts.length > VISIBLE && (
//           <button
//             onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
//             className="
//               absolute right-4 top-[40%] -translate-y-1/2 z-10
//               w-8 h-8 rounded-full bg-white dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronRight size={16} />
//           </button>
//         )}
//       </div>

//       <div className="flex justify-center mt-6">
//         <Link
//           to="/electronics"
//           state={{ currentCategory: "electronics" }}
//           className="
//             flex items-center gap-2
//             bg-[#262626] hover:bg-[#003557] text-white
//             text-sm font-semibold px-6 py-2.5 rounded-full
//             transition-colors duration-200
//           "
//         >
//           View All Products
//           <ChevronRight size={16} />
//         </Link>
//       </div>
//     </section>
//   );
// }









// /* eslint-disable react-hooks/exhaustive-deps */

// import { useRef, useState, useEffect, useMemo } from "react";
// import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
// import { Link } from "react-router-dom";

// // 🎯 এপিআই এবং টাইপস ইম্পোর্ট করা হয়েছে
// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product } from "@/types/product.type";

// const VISIBLE = 5;
// const GAP = 12;

// export default function ElectronicsFeaturedProducts() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // 🎯 এপিআই থেকে ডেটা কল করা হয়েছে
//   const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

//   // 🎯 এখানে কন্ডিশন পরিবর্তন করে শুধুমাত্র Electronics এবং Featured প্রোডাক্ট ফিল্টার করা হয়েছে
//   const electronicsProducts = useMemo(() => {
//     const allProducts = data?.data ?? [];
//     return allProducts.filter(
//       (p) =>
//         p.category?.name?.toLowerCase().includes("electronics") &&
//         p.is_featured === "1" // 🎯 শুধুমাত্র ফিচার্ড প্রোডাক্ট চেক করার কন্ডিশন
//     );
//   }, [data]);

//   const getCardWidth = () => {
//     const el = scrollRef.current;
//     if (!el) return 170;
//     return (el.clientWidth - GAP * (VISIBLE - 1)) / VISIBLE;
//   };

//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
//   };

//   const scroll = (dir: "left" | "right") => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const cardWidth = getCardWidth();
//     el.scrollBy({
//       left: dir === "left" ? -(cardWidth + GAP) : cardWidth + GAP,
//       behavior: "smooth",
//     });
//     setTimeout(checkScroll, 350);
//   };

//   const autoScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
//     if (atEnd) {
//       el.scrollTo({ left: 0, behavior: "smooth" });
//     } else {
//       const cardWidth = getCardWidth();
//       el.scrollBy({ left: cardWidth + GAP, behavior: "smooth" });
//     }
//     setTimeout(checkScroll, 350);
//   };

//   const startAuto = () => {
//     if (autoRef.current) clearInterval(autoRef.current);
//     autoRef.current = setInterval(autoScroll, 3000);
//   };

//   const stopAuto = () => {
//     if (autoRef.current) clearInterval(autoRef.current);
//   };

//   useEffect(() => {
//     checkScroll();
//     if (electronicsProducts.length > 0) {
//       startAuto();
//     }
//     return () => stopAuto();
//   }, [electronicsProducts]);

//   // 🎯 লোডিং স্টেট হ্যান্ডেলিং
//   if (isLoading) {
//     return (
//       <section className="py-8">
//         <h2 className="text-center text-4xl font-bold home-black-text mb-6">
//           Electronics Featured Products
//         </h2>
//         <div className="text-center text-gray-500 py-10 animate-pulse">
//           Loading electronics products...
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-8">
//       <h2 className="text-center text-4xl font-bold home-black-text mb-6">
//         Electronics Featured Products
//       </h2>

//       <div className="relative">
//         {canScrollLeft && (
//           <button
//             onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
//             className="
//               absolute left-4 top-[40%] -translate-y-1/2 z-10
//               w-8 h-8 rounded-full bg-white dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronLeft size={16} />
//           </button>
//         )}

//         <div
//           ref={scrollRef}
//           onScroll={checkScroll}
//           onMouseEnter={stopAuto}
//           onMouseLeave={startAuto}
//           className="flex gap-3 overflow-x-auto pb-2"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           {electronicsProducts.length === 0 ? (
//             <div className="w-full text-center py-10 text-gray-400">
//               No featured electronics products found.
//             </div>
//           ) : (
//             electronicsProducts.map((product: Product) => {
//               const variant = product.variants?.[0];
//               const price = Number(variant?.price ?? 0);
//               const salePrice = Number(variant?.sale_price ?? 0);
//               const hasDiscount = salePrice > 0 && salePrice < price;

//               const image =
//                 variant?.images?.[0]?.image_url ||
//                 product.thumbnail ||
//                 "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";

//               return (
//                 <div
//                   key={product.id}
//                   className="shrink-0 flex flex-col"
//                   style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
//                 >
//                   {/* Image Box */}
//                   <div className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">

//                     {/* Image with zoom effect */}
//                     <img
//                       src={image}
//                       alt={product.name}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
//                       }}
//                     />

//                     {/* Dark overlay on hover */}
//                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

//                     {/* Buy Now Button */}
//                     <div className="
//                       absolute bottom-2 left-1/2 -translate-x-1/2
//                       opacity-0 group-hover:opacity-100
//                       translate-y-2 group-hover:translate-y-0
//                       transition-all duration-300
//                     ">
//                       <Link to={`/products/${product.slug}`} state={{ currentCategory: "electronics" }}>
//                         <button className="
//                           bg-white text-gray-900 text-xs font-bold
//                           px-4 py-1.5 rounded-full shadow-md
//                           hover:bg-gray-100 transition-colors whitespace-nowrap
//                           flex items-center gap-1 hover:cursor-pointer
//                         ">
//                           <ShoppingCart size={12} />
//                           Buy Now
//                         </button>
//                       </Link>
//                     </div>
//                   </div>

//                   {/* Info */}
//                   <div className="mt-2 px-0.5">
//                     <Link to={`/products/${product.slug}`} state={{ currentCategory: "electronics" }}>
//                       <p className="text-lg home-black-text font-medium truncate hover:text-[#003557] transition-colors">
//                         {product.name}
//                       </p>
//                     </Link>
//                     <div className="flex items-center gap-1.5 mt-1">
//                       <span className="text-sm font-bold home-black-text">
//                         ৳{(hasDiscount ? salePrice : price).toLocaleString()}
//                       </span>
//                       {hasDiscount && (
//                         <span className="text-xs home-red-text line-through">
//                           ৳{price.toLocaleString()}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {canScrollRight && electronicsProducts.length > VISIBLE && (
//           <button
//             onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
//             className="
//               absolute right-4 top-[40%] -translate-y-1/2 z-10
//               w-8 h-8 rounded-full bg-white dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronRight size={16} />
//           </button>
//         )}
//       </div>

//       <div className="flex justify-center mt-6">
//         <Link
//           to="/electronics"
//           state={{ currentCategory: "electronics" }}
//           className="
//             flex items-center gap-2
//             bg-[#262626] hover:bg-[#003557] text-white
//             text-sm font-semibold px-6 py-2.5 rounded-full
//             transition-colors duration-200
//           "
//         >
//           View All Products
//           <ChevronRight size={16} />
//         </Link>
//       </div>
//     </section>
//   );
// }








// /* eslint-disable react-hooks/exhaustive-deps */

// import { useRef, useState, useEffect, useMemo } from "react";
// import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
// import { Link } from "react-router-dom";

// // 🎯 এপিআই এবং টাইপস ইম্পোর্ট করা হয়েছে
// import { useGetProductsQuery } from "@/redux/services/product/product.api";
// import type { Product } from "@/types/product.type";

// const VISIBLE = 5;
// const GAP = 12;

// export default function ElectronicsFeaturedProducts() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // 🎯 এপিআই থেকে ডেটা কল করা হয়েছে
//   const { data, isLoading } = useGetProductsQuery({ per_page: 100 });

//   // 🎯 এপিআই ডেটা থেকে শুধুমাত্র 'electronics' ক্যাটাগরির প্রোডাক্টগুলো ফিল্টার করা হয়েছে
//   const electronicsProducts = useMemo(() => {
//     const allProducts = data?.data ?? [];
//     return allProducts.filter(
//       (p) => p.category?.name?.toLowerCase().includes("electronics")
//     );
//   }, [data]);

//   const getCardWidth = () => {
//     const el = scrollRef.current;
//     if (!el) return 170;
//     return (el.clientWidth - GAP * (VISIBLE - 1)) / VISIBLE;
//   };

//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
//   };

//   const scroll = (dir: "left" | "right") => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const cardWidth = getCardWidth();
//     el.scrollBy({
//       left: dir === "left" ? -(cardWidth + GAP) : cardWidth + GAP,
//       behavior: "smooth",
//     });
//     setTimeout(checkScroll, 350);
//   };

//   const autoScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
//     if (atEnd) {
//       el.scrollTo({ left: 0, behavior: "smooth" });
//     } else {
//       const cardWidth = getCardWidth();
//       el.scrollBy({ left: cardWidth + GAP, behavior: "smooth" });
//     }
//     setTimeout(checkScroll, 350);
//   };

//   const startAuto = () => {
//     if (autoRef.current) clearInterval(autoRef.current);
//     autoRef.current = setInterval(autoScroll, 3000);
//   };

//   const stopAuto = () => {
//     if (autoRef.current) clearInterval(autoRef.current);
//   };

//   useEffect(() => {
//     checkScroll();
//     if (electronicsProducts.length > 0) {
//       startAuto();
//     }
//     return () => stopAuto();
//   }, [electronicsProducts]);

//   // 🎯 লোডিং স্টেট হ্যান্ডেলিং
//   if (isLoading) {
//     return (
//       <section className="py-8">
//         <h2 className="text-center text-4xl font-bold home-black-text mb-6">
//           Electronics Featured Products
//         </h2>
//         <div className="text-center text-gray-500 py-10 animate-pulse">
//           Loading electronics products...
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-8">
//       <h2 className="text-center text-4xl font-bold home-black-text mb-6">
//         Electronics Featured Products
//       </h2>

//       <div className="relative">
//         {canScrollLeft && (
//           <button
//             onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
//             className="
//               absolute left-4 top-[40%] -translate-y-1/2 z-10
//               w-8 h-8 rounded-full bg-white dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronLeft size={16} />
//           </button>
//         )}

//         <div
//           ref={scrollRef}
//           onScroll={checkScroll}
//           onMouseEnter={stopAuto}
//           onMouseLeave={startAuto}
//           className="flex gap-3 overflow-x-auto pb-2"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           {electronicsProducts.length === 0 ? (
//             <div className="w-full text-center py-10 text-gray-400">
//               No electronics products found.
//             </div>
//           ) : (
//             electronicsProducts.map((product: Product) => {
//               // 🎯 এপিআই রেসপন্সের ভেরিয়েন্ট সেফ-গার্ড লজিক
//               const variant = product.variants?.[0];
//               const price = Number(variant?.price ?? 0);
//               const salePrice = Number(variant?.sale_price ?? 0);
//               const hasDiscount = salePrice > 0 && salePrice < price;

//               const image =
//                 variant?.images?.[0]?.image_url ||
//                 product.thumbnail ||
//                 "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";

//               return (
//                 <div
//                   key={product.id}
//                   className="shrink-0 flex flex-col"
//                   style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
//                 >
//                   {/* Image Box */}
//                   <div className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">

//                     {/* Image with zoom effect */}
//                     <img
//                       src={image}
//                       alt={product.name}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
//                       }}
//                     />

//                     {/* Dark overlay on hover */}
//                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

//                     {/* Buy Now Button */}
//                     <div className="
//                       absolute bottom-2 left-1/2 -translate-x-1/2
//                       opacity-0 group-hover:opacity-100
//                       translate-y-2 group-hover:translate-y-0
//                       transition-all duration-300
//                     ">
//                       {/* 🎯 ক্লিক করলে যেন ওই ইলেকট্রনিক্স প্রোডাক্টের ডিটেইলসে যায় */}
//                       <Link to={`/products/${product.slug}`} state={{ currentCategory: "electronics" }}>
//                         <button className="
//                           bg-white text-gray-900 text-xs font-bold
//                           px-4 py-1.5 rounded-full shadow-md
//                           hover:bg-gray-100 transition-colors whitespace-nowrap
//                           flex items-center gap-1 hover:cursor-pointer
//                         ">
//                           <ShoppingCart size={12} />
//                           Buy Now
//                         </button>
//                       </Link>
//                     </div>
//                   </div>

//                   {/* Info */}
//                   <div className="mt-2 px-0.5">
//                     {/* 🎯 টাইটেল ক্লিকেবল করতে এবং স্টেট ধরে রাখতে Link র‍্যাপ করা হয়েছে */}
//                     <Link to={`/products/${product.slug}`} state={{ currentCategory: "electronics" }}>
//                       <p className="text-lg home-black-text font-medium truncate hover:text-[#003557] transition-colors">
//                         {product.name}
//                       </p>
//                     </Link>
//                     <div className="flex items-center gap-1.5 mt-1">
//                       <span className="text-sm font-bold home-black-text">
//                         ৳{(hasDiscount ? salePrice : price).toLocaleString()}
//                       </span>
//                       {hasDiscount && (
//                         <span className="text-xs home-red-text line-through">
//                           ৳{price.toLocaleString()}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {canScrollRight && electronicsProducts.length > VISIBLE && (
//           <button
//             onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
//             className="
//               absolute right-4 top-[40%] -translate-y-1/2 z-10
//               w-8 h-8 rounded-full bg-white dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronRight size={16} />
//           </button>
//         )}
//       </div>

//       <div className="flex justify-center mt-6">
//         <Link
//           to="/electronics"
//           state={{ currentCategory: "electronics" }}
//           className="
//             flex items-center gap-2
//             bg-[#262626] hover:bg-[#003557] text-white
//             text-sm font-semibold px-6 py-2.5 rounded-full
//             transition-colors duration-200
//           "
//         >
//           View All Products
//           <ChevronRight size={16} />
//         </Link>
//       </div>
//     </section>
//   );
// }









// /* eslint-disable react-hooks/exhaustive-deps */

// import { useRef, useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
// import { Link } from "react-router-dom";

// interface Product {
//   id: number;
//   name: string;
//   image: string;
//   price: number;
//   oldPrice: number;
// }

// const electronicsProducts: Product[] = [
//   { id: 1, name: "MacBook Air M2", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822987/electronics1_qsb0fl.jpg", price: 120000, oldPrice: 150000 },
//   { id: 2, name: "Dell XPS 13", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822986/electronics2_lttaln.jpg", price: 95000, oldPrice: 110000 },
//   { id: 3, name: "HP Pavilion 15", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822987/electronics3_wil6or.jpg", price: 65000, oldPrice: 75000 },
//   { id: 4, name: "Lenovo ThinkPad", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822986/electronics4_rkswtm.jpg", price: 85000, oldPrice: 95000 },
//   { id: 5, name: "Asus ROG Strix", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822986/electronics7_j5zf50.jpg", price: 150000, oldPrice: 180000 },
//   { id: 6, name: "Acer Aspire 5", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822987/electronics5_pqf8it.jpg", price: 55000, oldPrice: 65000 },
//   { id: 7, name: "MSI Modern 14", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822986/electronics6_wv077a.jpg", price: 70000, oldPrice: 85000 },
// ];

// const VISIBLE = 5;
// const GAP = 12;

// export default function ElectronicsFeaturedProducts() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const getCardWidth = () => {
//     const el = scrollRef.current;
//     if (!el) return 170;
//     return (el.clientWidth - GAP * (VISIBLE - 1)) / VISIBLE;
//   };

//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
//   };

//   const scroll = (dir: "left" | "right") => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const cardWidth = getCardWidth();
//     el.scrollBy({
//       left: dir === "left" ? -(cardWidth + GAP) : cardWidth + GAP,
//       behavior: "smooth",
//     });
//     setTimeout(checkScroll, 350);
//   };

//   const autoScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
//     if (atEnd) {
//       el.scrollTo({ left: 0, behavior: "smooth" });
//     } else {
//       const cardWidth = getCardWidth();
//       el.scrollBy({ left: cardWidth + GAP, behavior: "smooth" });
//     }
//     setTimeout(checkScroll, 350);
//   };

//   const startAuto = () => {
//     if (autoRef.current) clearInterval(autoRef.current);
//     autoRef.current = setInterval(autoScroll, 3000);
//   };

//   const stopAuto = () => {
//     if (autoRef.current) clearInterval(autoRef.current);
//   };

//   useEffect(() => {
//     checkScroll();
//     startAuto();
//     return () => stopAuto();
//   }, []);

//   return (
//     <section className="py-8">
//       <h2 className="text-center text-4xl font-bold home-black-text mb-6">
//         Electronics Featured Products
//       </h2>

//       <div className="relative">
//         {canScrollLeft && (
//           <button
//             onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
//             className="
//               absolute left-4 top-[40%] -translate-y-1/2 z-10
//               w-8 h-8 rounded-full bg-white dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronLeft size={16} />
//           </button>
//         )}

//         <div
//           ref={scrollRef}
//           onScroll={checkScroll}
//           onMouseEnter={stopAuto}
//           onMouseLeave={startAuto}
//           className="flex gap-3 overflow-x-auto pb-2"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           {electronicsProducts.map((product) => (
//             <div
//               key={product.id}
//               className="shrink-0 flex flex-col"
//               style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
//             >
//               {/* Image Box */}
//               <div className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">

//                 {/* Image with zoom effect */}
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src =
//                       "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
//                   }}
//                 />

//                 {/* Dark overlay on hover */}
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

//                 {/* Buy Now Button */}
//                 <div className="
//                   absolute bottom-2 left-1/2 -translate-x-1/2
//                   opacity-0 group-hover:opacity-100
//                   translate-y-2 group-hover:translate-y-0
//                   transition-all duration-300
//                 ">
//                   <button className="
//                     bg-white text-gray-900 text-xs font-bold
//                     px-4 py-1.5 rounded-full shadow-md
//                     hover:bg-gray-100 transition-colors whitespace-nowrap
//                     flex items-center gap-1
//                   ">
//                     <ShoppingCart size={12} />
//                     Buy Now
//                   </button>
//                 </div>
//               </div>

//               {/* Info */}
//               <div className="mt-2 px-0.5">
//                 <p className="text-lg home-black-text font-medium truncate">
//                   {product.name}
//                 </p>
//                 <div className="flex items-center gap-1.5 mt-1">
//                   <span className="text-sm font-bold home-black-text">
//                     ৳{product.price.toLocaleString()}
//                   </span>
//                   <span className="text-xs home-red-text line-through">
//                     ৳{product.oldPrice.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {canScrollRight && (
//           <button
//             onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
//             className="
//               absolute right-4 top-[40%] -translate-y-1/2 z-10
//               w-8 h-8 rounded-full bg-white dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronRight size={16} />
//           </button>
//         )}
//       </div>

//       <div className="flex justify-center mt-6">
//         <Link
//           to="/electronics"
//           className="
//             flex items-center gap-2
//             bg-[#262626] hover:bg-[#003557] text-white
//             text-sm font-semibold px-6 py-2.5 rounded-full
//             transition-colors duration-200
//           "
//         >
//           View All Products
//           <ChevronRight size={16} />
//         </Link>
//       </div>
//     </section>
//   );
// }