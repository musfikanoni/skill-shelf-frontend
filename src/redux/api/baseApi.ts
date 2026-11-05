import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: `http://localhost:7000/api/v1`,
    baseUrl: `https://skill-shelf-backend.vercel.app/api/v1/`,

    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies?.get("token") || Cookies?.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Cache fetched data in memory for 5 minutes for instant page navigation
  keepUnusedDataFor: 300,
  // Prevent aggressive background refetching on tab switch to eliminate lag
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Orders",
    "Product",
    "Course",
    "Dashboard",
    "Subscription",
    "Category",
    "Coupon",
    "Affiliate",
    "Plan",
    "Bundle",
  ],
});

export default baseApi;
