import baseApi from '../baseApi';

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query<any, void>({
      query: () => ({
        url: '/coupon',
        method: 'GET',
      }),
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation<any, any>({
      query: (data) => ({
        url: '/coupon',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/coupon/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation<any, string>({
      query: (id) => ({
        url: `/coupon/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
  }),
});

export const { 
  useGetAllCouponsQuery, 
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation
} = couponApi;
