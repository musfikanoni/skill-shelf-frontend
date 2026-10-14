import { MyCommissionResponse } from "@/types/affiliate.type";
import baseApi from "../baseApi";

export const affiliateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAffiliates: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.searchTerm) queryParams.append("search", params.searchTerm);
        if (params?.status && params.status !== "all")
          queryParams.append("status", params.status);

        return {
          url: `/affiliate?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Affiliate"],
    }),
    updateAffiliate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/affiliate/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Affiliate"],
    }),
    deleteAffiliate: builder.mutation({
      query: (id) => ({
        url: `/affiliate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Affiliate"],
    }),

    getMyCommission: builder.query<MyCommissionResponse, void>({
      query: () => ({
        url: "/affiliate/my-commissions",
        method: "GET",
      }),
      providesTags: ["Affiliate"],
    }),

    createAffiliate: builder.mutation({
      query: (formData: any) => ({
        url: "/affiliate",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Affiliate"],
    }),
  }),
});

export const {
  useGetAffiliatesQuery,
  useUpdateAffiliateMutation,
  useDeleteAffiliateMutation,
  useGetMyCommissionQuery,
  useCreateAffiliateMutation,
} = affiliateApi;
