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
        body: params.sub_category_id
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



