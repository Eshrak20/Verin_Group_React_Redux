/* eslint-disable react-hooks/exhaustive-deps */
// src/components/ShopByCategory.tsx
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "@/redux/services/homepage/homePage.api";

const CARD_WIDTH = 280;
const GAP = 16; // gap-4 = 16px
const SCROLL_AMOUNT = CARD_WIDTH + GAP;

// fallback gradient (image না থাকলে)
const fallbackBgs = [
  "from-purple-500 to-purple-800",
  "from-blue-500 to-blue-800",
  "from-orange-500 to-orange-800",
  "from-green-500 to-green-800",
  "from-gray-500 to-gray-800",
  "from-yellow-500 to-yellow-800",
  "from-pink-500 to-pink-800",
  "from-red-500 to-red-800",
];

export default function ShopByCategory() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data, isLoading } = useGetCategoriesQuery();

  // API category কে UI structure এ map করা হচ্ছে — UI অপরিবর্তিত
  const categories =
    data?.status && data.data.length > 0
      ? data.data.map((cat, i) => ({
          id: cat.id,
          name: cat.name,
          image: cat.image_url,
          path: `/category/${cat.slug}`,
          bg: fallbackBgs[i % fallbackBgs.length],
        }))
      : [];

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  const autoScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
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
    startAuto();
    return () => stopAuto();
  }, [categories.length]);

  return (
    <section className="py-10 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white dark:text-white">
          Shop By Category
        </h2>
        <p className="text-sm text-white mt-1">
          Explore our curated collections.
        </p>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="flex gap-4 mx-auto"
          style={{ maxWidth: `${(CARD_WIDTH + GAP) * 4 - GAP}px` }}
        >
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="flex flex-col items-center"
              style={{ minWidth: CARD_WIDTH, width: CARD_WIDTH }}
            >
              <div className="w-full aspect-square rounded-2xl bg-gray-200 animate-pulse" />
              <div className="mt-3 h-3 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Slider Wrapper */}
      {!isLoading && categories.length > 0 && (
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
              className="
                absolute -left-4 top-1/2 -translate-y-1/2 z-10
                w-9 h-9 rounded-full bg-white dark:bg-slate-800
                border border-gray-200 dark:border-gray-600
                flex items-center justify-center
                shadow-md hover:shadow-lg transition-all duration-200
                text-gray-700 dark:text-white
              "
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            onMouseEnter={stopAuto}
            onMouseLeave={startAuto}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              maxWidth: `${(CARD_WIDTH + GAP) * 4 - GAP}px`,
              margin: "0 auto",
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center"
                style={{ minWidth: CARD_WIDTH, width: CARD_WIDTH }}
              >
                {/* Image Card — fixed size, UI অপরিবর্তিত */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden group border border-gray-100 dark:border-gray-700">
                  <div className={`w-full h-full bg-linear-to-br ${cat.bg}`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>

                  {/* Shop Now — hover এ দেখাবে (desktop) */}
                  <div className="
                    absolute bottom-4 left-1/2 -translate-x-1/2
                    opacity-0 group-hover:opacity-100
                    translate-y-2 group-hover:translate-y-0
                    transition-all duration-300 hidden md:block
                  ">
                    <Link
                      to={cat.path}
                      className="
                        bg-white text-gray-900 text-sm font-semibold
                        px-5 py-2 rounded-full shadow-lg
                        hover:bg-gray-100 transition-colors duration-200
                        whitespace-nowrap
                      "
                    >
                      Shop Now
                    </Link>
                  </div>

                  {/* Shop Now — mobile এ সবসময় দেখাবে */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
                    <Link
                      to={cat.path}
                      className="
                        bg-white text-gray-900 text-sm font-semibold
                        px-5 py-2 rounded-full shadow-lg whitespace-nowrap
                      "
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>

                {/* Name */}
                <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-white dark:text-gray-300">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
              className="
                absolute -right-4 top-1/2 -translate-y-1/2 z-10
                w-9 h-9 rounded-full bg-white dark:bg-slate-800
                border border-gray-200 dark:border-gray-600
                flex items-center justify-center
                shadow-md hover:shadow-lg transition-all duration-200
                text-gray-700 dark:text-white
              "
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}














// /* eslint-disable react-hooks/exhaustive-deps */
// // src/components/ShopByCategory.tsx
// import { useRef, useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

// const categories = [
//   {
//     id: 1,
//     name: "Decor",
//     image: "/categories/decor.jpg",
//     path: "/decor",
//     bg: "from-purple-500 to-purple-800",
//   },
//   {
//     id: 2,
//     name: "Logistics",
//     image: "/categories/logistics.jpg",
//     path: "/logistics",
//     bg: "from-blue-500 to-blue-800",
//   },
//   {
//     id: 3,
//     name: "Laptops",
//     image: "/categories/laptops.jpg",
//     path: "/laptops",
//     bg: "from-orange-500 to-orange-800",
//   },
//     {
//     id: 4,
//     name: "Smartphones",
//     image: "/categories/smartphones.jpg",
//     path: "/smartphones",
//     bg: "from-green-500 to-green-800",
//   },
//   {
//     id: 5,
//     name: "Accessories",
//     image: "/categories/accessories.jpg",
//     path: "/accessories",
//     bg: "from-gray-500 to-gray-800",
//   },
//   {
//     id: 6,
//     name: "Tablets",
//     image: "/categories/tablets.jpg",
//     path: "/tablets",
//     bg: "from-yellow-500 to-yellow-800",
//   },
//   {
//     id: 7,
//     name: "Headphones",
//     image: "/categories/headphones.jpg",
//     path: "/headphones",
//     bg: "from-pink-500 to-pink-800",
//   },
//   {
//     id: 8,
//     name: "Gaming",
//     image: "/categories/gaming.jpg",
//     path: "/gaming",
//     bg: "from-red-500 to-red-800",
//   }
// ];

// const CARD_WIDTH = 280; 
// const GAP = 16;         // gap-4 = 16px
// const SCROLL_AMOUNT = CARD_WIDTH + GAP;

// export default function ShopByCategory() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
//   };

//   const scroll = (dir: "left" | "right") => {
//     const el = scrollRef.current;
//     if (!el) return;
//     el.scrollBy({ left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: "smooth" });
//     setTimeout(checkScroll, 350);
//   };

//   const autoScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
//     if (atEnd) {
//       el.scrollTo({ left: 0, behavior: "smooth" });
//     } else {
//       el.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
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
//     <section className="py-10 px-4">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-4xl font-bold text-white dark:text-white">
//           Shop By Category
//         </h2>
//         <p className="text-sm text-white mt-1">
//           Explore our curated collections.
//         </p>
//       </div>

//       {/* Slider Wrapper */}
//       <div className="relative">
//         {/* Left Arrow */}
//         {canScrollLeft && (
//           <button
//             onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
//             className="
//               absolute -left-4 top-1/2 -translate-y-1/2 z-10
//               w-9 h-9 rounded-full bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center
//               shadow-md hover:shadow-lg transition-all duration-200
//               text-gray-700 dark:text-white
//             "
//           >
//             <ChevronLeft size={18} />
//           </button>
//         )}

//         <div
//           ref={scrollRef}
//           onScroll={checkScroll}
//           onMouseEnter={stopAuto}
//           onMouseLeave={startAuto}
//           className="flex gap-4 overflow-x-auto pb-2"
//           style={{
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//             maxWidth: `${(CARD_WIDTH + GAP) * 4 - GAP}px`,
//             margin: "0 auto",
//           }}
//         >
//           {categories.map((cat) => (
//             <div
//               key={cat.id}
//               className="flex flex-col items-center"
//               style={{ minWidth: CARD_WIDTH, width: CARD_WIDTH }}
//             >
//               {/* Image Card */}
//               <div className="relative w-full aspect-square rounded-2xl overflow-hidden group border border-gray-100 dark:border-gray-700">
//                 <div className={`w-full h-full bg-linear-to-br ${cat.bg}`}>
//                   <img
//                     src={cat.image}
//                     alt={cat.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).style.display = "none";
//                     }}
//                   />
//                 </div>

//                 {/* Shop Now — hover এ দেখাবে (desktop) */}
//                 <div className="
//                   absolute bottom-4 left-1/2 -translate-x-1/2
//                   opacity-0 group-hover:opacity-100
//                   translate-y-2 group-hover:translate-y-0
//                   transition-all duration-300 hidden md:block
//                 ">
//                   <Link
//                     to={cat.path}
//                     className="
//                       bg-white text-gray-900 text-sm font-semibold
//                       px-5 py-2 rounded-full shadow-lg
//                       hover:bg-gray-100 transition-colors duration-200
//                       whitespace-nowrap
//                     "
//                   >
//                     Shop Now
//                   </Link>
//                 </div>

//                 {/* Shop Now — mobile এ সবসময় দেখাবে */}
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
//                   <Link
//                     to={cat.path}
//                     className="
//                       bg-white text-gray-900 text-sm font-semibold
//                       px-5 py-2 rounded-full shadow-lg whitespace-nowrap
//                     "
//                   >
//                     Shop Now
//                   </Link>
//                 </div>
//               </div>

//               {/* Name */}
//               <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-white dark:text-gray-300">
//                 {cat.name}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Right Arrow */}
//         {canScrollRight && (
//           <button
//             onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
//             className="
//               absolute -right-4 top-1/2 -translate-y-1/2 z-10
//               w-9 h-9 rounded-full bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center
//               shadow-md hover:shadow-lg transition-all duration-200
//               text-gray-700 dark:text-white
//             "
//           >
//             <ChevronRight size={18} />
//           </button>
//         )}
//       </div>
//     </section>
//   );
// }







// // src/components/ShopByCategory.tsx
// import { useState, useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

// const categories = [
//   {
//     id: 1,
//     name: "Decor",
//     image: "/categories/decor.jpg",
//     path: "/decor",
//     bg: "from-purple-500 to-purple-800",
//   },
//   {
//     id: 2,
//     name: "Logistics",
//     image: "/categories/logistics.jpg",
//     path: "/logistics",
//     bg: "from-blue-500 to-blue-800",
//   },
//   {
//     id: 3,
//     name: "Laptops",
//     image: "/categories/laptops.jpg",
//     path: "/laptops",
//     bg: "from-orange-500 to-orange-800",
//   },
//   {
//     id: 4,
//     name: "Smartphones",
//     image: "/categories/smartphones.jpg",
//     path: "/smartphones",
//     bg: "from-green-500 to-green-800",
//   },
//   {
//     id: 5,
//     name: "Accessories",
//     image: "/categories/accessories.jpg",
//     path: "/accessories",
//     bg: "from-gray-500 to-gray-800",
//   },
//   {
//     id: 6,
//     name: "Tablets",
//     image: "/categories/tablets.jpg",
//     path: "/tablets",
//     bg: "from-yellow-500 to-yellow-800",
//   },
//   {
//     id: 7,
//     name: "Headphones",
//     image: "/categories/headphones.jpg",
//     path: "/headphones",
//     bg: "from-pink-500 to-pink-800",
//   },
//   {
//     id: 8,
//     name: "Gaming",
//     image: "/categories/gaming.jpg",
//     path: "/gaming",
//     bg: "from-red-500 to-red-800",
//   }
// ];

// export default function ShopByCategory() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);

//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
//   };

//   const scroll = (dir: "left" | "right") => {
//     const el = scrollRef.current;
//     if (!el) return;
//     el.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
//     setTimeout(checkScroll, 350);
//   };

//   return (
//     <section className="py-10 px-5">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//           Shop By Category
//         </h2>
//         <p className="text-sm text-blue-500 mt-1">
//           Explore our curated collections.
//         </p>
//       </div>

//       {/* Slider Wrapper */}
//       <div className="relative">
//         {/* Left Arrow */}
//         {canScrollLeft && (
//           <button
//             onClick={() => scroll("left")}
//             className="
//               absolute -left-4 top-1/2 -translate-y-1/2 z-10
//               w-9 h-9 rounded-full bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center
//               shadow-md hover:shadow-lg transition-all duration-200
//               text-gray-700 dark:text-white
//             "
//           >
//             <ChevronLeft size={18} />
//           </button>
//         )}

//         {/* Cards */}
//         <div
//           ref={scrollRef}
//           onScroll={checkScroll}
//           className="
//             flex gap-4 overflow-x-auto scroll-smooth
//             scrollbar-hide pb-2
//           "
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//         >
//           {categories.map((cat) => (
//             <div
//               key={cat.id}
//               className="shrink-0 w-64 md:w-72 flex flex-col items-center"
//             >
//               {/* Image Card */}
//               <div className="relative w-full aspect-square rounded-2xl overflow-hidden group border border-gray-100 dark:border-gray-700">
//                 {/* Image */}
//                 <div
//                   className={`w-full h-full bg-linear-to-br ${cat.bg}`}
//                 >
//                   <img
//                     src={cat.image}
//                     alt={cat.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).style.display = "none";
//                     }}
//                   />
//                 </div>

//                 {/* Shop Now Button — bottom center */}
//                 <div className="
//                   absolute bottom-4 left-1/2 -translate-x-1/2
//                   opacity-0 group-hover:opacity-100
//                   translate-y-2 group-hover:translate-y-0
//                   transition-all duration-300
//                 ">
//                   <Link
//                     to={cat.path}
//                     className="
//                       bg-white text-gray-900 text-sm font-semibold
//                       px-5 py-2 rounded-full shadow-lg
//                       hover:bg-gray-100 transition-colors duration-200
//                       whitespace-nowrap
//                     "
//                   >
//                     Shop Now
//                   </Link>
//                 </div>

//                 {/* Always visible Shop Now on mobile */}
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
//                   <Link
//                     to={cat.path}
//                     className="
//                       bg-white text-gray-900 text-sm font-semibold
//                       px-5 py-2 rounded-full shadow-lg
//                       whitespace-nowrap
//                     "
//                   >
//                     Shop Now
//                   </Link>
//                 </div>
//               </div>

//               {/* Category Name */}
//               <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-gray-700 dark:text-gray-300">
//                 {cat.name}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* Right Arrow */}
//         {canScrollRight && (
//           <button
//             onClick={() => scroll("right")}
//             className="
//               absolute -right-4 top-1/2 -translate-y-1/2 z-10
//               w-9 h-9 rounded-full bg-white dark:bg-slate-800
//               border border-gray-200 dark:border-gray-600
//               flex items-center justify-center
//               shadow-md hover:shadow-lg transition-all duration-200
//               text-gray-700 dark:text-white
//             "
//           >
//             <ChevronRight size={18} />
//           </button>
//         )}
//       </div>
//     </section>
//   );
// }