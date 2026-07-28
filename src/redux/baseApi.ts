import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://v.veringroup.com/api/v1",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Banner", "Categories", "Footer", "Product", "ClientReviews", "Client", "Blog", "FooterPages"],
  
  endpoints: () => ({}),
});