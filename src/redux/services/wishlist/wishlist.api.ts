import { baseApi } from "@/redux/baseApi";
import type { AddToWishlistData, GetWishlistData, WishlistResponse } from "@/types/wishlist.type";

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addToWishlist: builder.mutation<WishlistResponse & { data: AddToWishlistData }, { product_id: number }>({
            query: (body) => ({
                url: "/saved-products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["wishlist"],
        }),

        getWishlist: builder.query<WishlistResponse & { data: GetWishlistData }, { page?: number; per_page?: number } | void>({
            query: (params) => ({
                url: "/saved-products",
                params: params ?? { page: 1, per_page: 10 },
            }),
            providesTags: ["wishlist"],
        }),
    }),
});

export const { useAddToWishlistMutation, useGetWishlistQuery } = wishlistApi;