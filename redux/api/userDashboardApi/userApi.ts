import baseApi from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/user/update-own-profile",
        method: "PATCH",
        body: formData,
        formData: formData instanceof FormData,
      }),
      invalidatesTags: ["User"],
    }),

    updatePassword: builder.mutation({
      query: (formData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    deleteAccount: builder.mutation({
      query: () => ({
        url: "/user/delete-own-profile",
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
} = userApi;
