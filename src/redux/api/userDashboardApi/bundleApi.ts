import baseApi from "../baseApi";

export const bundleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBundles: builder.query<any, void>({
      query: () => ({
        url: "/bundle",
        method: "GET",
      }),
      providesTags: ["Bundle"],
    }),
    getBundleById: builder.query<any, string>({
      query: (id) => ({
        url: `/bundle/public/${id}`,
        method: "GET",
      }),
      providesTags: ["Bundle"],
    }),
    createBundle: builder.mutation<any, any>({
      query: (data) => ({
        url: "/bundle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bundle"],
    }),
    updateBundle: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/bundle/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bundle"],
    }),
    deleteBundle: builder.mutation<any, string>({
      query: (id) => ({
        url: `/bundle/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bundle"],
    }),
  }),
});

export const {
  useGetAllBundlesQuery,
  useGetBundleByIdQuery,
  useCreateBundleMutation,
  useUpdateBundleMutation,
  useDeleteBundleMutation,
} = bundleApi;
