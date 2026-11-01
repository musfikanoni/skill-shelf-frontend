
import baseApi from "../baseApi";
import { UserOverviewResponse } from "@/types/overview.type";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboard: builder.query<UserOverviewResponse, void>({
      query: () => ({
        url: "/dashboard/user",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    getOverviewStats: builder.query<any, void>({
      query: () => "/dashboard/overview",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { 
    useGetUserDashboardQuery,
    useGetOverviewStatsQuery,
} = dashboardApi;
