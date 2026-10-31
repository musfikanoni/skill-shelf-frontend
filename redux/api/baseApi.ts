
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:7000/api/v1`,
    // baseUrl: `https://skill-shelf-backend.vercel.app/api/v1/`,

    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies?.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["User", "Orders", "Product", "Course", "Dashboard", "Subscription", "Category", "Coupon", "Affiliate", "Plan"],
});


export default baseApi;
 