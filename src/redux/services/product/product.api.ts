// src/redux/services/product/product.api.ts

import { baseApi } from "@/redux/baseApi";
import type { Product, ProductsResponse } from "@/types/product.type";

interface GetProductsParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  sub_category_id?: number;
  is_featured?: 1 | 0;
  search?: string;
}

interface SingleProductResponse {
  success: boolean;
  data: Product;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams>({
      query: (params = {}) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Product"],
    }),

    getProductBySlug: builder.query<SingleProductResponse, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: ["Product"],
    }),
  }),
});


export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
} = productApi;



