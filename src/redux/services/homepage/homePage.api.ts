import { baseApi } from "@/redux/baseApi";
import type { FooterResponse } from "@/types/footer.type";

interface Banner {
  id: number;
  page_name: string;
  banner_image: string;
  status: boolean;
  sorting_number: string;
  is_slide: string;
  image_url: string;
}

interface BannerResponse {
  success: boolean;
  data: Banner[];
}

// Category interface
interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image: string;
  status: string;
  image_url: string;
}

interface CategoryResponse {
  status: boolean;
  data: Category[];
}





// banner api
export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeBanner: builder.query<BannerResponse, void>({
      query: () => "/banners/home",
      providesTags: ["Banner"],
    }),
  }),
});

// categories api
export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse, void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
  }),
});



export const footerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFooterSettings: builder.query<FooterResponse, void>({
      query: () => "/footer",
      providesTags: ["Footer"],
    }),
  }),
});



export const { useGetHomeBannerQuery } = bannerApi;
export const { useGetCategoriesQuery } = categoriesApi;
export const { useGetFooterSettingsQuery } = footerApi;