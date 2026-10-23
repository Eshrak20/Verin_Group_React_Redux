import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { Banner } from "@/redux/services/homepage/homePage.api";

interface ElecBannerProps {
  banners?: Banner[];
}

export default function ElecSliderBanner({ banners }: ElecBannerProps) {
  const bannerList = banners ?? [];

  // Filter items where is_slide is true for the slider
  const slideBanners = bannerList.filter((item) => item.is_slide === 1);

  // Find the banner where sorting_number is 4 for the right side card
  const sideBanner = bannerList.find((item) => item.sorting_number === 4);

  // Setup Embla Carousel with Loop and Autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6500, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelection = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Set initial selection once emblaApi is ready
    updateSelection();

    emblaApi.on("select", updateSelection);
    emblaApi.on("reInit", updateSelection);

    return () => {
      emblaApi.off("select", updateSelection);
      emblaApi.off("reInit", updateSelection);
    };
  }, [emblaApi]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-0">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Slider Section (Takes 2 columns on large screens) */}
        <div className="relative group overflow-hidden rounded-xl bg-white shadow-sm lg:col-span-2">
          {/* Carousel Viewport */}
          <div className="h-full w-full overflow-hidden" ref={emblaRef}>
            <div className="flex h-full w-full">
              {slideBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative h-62.5 w-full flex-[0_0_100%] min-w-0 sm:h-87.5"
                >
                  <img
                    src={banner.image_url}
                    alt="Electronics Slide Banner"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Custom Left Button */}
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/85 shadow-lg opacity-90 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Transparent Custom Right Button */}
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/85 shadow-lg opacity-90 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Custom Pagination Dots */}
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slideBanners.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  index === selectedIndex
                    ? "w-7 bg-elec"
                    : "w-2.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Static Banner Section (Takes 1 column on large screens) */}
        <div className="flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
          {sideBanner ? (
            <div className="relative h-62.5 w-full sm:h-87.5">
              <img
                src={sideBanner.image_url}
                alt="Side Promotional Banner"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-62.5 w-full items-center justify-center bg-elec/10 font-medium text-elec sm:h-87.5">
              Banner Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}