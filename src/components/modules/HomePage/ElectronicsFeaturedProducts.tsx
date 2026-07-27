/* eslint-disable react-hooks/exhaustive-deps */

import { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
      currentVisible = 2; // Mobile
    } else if (window.innerWidth < 1024) {
      currentVisible = 3; // Tablet
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
      {/* 🎯 Header: Triggers animation when scrolled into view */}
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6"
      >
        Electronics Featured Products
      </motion.h2>

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
            electronicsProducts.map((product: Product, index: number) => {
              const variant = product.variants?.[0];
              const price = Number(variant?.price ?? 0);
              const salePrice = Number(variant?.sale_price ?? 0);
              const hasDiscount = salePrice > 0 && salePrice < price;

              const image =
                variant?.images?.[0]?.image_url ||
                product.thumbnail ||
                "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";

              return (
                /* 🎯 Product Card: Scroll-triggered staggered reveal */
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.5,
                    delay: (index % VISIBLE) * 0.1, // Stagger effect per visible card set
                    ease: "easeOut",
                  }}
                  className="shrink-0 w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
                >
                  <Link
                    to={`/products/${product.slug}`}
                    state={{ currentCategory: "electronics" }}
                    className="flex flex-col group hover:cursor-pointer w-full"
                  >
                    {/* Image Container */}
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
                        }}
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

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
                </motion.div>
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

      {/* 🎯 View All Button: Animated on scroll */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mt-4 sm:mt-6"
      >
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
      </motion.div>
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

//     let currentVisible = VISIBLE;
//     if (window.innerWidth < 640) {
//       currentVisible = 2; // Small devices (mobile)
//     } else if (window.innerWidth < 1024) {
//       currentVisible = 3; // Medium devices (tablet)
//     }

//     return (el.clientWidth - GAP * (currentVisible - 1)) / currentVisible;
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
//         <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-6">
//           Electronics Featured Products
//         </h2>
//         <div className="text-center text-gray-500 py-10 animate-pulse">
//           Loading electronics products...
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-6 sm:py-8">
//       <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6">
//         Electronics Featured Products
//       </h2>

//       <div className="relative">
//         {canScrollLeft && (
//           <button
//             onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
//             className="
//               absolute left-1 sm:left-2 lg:left-4 top-[40%] -translate-y-1/2 z-10
//               w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-700/90 lg:bg-white lg:dark:bg-slate-700
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
//                   className="shrink-0 flex flex-col group hover:cursor-pointer w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
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
//                         bg-white text-gray-900 text-[10px] sm:text-xs font-bold
//                         px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md
//                         hover:bg-gray-100 transition-colors whitespace-nowrap items-center gap-1 inline-block
//                       ">
//                         <ShoppingCart size={12} className="inline-block mr-1" />
//                         Buy Now
//                       </span>
//                     </div>
//                   </div>

//                   {/* Info */}
//                   <div className="mt-2 px-0.5">
//                     <p className="text-sm sm:text-base lg:text-lg home-black-text font-medium truncate group-hover:text-[#003557] transition-colors duration-200">
//                       {product.name}
//                     </p>
//                     <div className="flex items-center gap-1.5 mt-1">
//                       <span className="text-xs sm:text-sm font-bold home-black-text">
//                         ৳{(hasDiscount ? salePrice : price).toLocaleString()}
//                       </span>
//                       {hasDiscount && (
//                         <span className="text-[10px] sm:text-xs home-red-text line-through">
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
//               absolute right-1 sm:right-2 lg:right-4 top-[40%] -translate-y-1/2 z-10
//               w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-700/90 lg:bg-white lg:dark:bg-slate-700
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center shadow-md hover:cursor-pointer
//               text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
//             "
//           >
//             <ChevronRight size={16} />
//           </button>
//         )}
//       </div>

//       <div className="flex justify-center mt-4 sm:mt-6">
//         <Link
//           to="/electronics"
//           state={{ currentCategory: "electronics" }}
//           className="
//             flex items-center gap-2
//             bg-[#262626] hover:bg-[#003557] text-white
//             text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full
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


