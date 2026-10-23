// src/redux/services/product/product.api.ts

import { baseApi } from "@/redux/baseApi";
import type { ProductDetailsResponse, ProductsResponse } from "@/types/product.type";

export interface GetProductsParams {
  search?: string;
  category_id?: number | null;
  sub_category_id?: number | null;
  brand_id?: number | null;
  is_featured?: boolean | null;
  in_stock?: boolean | null;
  price_min?: number | null;
  price_max?: number | null;
  per_page?: number;
  page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  attributes?: Record<string, string[]>;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams>({
      query: (params = {}) => ({
        url: "/products",
        method: "POST",
        // params,
        body: {
          search: params.search,
          category_id: params.category_id ?? null,
          is_featured: params.is_featured,
        },
      }),
      providesTags: ["Product"],
    }),

    getProductBySlug: builder.query<ProductDetailsResponse, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: ["Product"],
    }),
  }),
});


export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
} = productApi;



