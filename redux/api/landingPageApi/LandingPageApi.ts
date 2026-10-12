import baseApi from "../baseApi";

export const landingPageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
    }),
    getCategories: builder.query({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCourses: builder.query({
      query: () => ({
        url: "/course",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getPlans: builder.query({
      query: () => ({
        url: "/plan",
        method: "GET",
      }),
    }),
    createCheckoutSession: builder.mutation({
      query: (body) => ({
        url: "/subscription/checkout",
        method: "POST",
        body,
      }),
    }),
    getBundles: builder.query({
      query: () => ({
        url: "/bundle",
        method: "GET",
      }),
    }),
    getReviews: builder.query({
      query: () => ({
        url: "/review",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetCoursesQuery,
  useGetPlansQuery,
  useCreateCheckoutSessionMutation,
  useGetBundlesQuery,
  useGetReviewsQuery,
} = landingPageApi;
