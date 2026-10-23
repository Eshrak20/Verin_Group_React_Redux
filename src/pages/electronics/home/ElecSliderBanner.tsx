import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Swiper as SwiperCore } from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Banner } from "@/redux/services/homepage/homePage.api";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ElecBannerProps {
  banners?: Banner[];
}

export default function ElecSliderBanner({ banners }: ElecBannerProps) {
  const bannerList = banners ?? [];

  // Filter items where is_slide is true for the slider
  const slideBanners = bannerList.filter((item) => item.is_slide === 1);

  // Find the banner where sorting_number is 4 for the right side card
  const sideBanner = bannerList.find((item) => item.sorting_number === 4);

  // References for custom navigation buttons
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);

  // Ensure navigation updates correctly once refs are attached
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.params.navigation) {
      const nav = swiperRef.current.params.navigation;
      nav.prevEl = prevRef.current;
      nav.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Slider Section (Takes 2 columns on large screens) */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl bg-white shadow-sm relative group">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ 
              clickable: true,
              bulletActiveClass: "swiper-pagination-bullet-active !bg-elec",
            }}
            navigation={true}
            onBeforeInit={(swiper: SwiperCore) => {
              swiperRef.current = swiper;
              if (
                swiper.params.navigation &&
                typeof swiper.params.navigation !== "boolean"
              ) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            loop={true}
            className="h-full w-full"
          >
            {slideBanners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative h-62.5 sm:h-87.5 w-full">
                  <img
                    src={banner.image_url}
                    alt="Electronics Slide Banner"
                    className="h-full w-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Visible & Functional Left and Right Navigation Buttons */}
          <button
            ref={prevRef}
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/85 cursor-pointer shadow-lg border border-white/20 opacity-90 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>
          
          <button
            ref={nextRef}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/85 cursor-pointer shadow-lg border border-white/20 opacity-90 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Static Banner Section (Takes 1 column on large screens) */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm flex items-center justify-center">
          {sideBanner ? (
            <div className="relative h-62.5 sm:h-87.5 w-full">
              <img
                src={sideBanner.image_url}
                alt="Side Promotional Banner"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-62.5 sm:h-87.5 w-full items-center justify-center bg-elec/10 text-elec font-medium">
              Banner Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}