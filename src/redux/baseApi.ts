import { getAuthToken, getAuthTokenType } from "@/lib/authCookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://test.veringroup.com/api/v1",
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      const tokenType = getAuthTokenType() || "Bearer";

      if (token) {
        headers.set("Authorization", `${tokenType} ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Banner", "Categories", "Footer", "Product", "ClientReviews", "Client", "Blog", "FooterPages", "Elec-SubCategory", "Elec-Product-Details", "wishlist"],

  endpoints: () => ({}),
});