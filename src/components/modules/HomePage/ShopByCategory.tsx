

/* eslint-disable react-hooks/exhaustive-deps */
// src/components/ShopByCategory.tsx
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "@/redux/services/homepage/homePage.api";

const CARD_WIDTH = 276;
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

  // const categories =
  //   data?.status && data.data.length > 0
  //     ? data.data.map((cat, i) => ({
  //         id: cat.id,
  //         name: cat.name,
  //         image: cat.image_url,
  //         // path: `/category/${cat.slug}`,
  //         path: `/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`, 
  //         bg: fallbackBgs[i % fallbackBgs.length],
  //       }))
  //     : [];
  const categories =
  data?.status && data.data.length > 0
    ? data.data.map((cat, i) => {
        const cleanSlug = cat.slug.replace("verin_", ""); 
        
        return {
          id: cat.id,
          name: cat.name,
          image: cat.image_url,
          path: `/${cleanSlug}`, 
          bg: fallbackBgs[i % fallbackBgs.length],
        };
      })
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
    <section className="py-10 home-black-text">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold home-black-text">
          Shop By Category
        </h2>
        <p className="text-sm home-black-text mt-1">
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
                absolute left-4 top-1/2 -translate-y-1/2 z-10
                w-9 h-9 rounded-full bg-white dark:bg-slate-800
                border border-gray-200 dark:border-gray-600
                flex items-center justify-center hover:cursor-pointer
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
              maxWidth: "full",
              margin: "0 auto",
            }}
          >
            {categories.map((cat) => (
              /* 🎯 পুরো কার্ড এলিমেন্টটিকে একটি একক Link ট্যাগ দিয়ে মুড়িয়ে দেওয়া হয়েছে */
              <Link
                key={cat.id}
                to={cat.path}
                className="flex flex-col items-center hover:cursor-pointer group"
                style={{ minWidth: CARD_WIDTH, width: CARD_WIDTH }}
              >
                {/* Image Card — fixed size, UI অপরিবর্তিত */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className={`w-full h-full bg-linear-to-br ${cat.bg}`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    z-10
                  ">
                    <span className="
                      bg-white text-gray-900 text-sm font-semibold
                      px-5 py-2 rounded-full shadow-lg
                      hover:bg-gray-100 transition-colors duration-200
                      whitespace-nowrap inline-block
                    ">
                      Shop Now
                    </span>
                  </div>

                  {/* Shop Now — mobile এ সবসময় দেখাবে */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden z-10">
                    <span className="
                      bg-white text-gray-900 text-sm font-semibold
                      px-5 py-2 rounded-full shadow-lg whitespace-nowrap inline-block
                    ">
                      Shop Now
                    </span>
                  </div>
                </div>

                {/* Name */}
                <p className="mt-3 text-sm font-semibold uppercase tracking-widest home-black-text group-hover:text-[#003557] transition-colors duration-200">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
              className="
                absolute right-4 top-1/2 -translate-y-1/2 z-10
                w-9 h-9 rounded-full bg-white dark:bg-slate-800
                border border-gray-200 dark:border-gray-600
                flex items-center justify-center hover:cursor-pointer
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
// import { useGetCategoriesQuery } from "@/redux/services/homepage/homePage.api";

// const CARD_WIDTH = 280;
// const GAP = 16; // gap-4 = 16px
// const SCROLL_AMOUNT = CARD_WIDTH + GAP;

// // fallback gradient (image না থাকলে)
// const fallbackBgs = [
//   "from-purple-500 to-purple-800",
//   "from-blue-500 to-blue-800",
//   "from-orange-500 to-orange-800",
//   "from-green-500 to-green-800",
//   "from-gray-500 to-gray-800",
//   "from-yellow-500 to-yellow-800",
//   "from-pink-500 to-pink-800",
//   "from-red-500 to-red-800",
// ];

// export default function ShopByCategory() {
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);
//   const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const { data, isLoading } = useGetCategoriesQuery();

 
//   const categories =
//     data?.status && data.data.length > 0
//       ? data.data.map((cat, i) => ({
//           id: cat.id,
//           name: cat.name,
//           image: cat.image_url,
//           path: `/category/${cat.slug}`,
//           bg: fallbackBgs[i % fallbackBgs.length],
//         }))
//       : [];

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
//   }, [categories.length]);

//   return (
//     <section className="py-10 home-black-text">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-4xl font-bold home-black-text">
//           Shop By Category
//         </h2>
//         <p className="text-sm home-black-text mt-1">
//           Explore our curated collections.
//         </p>
//       </div>

//       {/* Loading skeleton */}
//       {isLoading && (
//         <div
//           className="flex gap-4 mx-auto"
//           style={{ maxWidth: `${(CARD_WIDTH + GAP) * 4 - GAP}px` }}
//         >
//           {[1, 2, 3, 4].map((n) => (
//             <div
//               key={n}
//               className="flex flex-col items-center"
//               style={{ minWidth: CARD_WIDTH, width: CARD_WIDTH }}
//             >
//               <div className="w-full aspect-square rounded-2xl bg-gray-200 animate-pulse" />
//               <div className="mt-3 h-3 w-20 rounded bg-gray-200 animate-pulse" />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Slider Wrapper */}
//       {!isLoading && categories.length > 0 && (
//         <div className="relative">
//           {/* Left Arrow */}
//           {canScrollLeft && (
//             <button
//               onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
//               className="
//                 absolute left-4 top-1/2 -translate-y-1/2 z-10
//                 w-9 h-9 rounded-full bg-white dark:bg-slate-800
//                 border border-gray-200 dark:border-gray-600
//                 flex items-center justify-center hover:cursor-pointer
//                 shadow-md hover:shadow-lg transition-all duration-200
//                 text-gray-700 dark:text-white
//               "
//             >
//               <ChevronLeft size={18} />
//             </button>
//           )}

//           <div
//             ref={scrollRef}
//             onScroll={checkScroll}
//             onMouseEnter={stopAuto}
//             onMouseLeave={startAuto}
//             className="flex gap-4 overflow-x-auto pb-2"
//             style={{
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//               maxWidth: "full",
//               margin: "0 auto",
//             }}
//           >
//             {categories.map((cat) => (
//               <div
//                 key={cat.id}
//                 className="flex flex-col items-center"
//                 style={{ minWidth: CARD_WIDTH, width: CARD_WIDTH }}
//               >
//                 {/* Image Card — fixed size, UI অপরিবর্তিত */}
//                 <div className="relative w-full aspect-square rounded-2xl overflow-hidden group border border-gray-100 dark:border-gray-700">
//                   <div className={`w-full h-full bg-linear-to-br ${cat.bg}`}>
//                     <img
//                       src={cat.image}
//                       alt={cat.name}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).style.display = "none";
//                       }}
//                     />
//                   </div>

//                   {/* Shop Now — hover এ দেখাবে (desktop) */}
//                   <div className="
//                     absolute bottom-4 left-1/2 -translate-x-1/2
//                     opacity-0 group-hover:opacity-100
//                     translate-y-2 group-hover:translate-y-0
//                     transition-all duration-300 hidden md:block
//                   ">
//                     <Link
//                       to={cat.path}
//                       className="
//                         bg-white text-gray-900 text-sm font-semibold
//                         px-5 py-2 rounded-full shadow-lg
//                         hover:bg-gray-100 transition-colors duration-200
//                         whitespace-nowrap
//                       "
//                     >
//                       Shop Now
//                     </Link>
//                   </div>

//                   {/* Shop Now — mobile এ সবসময় দেখাবে */}
//                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:hidden">
//                     <Link
//                       to={cat.path}
//                       className="
//                         bg-white text-gray-900 text-sm font-semibold
//                         px-5 py-2 rounded-full shadow-lg whitespace-nowrap
//                       "
//                     >
//                       Shop Now
//                     </Link>
//                   </div>
//                 </div>

//                 {/* Name */}
//                 <p className="mt-3 text-sm font-semibold uppercase tracking-widest home-black-text">
//                   {cat.name}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Right Arrow */}
//           {canScrollRight && (
//             <button
//               onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
//               className="
//                 absolute right-4 top-1/2 -translate-y-1/2 z-10
//                 w-9 h-9 rounded-full bg-white dark:bg-slate-800
//                 border border-gray-200 dark:border-gray-600
//                 flex items-center justify-center hover:cursor-pointer
//                 shadow-md hover:shadow-lg transition-all duration-200
//                 text-gray-700 dark:text-white
//               "
//             >
//               <ChevronRight size={18} />
//             </button>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }







