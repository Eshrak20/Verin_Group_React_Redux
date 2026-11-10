import ProductCard from "@/components/common/ProductCard";
import type { Product } from "@/types/product.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

interface ElecNewArrivalProps {
  products?: Product[];
}

export default function ElecNewArrival({
  products = [],
}: ElecNewArrivalProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  const newArrivalProducts = useMemo(
    () =>
      Array.isArray(products)
        ? products.filter((product) => product.status !== false).slice(0, 8)
        : [],
    [products],
  );

  if (newArrivalProducts.length === 0) return null;

  const showNavigation = newArrivalProducts.length > 5;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-0">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          New Arrival
        </h2>
      </div>

      <div className="group relative">
        {/* Swiper Navigation Arrows */}
        {showNavigation && (
          <>
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous products"
              className="absolute -left-5 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-600/80 text-white shadow-md transition-colors hover:bg-gray-800 cursor-pointer"
            >
              <ChevronLeft className="size-6" />
            </button>

            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next products"
              className="absolute -right-5 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-600/80 text-white shadow-md transition-colors hover:bg-gray-800 cursor-pointer"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="py-3!"
        >
          {newArrivalProducts.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}