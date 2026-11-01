import { CanReviewResponse, ProductsResponse } from "@/types/product.type";
import baseApi from "../baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPurchasedProduct: builder.query<ProductsResponse, string | void>({
      query: (searchTerm) => ({
        url: searchTerm
          ? `/product/my-all-product?searchTerm=${searchTerm}`
          : "/product/my-all-product",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getAllProducts: builder.query<any, void>({
      query: () => "/product",
      providesTags: ["Product"],
    }),
    getSingleProduct: builder.query<any, string>({
      query: (id) => `/product/id/${id}`,
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation<any, FormData>({
      query: (data) => ({
        url: "/product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation<any, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    getProductCanReview: builder.query<
      CanReviewResponse,
      { itemId: string; itemType: string }
    >({
      query: ({ itemId, itemType }) => ({
        url: "/review/can-review",
        method: "GET",
        params: {
          itemId,
          itemType,
        },
      }),
      providesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (formData: any) => ({
        url: "/review",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllPurchasedProductQuery,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductCanReviewQuery,
  useCreateReviewMutation,
} = productApi;
