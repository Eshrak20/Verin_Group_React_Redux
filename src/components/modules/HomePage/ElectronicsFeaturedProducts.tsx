/* eslint-disable react-hooks/exhaustive-deps */

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice: number;
}

const electronicsProducts: Product[] = [
  { id: 1, name: "MacBook Air M2", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822987/electronics1_qsb0fl.jpg", price: 120000, oldPrice: 150000 },
  { id: 2, name: "Dell XPS 13", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822986/electronics2_lttaln.jpg", price: 95000, oldPrice: 110000 },
  { id: 3, name: "HP Pavilion 15", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822987/electronics3_wil6or.jpg", price: 65000, oldPrice: 75000 },
  { id: 4, name: "Lenovo ThinkPad", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822986/electronics4_rkswtm.jpg", price: 85000, oldPrice: 95000 },
  { id: 5, name: "Asus ROG Strix", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822986/electronics7_j5zf50.jpg", price: 150000, oldPrice: 180000 },
  { id: 6, name: "Acer Aspire 5", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822987/electronics5_pqf8it.jpg", price: 55000, oldPrice: 65000 },
  { id: 7, name: "MSI Modern 14", image: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782822986/electronics6_wv077a.jpg", price: 70000, oldPrice: 85000 },
];

const VISIBLE = 5;
const GAP = 12;

export default function ElectronicsFeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
  }, []);

  return (
    <section className="px-6 py-8 max-w-6xl mx-auto">
      <h2 className="text-center text-4xl font-bold text-white dark:text-white mb-6">
        Electronics Featured Products
      </h2>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
            className="
              absolute -left-4 top-[40%] -translate-y-1/2 z-10
              w-8 h-8 rounded-full bg-white dark:bg-slate-700
              border border-gray-200 dark:border-gray-600
              flex items-center justify-center shadow-md
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
          {electronicsProducts.map((product) => (
            <div
              key={product.id}
              className="shrink-0 flex flex-col"
              style={{ width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
            >
              {/* Image Box */}
              <div className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 aspect-square">

                {/* Image with zoom effect */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                  <button className="
                    bg-white text-gray-900 text-xs font-bold
                    px-4 py-1.5 rounded-full shadow-md
                    hover:bg-gray-100 transition-colors whitespace-nowrap
                    flex items-center gap-1
                  ">
                    <ShoppingCart size={12} />
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="mt-2 px-0.5">
                <p className="text-xs text-white dark:text-gray-300 font-medium truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-sm font-bold text-white dark:text-white">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-white line-through">
                    ৳{product.oldPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
            className="
              absolute -right-4 top-[40%] -translate-y-1/2 z-10
              w-8 h-8 rounded-full bg-white dark:bg-slate-700
              border border-gray-200 dark:border-gray-600
              flex items-center justify-center shadow-md
              text-gray-700 dark:text-white hover:shadow-lg transition-all duration-200
            "
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          to="/electronics"
          className="
            flex items-center gap-2
            bg-[#00416A] hover:bg-[#003557] text-white
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