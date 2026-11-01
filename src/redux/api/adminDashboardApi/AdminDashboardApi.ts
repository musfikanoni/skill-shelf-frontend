import { baseApi } from "../baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: () => "/dashboard/overview",
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;