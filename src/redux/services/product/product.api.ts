// src/redux/services/product/product.api.ts

import { baseApi } from "@/redux/baseApi";
import type { ProductDetailsResponse, ProductsResponse } from "@/types/product.type";

interface GetProductsParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  sub_category_id?: number;
  is_featured?: boolean;
  search?: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams>({
      query: (params = {}) => ({
        url: "/products",
        method: "POST",
        params,
        body: {
          category_id: params.category_id,
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



