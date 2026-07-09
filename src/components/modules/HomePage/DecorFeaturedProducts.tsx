/* eslint-disable react-hooks/exhaustive-deps */
// src/components/DecorFeaturedProducts.tsx
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "@/redux/services/product/product.api";

const VISIBLE = 5;
const GAP = 12;

export default function DecorFeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  const { data, isLoading } = useGetProductsQuery({
    is_featured: 1,
    category_id: 5, // Decor category id
  });

  const products = data?.data ?? [];

  const getCardWidth = () => {
    const el = scrollRef.current;
    if (!el) return 170;
    return (el.clientWidth - GAP * (VISIBLE - 1)) / VISIBLE;
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
    startAuto();
    return () => stopAuto();
  }, [products.length]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className=" py-8 max-w-6xl mx-auto">
        <h2 className="text-center text-4xl font-bold text-white mb-6">
          Decor Featured Products
        </h2>
        <div className="flex gap-3">
          {Array.from({ length: VISIBLE }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 aspect-square rounded-xl bg-white/10 animate-pulse"
              style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className=" py-8 ">
      <h2 className="text-center text-4xl font-bold home-black-text mb-6">
        Decor Featured Products
      </h2>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
            className="
              absolute left-4 top-[40%] -translate-y-1/2 z-10
              w-8 h-8 rounded-full bg-white dark:bg-slate-700
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
          {products.map((product) => {
            const variant = product.variants[0];
            const image = variant?.images[0]?.image_url ?? "";
            const price = Number(variant?.sale_price ?? variant?.price ?? 0);
            const oldPrice = Number(variant?.price ?? 0);

            return (
              /* 🎯 পুরো কার্ডটিকে ক্লিকে নেভিগেট করার জন্য wrapper div-এ onClick হ্যান্ডলার ও hover ইফেক্ট দেওয়া হয়েছে */
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.slug}`)}
                className="shrink-0 flex flex-col hover:cursor-pointer group"
                style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
              >
                {/* Image Box */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
                  <img
                    src={image}
                    alt={product.name}
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
                    {/* 🎯 এখানে এক্সট্রা onClick বা লজিক চেঞ্জের প্রয়োজন নেই, বাটন ডিজাইন ঠিক রাখা হয়েছে */}
                    <span className="
                      bg-white text-gray-900 text-xs font-bold
                      px-4 py-1.5 rounded-full shadow-md
                      hover:bg-gray-100 transition-colors whitespace-nowrap items-center gap-1 inline-block
                    ">
                      <ShoppingCart size={12} className="inline-block" />
                      Buy Now
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-2 px-0.5">
                  <p className="text-lg home-black-text font-medium truncate group-hover:text-[#003557] transition-colors duration-200">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-bold home-black-text">
                      ৳{price.toLocaleString()}
                    </span>
                    {oldPrice > price && (
                      <span className="text-xs home-red-text line-through">
                        ৳{oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
            className="
              absolute right-4 top-[40%] -translate-y-1/2 z-10
              w-8 h-8 rounded-full bg-white dark:bg-slate-700
              border border-gray-200 dark:border-gray-600
              flex items-center justify-center shadow-md hover:cursor-pointer
              text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
            "
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to="/decor"
          className="
            flex items-center gap-2
            bg-[#262626] hover:bg-[#003557] text-white
            text-sm font-semibold px-6 py-2.5 rounded-full
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
//   }, [products.length]);

//   // Loading skeleton
//   if (isLoading) {
//     return (
//       <section className=" py-8 max-w-6xl mx-auto">
//         <h2 className="text-center text-4xl font-bold text-white mb-6">
//           Decor Featured Products
//         </h2>
//         <div className="flex gap-3">
//           {Array.from({ length: VISIBLE }).map((_, i) => (
//             <div
//               key={i}
//               className="shrink-0 aspect-square rounded-xl bg-white/10 animate-pulse"
//               style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className=" py-8 ">
//       <h2 className="text-center text-4xl font-bold home-black-text mb-6">
//         Decor Featured Products
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
//           {products.map((product) => {
//             const variant = product.variants[0];
//             const image = variant?.images[0]?.image_url ?? "";
//             const price = Number(variant?.sale_price ?? variant?.price ?? 0);
//             const oldPrice = Number(variant?.price ?? 0);

//             return (
//               <div
//                 key={product.id}
//                 className="shrink-0 flex flex-col"
//                 style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
//               >
//                 {/* Image Box */}
//                 <div className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">
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
//                     <button
//                       onClick={() => navigate(`/products/${product.slug}`)}
//                       className="
//                         bg-white text-gray-900 text-xs font-bold
//                         px-4 py-1.5 rounded-full shadow-md
//                         hover:bg-gray-100 transition-colors whitespace-nowrap
//                         flex items-center gap-1 hover:cursor-pointer
//                       "
//                     >
//                       <ShoppingCart size={12} />
//                       Buy Now
//                     </button>
//                   </div>
//                 </div>

//                 {/* Info */}
//                 <div className="mt-2 px-0.5">
//                   <p className="text-lg home-black-text font-medium truncate">
//                     {product.name}
//                   </p>
//                   <div className="flex items-center gap-1.5 mt-1">
//                     <span className="text-sm font-bold home-black-text">
//                       ৳{price.toLocaleString()}
//                     </span>
//                     {oldPrice > price && (
//                       <span className="text-xs home-red-text line-through">
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
//           to="/decor"
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










