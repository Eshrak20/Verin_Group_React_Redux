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



// Blog interface
interface Blog {
  id: number;
  title: string;
  title_bng: string | null;
  slug: string;
  content: string;
  content_bng: string | null;
  summary: string | null;
  summary_bng: string | null;
  excerpt: string | null;
  featured_image: string | null;
  category_id: number | null;
  author_id: number | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  views: number;
  is_featured: boolean;
  reading_time: number;
  published_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  image_url: string;
}

interface BlogResponse {
  current_page: number;
  data: Blog[];
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


export const clientReviewsApi = baseApi.injectEndpoints({ 
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => "/client-reviews",
      providesTags: ["ClientReviews"],
    }),
  }),
});



export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClient: builder.query({
      query: () => "/clients",
      providesTags: ["Client"],
    }),
  })
})


export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlog: builder.query<BlogResponse, void>({
      query: () => "/blogs",
      providesTags: ["Blog"],
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
export const { useGetReviewsQuery } = clientReviewsApi;
export const { useGetClientQuery } = clientApi;
export const { useGetBlogQuery } = blogApi;