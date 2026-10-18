import { baseApi } from "@/redux/baseApi";
import type { ElecSubCategoryResponse } from "@/types/electronics/sub-category.type";

export const ElecSubCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getElecSubCategory: builder.query<ElecSubCategoryResponse, void>({
      query: () => "/sub-categories",
      providesTags: ["Elec-SubCategory"],
    }),
  }),
});

export const { useGetElecSubCategoryQuery } = ElecSubCategoryApi;