import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Banner } from "@/redux/services/homepage/homePage.api";
import "swiper/css";
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Slider Section (Takes 2 columns on large screens) */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl bg-white shadow-sm">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletActiveClass: "swiper-pagination-bullet-active !bg-elec",
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