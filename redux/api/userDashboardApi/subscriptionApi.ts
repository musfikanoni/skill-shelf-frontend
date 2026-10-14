import { CheckoutResponse, MySubscriptionResponse } from "@/types/subscriptions.type";
import baseApi from "../baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query<any, void>({
      query: () => ({
        url: "/subscription",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    getAllPlans: builder.query<any, void>({
      query: () => ({
        url: "/plan",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    createPlan: builder.mutation<any, any>({
      query: (data) => ({
        url: "/plan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    updatePlan: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/plan/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),
    deletePlan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscription"],
    }),

    createSubscriptionCheckout: builder.mutation<
      CheckoutResponse,
      { planId: string }
    >({
      query: ({ planId }) => ({
        url: "/subscription/checkout",
        method: "POST",
        body: { planId },
      }),
      invalidatesTags: ["Subscription"],
    }),

    getMySubscription: builder.query<MySubscriptionResponse, void>({
      query: () => ({
        url: "/subscription/me",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetAllSubscriptionsQuery,
  useGetAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useCreateSubscriptionCheckoutMutation,
  useGetMySubscriptionQuery,
} = subscriptionApi;
