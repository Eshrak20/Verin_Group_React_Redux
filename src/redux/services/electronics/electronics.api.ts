import { baseApi } from "@/redux/baseApi";
import type { BrandsApiResponse } from "@/types/electronics/brand.type";
import type { ProductListRequest, ProductListResponse } from "@/types/electronics/product-list.type";
import type { ElecSubCategoryResponse } from "@/types/electronics/sub-category.type";
import type { ProductDetailsResponse } from "@/types/product.type";

export const ElecSubCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getElecSubCategory: builder.query<ElecSubCategoryResponse, void>({
      query: () => "/sub-categories",
      providesTags: ["Elec-SubCategory"],
    }),

    getElecBrand: builder.query<BrandsApiResponse, void>({
      query: () => "/brands",
      providesTags: ["Elec-SubCategory"],
    }),

    getElecProductDetails: builder.query<ProductDetailsResponse, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: ["Elec-Product-Details"],
    }),

    getElecProductList: builder.query<ProductListResponse, ProductListRequest>({
      query: (body) => ({
        url: `/products`,
        method: "POST",
        body,
      }),
      providesTags: ["ProductsListApi"],
    }),

  }),
});

export const { useGetElecSubCategoryQuery, useGetElecBrandQuery, useGetElecProductDetailsQuery, useGetElecProductListQuery } = ElecSubCategoryApi;