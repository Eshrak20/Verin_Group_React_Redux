import { baseApi } from "@/redux/baseApi";
import type { ElecSubCategoryResponse } from "@/types/electronics/sub-category.type";
import type { ProductDetailsResponse } from "@/types/product.type";

export const ElecSubCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getElecSubCategory: builder.query<ElecSubCategoryResponse, void>({
      query: () => "/sub-categories",
      providesTags: ["Elec-SubCategory"],
    }),

    getElecProductDetails: builder.query<ProductDetailsResponse, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: ["Elec-Product-Details"],
    }),

  }),
});

export const { useGetElecSubCategoryQuery, useGetElecProductDetailsQuery } = ElecSubCategoryApi;