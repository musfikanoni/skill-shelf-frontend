import baseApi from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    signUp: builder.mutation({
      query: (body) => ({
        url: "/user/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "/otp/verify-signup-otp",
        method: "POST",
        body,
      }),
    }),
    resendCode: builder.mutation({
      query: (body) => ({
        url: "/otp/resend-otp", 
        method: "POST",
        body,
      }),
    }),
    forgetResendOtp: builder.mutation({
      query: (body) => ({
        url: "/otp/forget-resend-otp",
        method: "POST",
        body,
      }),
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetVerifyOtp: builder.mutation({
      query: (body) => ({
        url: "/otp/verify-reset-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
  useForgetPasswordMutation,
  useResetVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useForgetResendOtpMutation,
} = authApi;
