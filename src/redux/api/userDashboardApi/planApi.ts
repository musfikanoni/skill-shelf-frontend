
import { PlansResponse } from "@/types/plan.type";
import baseApi from "../baseApi";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlan: builder.query<PlansResponse, void>({
      query: () => ({
        url: "/plan",
        method: "GET",
      }),
      providesTags: ["Plan"],
    }),
  }),


});


export const { 
  useGetAllPlanQuery, 
} = planApi;