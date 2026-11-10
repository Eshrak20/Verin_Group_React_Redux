import { baseApi } from "@/redux/baseApi";
import type { AddToWishlistResponse, SavedProductsApiResponse } from "@/types/wishlist.type";

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addToWishlist: builder.mutation<AddToWishlistResponse, { product_id: number }>({
            query: (body) => ({
                url: "/saved-products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["wishlist"],
        }),

        getWishlist: builder.query<SavedProductsApiResponse, { page?: number; per_page?: number } | void>({
            query: (params) => ({
                url: "/saved-products",
                params: params ?? { page: 1, per_page: 12 },
            }),
            providesTags: ["wishlist"],
        }),
    }),
});

export const { useAddToWishlistMutation, useGetWishlistQuery } = wishlistApi;