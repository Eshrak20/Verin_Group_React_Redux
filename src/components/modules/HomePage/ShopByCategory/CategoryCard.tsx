// src/components/modules/HomePage/CategoryCard.tsx

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface CategoryCardProps {
  cat: {
    id: number;
    name: string;
    image: string;
    path: string;
    bg: string;
  };
  index: number;
}

export default function CategoryCard({ cat, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="min-w-45 sm:min-w-55 lg:min-w-69 w-45 sm:w-55 lg:w-69"
    >
      <Link
        to={cat.path}
        className="flex flex-col items-center hover:cursor-pointer group w-full"
      >
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className={`w-full h-full bg-linear-to-br ${cat.bg}`}>
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

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

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 md:hidden z-10">
            <span className="
              bg-white text-gray-900 text-xs sm:text-sm font-semibold
              px-3 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg whitespace-nowrap inline-block
            ">
              Shop Now
            </span>
          </div>
        </div>

        <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold uppercase tracking-widest home-black-text group-hover:text-[#003557] transition-colors duration-200 text-center">
          {cat.name}
        </p>
      </Link>
    </motion.div>
  );
}