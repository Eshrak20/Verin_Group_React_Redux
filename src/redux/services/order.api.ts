import { baseApi } from "@/redux/baseApi";
import type {
    CreateOrderRequest,
    CreateOrderResponse,
    OrderDetailsApiResponse,
    OrderListApiResponse,
} from "@/types/order.type";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
            query: (body) => ({
                url: "/orders",
                method: "POST",
                body,
            }),
            invalidatesTags: ["order", "wishlist"],
        }),

        getOrders: builder.query<OrderListApiResponse, { page?: number; per_page?: number } | void>({
            query: (params) => ({
                url: "/orders",
                params: params ?? { page: 1, per_page: 10 },
            }),
            providesTags: ["order"],
        }),

        getOrderDetails: builder.query<OrderDetailsApiResponse, string | number>({
            query: (orderId) => ({
                url: `/orders/${orderId}`,
            }),
            providesTags: (_result, _error, id) => [{ type: "order", id }],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrdersQuery,
    useGetOrderDetailsQuery
} = orderApi;