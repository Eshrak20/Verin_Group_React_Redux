/* eslint-disable react-hooks/exhaustive-deps */
// src/components/DecorFeaturedProducts.tsx
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer"; 
import { useGetProductsQuery } from "@/redux/services/product/product.api";

const VISIBLE = 5;
const GAP = 12;

export default function DecorFeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  // 🎯 Priority 2 Intersection Observer Setup
  const { ref: containerRef, inView } = useInView({
    triggerOnce: true, // একবার ভিউপোর্টে আসলেই ডাটা লোড হবে
    rootMargin: "300px", // স্ক্রিনে আসার ৩০০ পিক্সেল আগেই API কল শুরু হবে
  });

  // 🎯 skip: !inView -> ইউজার কাছাকাছি না আসা পর্যন্ত API Request অফ থাকবে
  const { data, isLoading } = useGetProductsQuery(
    {
      is_featured: 1,
      category_id: 1,
    },
    { skip: !inView }
  );

  const products = data?.data ?? [];

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
    if (products.length > 0) {
      startAuto();
    }
    return () => stopAuto();
  }, [products.length]);

  return (
    <section ref={containerRef} className="py-6 sm:py-8">
      {/* Skeleton / Initial Loading State */}
      {(!inView || isLoading) ? (
        <div className="py-2">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6">
            Decor Featured Products
          </h2>
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: VISIBLE }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 aspect-square rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Header with Scroll Animation */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6"
          >
            Decor Featured Products
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
              {products.length === 0 ? (
                <div className="w-full text-center py-10 text-gray-400">
                  No featured decor products found.
                </div>
              ) : (
                products.map((product, index) => {
                  const variant = product.variants?.[0];
                  const price = Number(variant?.sale_price ?? variant?.price ?? 0);
                  const oldPrice = Number(variant?.price ?? 0);
                  const image =
                    variant?.images?.[0]?.image_url ||
                    product.thumbnail ||
                    "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.08,
                        ease: "easeOut",
                      }}
                      onClick={() => navigate(`/products/${product.slug}`)}
                      className="shrink-0 flex flex-col hover:cursor-pointer group w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
                    >
                      {/* Image Box */}
                      <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
                        <img
                          src={image}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
                          }}
                        />

                        {/* Dark overlay */}
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
                            ৳{price.toLocaleString()}
                          </span>
                          {oldPrice > price && (
                            <span className="text-[10px] sm:text-xs home-red-text line-through">
                              ৳{oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {canScrollRight && products.length > VISIBLE && (
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

          {/* View All Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mt-4 sm:mt-6"
          >
            <Link
              to="/decor"
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
        </>
      )}
    </section>
  );
}










// /* eslint-disable react-hooks/exhaustive-deps */
// // src/components/DecorFeaturedProducts.tsx
// import { useRef, useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// const VISIBLE = 5;
// const GAP = 12;

// export default function DecorFeaturedProducts() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const navigate = useNavigate();

//   // Decor-এর ক্যাটাগরি আইডি ১ (category_id: 1)
//   const { data, isLoading } = useGetProductsQuery({
//     is_featured: 1,
//     category_id: 1, // Corrected category ID for Decor
//   });

//   const products = data?.data ?? [];

//   const getCardWidth = () => {
//     const el = scrollRef.current;
//     if (!el) return 170;
//     let currentVisible = VISIBLE;
//     if (window.innerWidth < 640) {
//       currentVisible = 2; // Mobile
//     } else if (window.innerWidth < 1024) {
//       currentVisible = 3; // Tablet
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
//     if (products.length > 0) {
//       startAuto();
//     }
//     return () => stopAuto();
//   }, [products.length]);

//   // Loading skeleton
//   if (isLoading) {
//     return (
//       <section className="py-8 max-w-6xl mx-auto">
//         <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
//           Decor Featured Products
//         </h2>
//         <div className="flex gap-3">
//           {Array.from({ length: VISIBLE }).map((_, i) => (
//             <div
//               key={i}
//               className="shrink-0 aspect-square rounded-xl bg-white/10 animate-pulse w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-6 sm:py-8">
//       {/* 🎯 Header with Scroll Animation */}
//       <motion.h2 
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6"
//       >
//         Decor Featured Products
//       </motion.h2>

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
//           {products.length === 0 ? (
//             <div className="w-full text-center py-10 text-gray-400">
//               No featured decor products found.
//             </div>
//           ) : (
//             products.map((product, index) => {
//               const variant = product.variants?.[0];
//               const price = Number(variant?.sale_price ?? variant?.price ?? 0);
//               const oldPrice = Number(variant?.price ?? 0);
//               const image =
//                 variant?.images?.[0]?.image_url ||
//                 product.thumbnail ||
//                 "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";

//               return (
//                 /* 🎯 Card Wrapper with Smooth Scroll Staggered Animation */
//                 <motion.div
//                   key={product.id}
//                   initial={{ opacity: 0, y: 40 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true, margin: "-50px" }}
//                   transition={{
//                     duration: 0.5,
//                     delay: index * 0.08,
//                     ease: "easeOut",
//                   }}
//                   onClick={() => navigate(`/products/${product.slug}`)}
//                   className="shrink-0 flex flex-col hover:cursor-pointer group w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
//                 >
//                   {/* Image Box */}
//                   <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
//                     <img
//                       src={image}
//                       alt={product.name}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
//                       }}
//                     />

//                     {/* Dark overlay */}
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
//                         ৳{price.toLocaleString()}
//                       </span>
//                       {oldPrice > price && (
//                         <span className="text-[10px] sm:text-xs home-red-text line-through">
//                           ৳{oldPrice.toLocaleString()}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })
//           )}
//         </div>

//         {canScrollRight && products.length > VISIBLE && (
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

//       {/* 🎯 View All Button with Scroll Animation */}
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="flex justify-center mt-4 sm:mt-6"
//       >
//         <Link
//           to="/decor"
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
//       </motion.div>
//     </section>
//   );
// }














// /* eslint-disable react-hooks/exhaustive-deps */
// // src/components/DecorFeaturedProducts.tsx
// import { useRef, useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion"; // 🎯 Framer Motion Import
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// const VISIBLE = 5;
// const GAP = 12;

// export default function DecorFeaturedProducts() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const navigate = useNavigate();

//   const { data, isLoading } = useGetProductsQuery({
//     is_featured: 1,
//     category_id: 5, // Decor category id
//   });

//   const products = data?.data ?? [];

//   const getCardWidth = () => {
//     const el = scrollRef.current;
//     if (!el) return 170;
//     let currentVisible = VISIBLE;
//     if (window.innerWidth < 640) {
//       currentVisible = 2; // Mobile
//     } else if (window.innerWidth < 1024) {
//       currentVisible = 3; // Tablet
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
//     startAuto();
//     return () => stopAuto();
//   }, [products.length]);

//   // Loading skeleton
//   if (isLoading) {
//     return (
//       <section className="py-8 max-w-6xl mx-auto">
//         <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
//           Decor Featured Products
//         </h2>
//         <div className="flex gap-3">
//           {Array.from({ length: VISIBLE }).map((_, i) => (
//             <div
//               key={i}
//               className="shrink-0 aspect-square rounded-xl bg-white/10 animate-pulse w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-6 sm:py-8">
//       {/* 🎯 Header with Scroll Animation */}
//       <motion.h2 
//         initial={{ opacity: 0, y: 30 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6"
//       >
//         Decor Featured Products
//       </motion.h2>

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
//           {products.map((product, index) => {
//             const variant = product.variants[0];
//             const image = variant?.images[0]?.image_url ?? "";
//             const price = Number(variant?.sale_price ?? variant?.price ?? 0);
//             const oldPrice = Number(variant?.price ?? 0);

//             return (
//               /* 🎯 Card Wrapper with Smooth Scroll Staggered Animation */
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-50px" }}
//                 transition={{
//                   duration: 0.5,
//                   delay: index * 0.08, // একের পর এক কার্ডগুলো নিচ থেকে ভেসে উঠবে
//                   ease: "easeOut",
//                 }}
//                 onClick={() => navigate(`/products/${product.slug}`)}
//                 className="shrink-0 flex flex-col hover:cursor-pointer group w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
//               >
//                 {/* Image Box */}
//                 <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
//                   <img
//                     src={image}
//                     alt={product.name}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src =
//                         "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
//                     }}
//                   />

//                   {/* Dark overlay */}
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

//                   {/* Buy Now Button */}
//                   <div className="
//                     absolute bottom-2 left-1/2 -translate-x-1/2
//                     opacity-0 group-hover:opacity-100
//                     translate-y-2 group-hover:translate-y-0
//                     transition-all duration-300
//                   ">
//                     <span className="
//                       bg-white text-gray-900 text-[10px] sm:text-xs font-bold
//                       px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md
//                       hover:bg-gray-100 transition-colors whitespace-nowrap items-center gap-1 inline-block
//                     ">
//                       <ShoppingCart size={12} className="inline-block mr-1" />
//                       Buy Now
//                     </span>
//                   </div>
//                 </div>

//                 {/* Info */}
//                 <div className="mt-2 px-0.5">
//                   <p className="text-sm sm:text-base lg:text-lg home-black-text font-medium truncate group-hover:text-[#003557] transition-colors duration-200">
//                     {product.name}
//                   </p>
//                   <div className="flex items-center gap-1.5 mt-1">
//                     <span className="text-xs sm:text-sm font-bold home-black-text">
//                       ৳{price.toLocaleString()}
//                     </span>
//                     {oldPrice > price && (
//                       <span className="text-[10px] sm:text-xs home-red-text line-through">
//                         ৳{oldPrice.toLocaleString()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>

//         {canScrollRight && (
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

//       {/* 🎯 View All Button with Scroll Animation */}
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="flex justify-center mt-4 sm:mt-6"
//       >
//         <Link
//           to="/decor"
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
//       </motion.div>
//     </section>
//   );
// }










// /* eslint-disable react-hooks/exhaustive-deps */
// // src/components/DecorFeaturedProducts.tsx
// import { useRef, useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useGetProductsQuery } from "@/redux/services/product/product.api";

// const VISIBLE = 5;
// const GAP = 12;

// export default function DecorFeaturedProducts() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const navigate = useNavigate();

//   const { data, isLoading } = useGetProductsQuery({
//     is_featured: 1,
//     category_id: 5, // Decor category id
//   });

//   const products = data?.data ?? [];

//   const getCardWidth = () => {
//     const el = scrollRef.current;
//     if (!el) return 170;
//     // Determine visible items based on current screen width dynamically for scroll calculation
//     let currentVisible = VISIBLE;
//     if (window.innerWidth < 640) {
//       currentVisible = 2; // Mobile
//     } else if (window.innerWidth < 1024) {
//       currentVisible = 3; // Tablet
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
//     startAuto();
//     return () => stopAuto();
//   }, [products.length]);

//   // Loading skeleton
//   if (isLoading) {
//     return (
//       <section className="py-8 max-w-6xl mx-auto">
//         <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
//           Decor Featured Products
//         </h2>
//         <div className="flex gap-3">
//           {Array.from({ length: VISIBLE }).map((_, i) => (
//             <div
//               key={i}
//               className="shrink-0 aspect-square rounded-xl bg-white/10 animate-pulse w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-6 sm:py-8">
//       <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold home-black-text mb-4 sm:mb-6">
//         Decor Featured Products
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
//           {products.map((product) => {
//             const variant = product.variants[0];
//             const image = variant?.images[0]?.image_url ?? "";
//             const price = Number(variant?.sale_price ?? variant?.price ?? 0);
//             const oldPrice = Number(variant?.price ?? 0);

//             return (
//               <div
//                 key={product.id}
//                 onClick={() => navigate(`/products/${product.slug}`)}
//                 className="shrink-0 flex flex-col hover:cursor-pointer group w-[calc((100%-12px)/2)] sm:w-[calc((100%-24px)/3)] lg:w-[calc((100%-48px)/5)]"
//               >
//                 {/* Image Box */}
//                 <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
//                   <img
//                     src={image}
//                     alt={product.name}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src =
//                         "https://placehold.co/170x170/e2e8f0/94a3b8?text=No+Image";
//                     }}
//                   />

//                   {/* Dark overlay */}
//                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

//                   {/* Buy Now Button */}
//                   <div className="
//                     absolute bottom-2 left-1/2 -translate-x-1/2
//                     opacity-0 group-hover:opacity-100
//                     translate-y-2 group-hover:translate-y-0
//                     transition-all duration-300
//                   ">
//                     <span className="
//                       bg-white text-gray-900 text-[10px] sm:text-xs font-bold
//                       px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md
//                       hover:bg-gray-100 transition-colors whitespace-nowrap items-center gap-1 inline-block
//                     ">
//                       <ShoppingCart size={12} className="inline-block mr-1" />
//                       Buy Now
//                     </span>
//                   </div>
//                 </div>

//                 {/* Info */}
//                 <div className="mt-2 px-0.5">
//                   <p className="text-sm sm:text-base lg:text-lg home-black-text font-medium truncate group-hover:text-[#003557] transition-colors duration-200">
//                     {product.name}
//                   </p>
//                   <div className="flex items-center gap-1.5 mt-1">
//                     <span className="text-xs sm:text-sm font-bold home-black-text">
//                       ৳{price.toLocaleString()}
//                     </span>
//                     {oldPrice > price && (
//                       <span className="text-[10px] sm:text-xs home-red-text line-through">
//                         ৳{oldPrice.toLocaleString()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {canScrollRight && (
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
//           to="/decor"
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

