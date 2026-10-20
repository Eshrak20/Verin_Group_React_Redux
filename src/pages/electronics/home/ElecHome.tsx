import ElectronicsFeaturedProducts from "@/components/modules/HomePage/ElectronicsFeaturedProducts";
import { useGetBannerQuery } from "@/redux/services/homepage/homePage.api";
import { useGetProductsQuery } from "@/redux/services/product/product.api";
import ElecNewArrival from "./ElecNewArrival";
import ElecPromoBanner from "./ElecPromoBanner";
import ElecSliderBanner from "./ElecSliderBanner";

export default function ElectronicsPage() {
  const {
    data: bannerData,
    isError: bannerError,
  } = useGetBannerQuery("electronics");

  const { data: productData } = useGetProductsQuery({
    category_id: 2,
  });

  // if (bannerLoading || productLoading) {
  //   return <div className="px-4 py-8">Loading electronics...</div>;
  // }

  if (bannerError) {
    return (
      <div className="px-4 py-8 text-destructive">
        Failed to load electronics categories. Please try again.
      </div>
    );
  }

  const products = Array.isArray(productData?.data?.products)
    ? productData.data.products
    : [];

  return (
    <div className="min-h-screen w-full">
      <ElecSliderBanner banners={bannerData?.data} />
      <ElectronicsFeaturedProducts />
      <ElecPromoBanner banners={bannerData?.data} />
      <ElecNewArrival products={products} />
    </div>
  );
}