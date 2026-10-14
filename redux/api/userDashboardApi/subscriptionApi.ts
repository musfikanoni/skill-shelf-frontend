
import baseApi from '../baseApi';

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptions: builder.query<any, void>({
      query: () => ({
        url: '/subscription',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    getAllPlans: builder.query<any, void>({
      query: () => ({
        url: '/plan',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
    createPlan: builder.mutation<any, any>({
      query: (data) => ({
        url: '/plan',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    updatePlan: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/plan/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
    deletePlan: builder.mutation<any, string>({
      query: (id) => ({
        url: `/plan/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscription'],
  }),
}),
});

export const { 
  useGetAllSubscriptionsQuery, 
  useGetAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation
} = subscriptionApi;
