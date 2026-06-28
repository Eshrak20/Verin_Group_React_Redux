// src/components/HeroBanner.tsx
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/banners/banner1.jpg",
    // image না থাকলে fallback bg
    bg: "from-[#1a1a2e] to-[#0f3460]",
  },
  {
    id: 2,
    image: "/banners/banner2.jpg",
    bg: "from-[#2d1b69] to-[#11998e]",
  },
  {
    id: 3,
    image: "/banners/banner3.jpg",
    bg: "from-[#c94b4b] to-[#4b134f]",
  },
];

const sideImages = [
  {
    id: 1,
    image: "/banners/side1.jpg",
    bg: "from-[#f7971e] to-[#ffd200]",
    link: "/offer1",
  },
  {
    id: 2,
    image: "/banners/side2.jpg",
    bg: "from-[#11998e] to-[#38ef7d]",
    link: "/offer2",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, []);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 3500);
    return () => clearInterval(timer);
  }, [current, goTo]);

  return (
    <div className="grid grid-cols-[2fr_1fr] gap-2 w-full h-72 md:h-80 lg:h-96">

      {/* Left — Slider */}
      <div className="relative rounded-xl overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              absolute inset-0 transition-opacity duration-500
              bg-linear-to-br ${slide.bg}
              ${index === current ? "opacity-100" : "opacity-0"}
            `}
          >
            {slide.image && (
              <img
                src={slide.image}
                alt={`Banner ${slide.id}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}

        {/* Prev Button */}
        <button
          onClick={() => goTo(current - 1)}
          className="
            absolute left-3 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 rounded-full flex items-center justify-center
            bg-white/20 border border-white/30 text-white
            hover:bg-white/35 transition-all duration-200
            backdrop-blur-sm
          "
        >
          <ChevronLeft size={16} />
        </button>

        {/* Next Button */}
        <button
          onClick={() => goTo(current + 1)}
          className="
            absolute right-3 top-1/2 -translate-y-1/2 z-10
            w-8 h-8 rounded-full flex items-center justify-center
            bg-white/20 border border-white/30 text-white
            hover:bg-white/35 transition-all duration-200
            backdrop-blur-sm
          "
        >
          <ChevronRight size={16} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${index === current
                  ? "w-5 bg-white"
                  : "w-2 bg-white/40"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Right — Static Images */}
      <div className="flex flex-col gap-2">
        {sideImages.map((img) => (
          <a
            key={img.id}
            href={img.link}
            className={`
              flex-1 rounded-xl overflow-hidden
              bg-linear-to-br ${img.bg}
              hover:scale-[1.01] transition-transform duration-200
              block relative
            `}
          >
            {img.image && (
              <img
                src={img.image}
                alt={`Side banner ${img.id}`}
                className="w-full h-full object-cover"
              />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}