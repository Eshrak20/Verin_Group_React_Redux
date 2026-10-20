import type { Product } from "@/types/product.type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef } from "react";
import { Link } from "react-router";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

interface ElecNewArrivalProps {
  products?: Product[];
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(price);

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
          className="py-3!" // Added vertical padding so the lift effect doesn't get clipped by overflow
        >
          {newArrivalProducts.map((product) => {
            const variant = product.variant;

            const originalPrice = Number(variant?.price ?? 0);
            const salePrice = Number(variant?.sale_price ?? 0);

            const hasDiscount =
              salePrice > 0 &&
              originalPrice > 0 &&
              salePrice < originalPrice;

            const displayPrice = hasDiscount ? salePrice : originalPrice;
            const savingsAmount = hasDiscount
              ? originalPrice - salePrice
              : 0;

            const imageUrl =
              variant?.images?.find(
                (image) => typeof image === "string" && image.trim() !== "",
              ) ?? "/placeholder.png";

            return (
              <SwiperSlide key={product.id} className="h-auto">
                <Link to={`/electronics/${product.slug}`} className="flex h-full flex-col overflow-hidden rounded-lg border cursor-pointer border-gray-100 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg">
                  {/* Full Container Image Section */}
                  <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-[#f4f5f7]">
                    {hasDiscount && (
                      <div className="absolute top-0 left-0 right-0 z-10 bg-elec py-1.5 text-center text-xs font-semibold text-white shadow-sm">
                        Save ৳{" "}
                        <span className="text-yellow-400 text-[14px] font-bold">
                          {formatPrice(savingsAmount)}
                        </span>{" "}
                        Today! ⚡
                      </div>
                    )}

                    <img
                      src={imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  </div>

                  {/* Product Information */}
                  <div className="flex flex-1 flex-col justify-between p-4 bg-white">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-800">
                      {product.name}
                    </h3>

                    {/* Price & Discount */}
                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                      {displayPrice > 0 ? (
                        <span className="text-lg font-bold text-elec">
                          ৳{formatPrice(displayPrice)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Price unavailable
                        </span>
                      )}

                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          ৳{formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}