import { OrderDetailsResponse, OrderResponse } from "@/types/orders.type";
import baseApi from "../baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<OrderResponse, string | void>({
      query: (searchTerm: string) => ({
        url: searchTerm
          ? `/order/my-orders?searchTerm=${searchTerm}`
          : "/order/my-orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    getMyOrderById: builder.query<OrderDetailsResponse, string>({
      query: (id: string) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    getAllOrders: builder.query<any, void>({
      query: () => "/order",
      providesTags: ["Orders"],
    }),
    
    updateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/order/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const { 
    useGetMyOrdersQuery, 
    useGetMyOrderByIdQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
} = ordersApi;