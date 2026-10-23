/* eslint-disable react-hooks/exhaustive-deps */
import { useGetClientQuery } from "@/redux/services/homepage/homePage.api";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer"; // 🎯 Lazy Fetching
import { Link } from "react-router";

interface Client {
  id: number;
  name: string;
  logo: string;
  is_active: number | string;
  sort_order: number | string;
  created_at: string;
  updated_at: string;
  image_url: string;
}

const VISIBLE = 8;
const GAP = 16;

export default function OurClients() {
  // 🎯 Lazy Fetching Observer Setup
  const { ref: containerRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: "300px",
  });

  // 🎯 skip: !inView দিয়ে API Call ডিলে করা হয়েছে
  const { data, isLoading, isError } = useGetClientQuery({}, { skip: !inView });

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rawClients: Client[] = data?.data ?? [];
  const clients = rawClients
    .filter((client) => Number(client.is_active) === 1)
    .sort((a, b) => Number(a.sort_order) - Number(b.sort_order));

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const getCardWidth = () => {
    const el = scrollRef.current;
    if (!el) return 100;

    let currentVisible = VISIBLE;
    if (window.innerWidth < 640) {
      currentVisible = 3; // Mobile
    } else if (window.innerWidth < 1024) {
      currentVisible = 5; // Tablet
    }

    return (el.clientWidth - GAP * (currentVisible - 1)) / currentVisible;
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = getCardWidth();
    el.scrollBy({
      left: dir === "left" ? -(cardWidth + GAP) * 2 : (cardWidth + GAP) * 2,
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
    if (clients.length > 0) {
      autoRef.current = setInterval(autoScroll, 2500);
    }
  };

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  useEffect(() => {
    checkScroll();
    startAuto();
    return () => stopAuto();
  }, [clients]);

  if (!inView || isLoading) {
    return (
      <section ref={containerRef} className="pb-8 sm:pb-10 lg:pb-12 pt-4 sm:pt-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 mx-auto rounded animate-pulse" />
          <div className="w-12 h-0.5 bg-gray-300 mx-auto mt-2" />
        </div>
        <div className="flex gap-4 overflow-hidden pb-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="shrink-0 aspect-square rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse w-[calc((100%-32px)/3)] sm:w-[calc((100%-64px)/5)] lg:w-[calc((100%-144px)/8)]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError || clients.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="pb-8 sm:pb-10 lg:pb-12 pt-4 sm:pt-6 max-w-6xl mx-auto w-full">
      {/* Slider */}
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => {
              stopAuto();
              scroll("left");
              startAuto();
            }}
            className="
              absolute left-1 sm:left-2 top-[42%] -translate-y-1/2 z-10
              w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-700/90 lg:bg-white lg:dark:bg-slate-700
              border border-gray-200 dark:border-gray-600
              flex items-center justify-center shadow-md hover:cursor-pointer
              text-gray-600 dark:text-white hover:shadow-lg transition-all duration-200
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
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.4,
                delay: (index % VISIBLE) * 0.05,
                ease: "easeOut",
              }}
              className="shrink-0 flex flex-col items-center gap-2 group cursor-pointer w-[calc((100%-32px)/3)] sm:w-[calc((100%-64px)/5)] lg:w-[calc((100%-144px)/8)]"
            >
              {/* Logo box */}
              <div
                className="
                  w-full aspect-square rounded-xl
                  border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-slate-800
                  flex items-center justify-center
                  overflow-hidden p-2
                  transition-all duration-300
                  group-hover:border-blue-400 group-hover:shadow-md
                "
              >
                <img
                  src={client.image_url}
                  alt={client.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-xs font-semibold text-gray-400 dark:text-gray-500 text-center px-1">${client.name}</span>`;
                    }
                  }}
                />
              </div>
              {/* Name */}
              <p className="text-xs home-black-text dark:text-gray-300 text-center font-medium truncate w-full">
                {client.name}
              </p>
            </motion.div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => {
              stopAuto();
              scroll("right");
              startAuto();
            }}
            className="
              absolute right-1 sm:right-2 top-[42%] -translate-y-1/2 z-10
              w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-slate-700/90 lg:bg-white lg:dark:bg-slate-700
              border border-gray-200 dark:border-gray-600
              flex items-center justify-center shadow-md hover:cursor-pointer
              text-gray-600 dark:text-white hover:shadow-lg transition-all duration-200
            "
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Show More Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mt-6 sm:mt-8"
      >
        <Link to="/clients">
          <button
            className="
              bg-[#262626] hover:bg-[#003557] text-white
              text-xs sm:text-sm font-semibold px-6 sm:px-8 py-2 sm:py-2.5 rounded-full
              transition-colors duration-200 cursor-pointer
            "
          >
            Show More
          </button>
        </Link>
      </motion.div>
    </section>
  );
}