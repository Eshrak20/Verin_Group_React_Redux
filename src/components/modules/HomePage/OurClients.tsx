/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Client {
  id: number;
  name: string;
  logo: string;
}

const clients: Client[] = [
  { id: 1, name: "TechCorp", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846240/client1_mplbml.jpg" },
  { id: 2, name: "Devmark", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846239/client2_ymcgih.jpg" },
  { id: 3, name: "Rapid Space", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846230/client3_flwpwq.jpg" },
  { id: 4, name: "Webmaster", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846230/client4_kfuvt7.jpg" },
  { id: 5, name: "Plumbing", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846231/client5_lx8zhp.jpg" },
  { id: 6, name: "Connection", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846240/client6_gnog0m.jpg" },
  { id: 7, name: "Patsy", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846230/client7_cuusns.jpg" },
  { id: 8, name: "Happy Partners", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846231/client8_zl8wm8.jpg" },
  { id: 9, name: "BuildCo", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846238/client9_tv72qo.jpg" },
  { id: 10, name: "NextGen", logo: "https://res.cloudinary.com/gu08e9ha/image/upload/v1782846231/client10_xtkip1.jpg" },
];

const VISIBLE = 8;
const GAP = 16;

export default function OurClients() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const getCardWidth = () => {
    const el = scrollRef.current;
    if (!el) return 100;
    return (el.clientWidth - GAP * (VISIBLE - 1)) / VISIBLE;
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
    autoRef.current = setInterval(autoScroll, 2500);
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
    <section className="py-12 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold home-black-text">
          Our Clients
        </h2>
        <div className="w-12 h-0.5 bg-[#262626] mx-auto mt-2" />
      </div>

      {/* Slider */}
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => { stopAuto(); scroll("left"); startAuto(); }}
            className="
              absolute left-2 top-[42%] -translate-y-1/2 z-10
              w-8 h-8 rounded-full bg-white dark:bg-slate-700
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
          {clients.map((client) => (
            <div
              key={client.id}
              className="shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
              style={{
                width: `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})`,
              }}
            >
              {/* Logo box */}
              <div className="
                  w-full aspect-square rounded-xl
                  border border-gray-200 dark:border-gray-700
                bg-white dark:bg-slate-800
                  flex items-center justify-center
                  overflow-hidden
                  transition-all duration-300
                group-hover:border-blue-400 group-hover:shadow-md
              ">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-3/4 h-3/4 object-contain transition-transform duration-300 group-hover:scale-110"
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
              <p className="text-xs home-black-text text-center font-medium truncate w-full">
                {client.name}
              </p>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => { stopAuto(); scroll("right"); startAuto(); }}
            className="
              absolute right-2 top-[42%] -translate-y-1/2 z-10
              w-8 h-8 rounded-full bg-white dark:bg-slate-700
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
      <div className="flex justify-center mt-8">
        <button className="
          bg-[#262626] hover:bg-[#003557] text-white
          text-sm font-semibold px-8 py-2.5 rounded-full
          transition-colors duration-200 cursor-pointer
        ">
          Show More
        </button>
      </div>
    </section>
  );
}