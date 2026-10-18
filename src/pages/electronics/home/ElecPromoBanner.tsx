import type { Banner } from "@/redux/services/homepage/homePage.api";

interface ElecBannerProps {
  banners?: Banner[];
}

export default function ElecPromoBanner({ banners }: ElecBannerProps) {
  const bannerList = banners ?? [];

  // Find the banners where sorting_number is 5 and 6
  const bannerFive = bannerList.find((item) => item.sorting_number === 5);
  const bannerSix = bannerList.find((item) => item.sorting_number === 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 5 (Left Side) */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm flex items-center justify-center">
          {bannerFive ? (
            <div className="relative h-50 sm:h-60 w-full">
              <img
                src={bannerFive.image_url}
                alt="Promotional Banner 1"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-50 sm:h-60 w-full items-center justify-center bg-elec/10 text-elec font-medium">
              Banner Unavailable
            </div>
          )}
        </div>

        {/* Banner 6 (Right Side) */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm flex items-center justify-center">
          {bannerSix ? (
            <div className="relative h-50 sm:h-60 w-full">
              <img
                src={bannerSix.image_url}
                alt="Promotional Banner 2"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-50 sm:h-60 w-full items-center justify-center bg-elec/10 text-elec font-medium">
              Banner Unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
}