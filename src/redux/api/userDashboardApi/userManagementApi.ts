import baseApi from "../baseApi";

export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, { page?: number; limit?: number; searchTerm?: string; role?: string } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.searchTerm) searchParams.append('searchTerm', params.searchTerm);
        if (params?.role && params.role !== 'all') searchParams.append('role', params.role);
        
        const queryString = searchParams.toString();
        return queryString ? `/user/all-users?${queryString}` : "/user/all-users";
      },
      providesTags: ["User"],
    }),
    updateUserStatus: builder.mutation<any, { id: string; isActive: string }>({
      query: ({ id, isActive }) => ({
        url: `/user/update-status/${id}`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { 
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserStatusMutation,
    useDeleteUserMutation,
} = userManagementApi;
