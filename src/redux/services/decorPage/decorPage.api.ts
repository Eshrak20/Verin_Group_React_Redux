import { baseApi } from "@/redux/baseApi";
import type { FooterResponse } from "@/types/footer.type";






export const footerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFooterSettings: builder.query<FooterResponse, void>({
      query: () => "/footer",
      providesTags: ["Footer"],
    }),
  }),
});





export const { useGetFooterSettingsQuery } = footerApi;