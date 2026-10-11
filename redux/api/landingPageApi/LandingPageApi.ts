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
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetCoursesQuery,
} = landingPageApi;
