import baseApi from "@/redux/api/baseApi";
import { EnrolledCoursesResponse } from "@/types/course.type";

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query<EnrolledCoursesResponse, void>({
        query: () => ({
            url: "/enrollment/my-enrollments",
            method: "GET",
        }),
        providesTags: ["Course"],
    }),
    getAllCourses: builder.query<any, void>({
        query: () => "/course",
        providesTags: ["Course"],
    }),
    getMilestonesByCourse: builder.query<any, string>({
        query: (id) => `/milestone/course/${id}`,
        providesTags: ["Course"],
    }),
    getVideosByMilestone: builder.query<any, string>({
        query: (id) => `/video/milestone/${id}`,
        providesTags: ["Course"],
    }),
    createCourse: builder.mutation<any, FormData>({
        query: (data) => ({
            url: "/course",
            method: "POST",
            body: data,
        }),
        invalidatesTags: ["Course"],
    }),
    updateCourse: builder.mutation<any, { id: string; data: FormData }>({
        query: ({ id, data }) => ({
            url: `/course/${id}`,
            method: "PATCH",
            body: data,
        }),
        invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation<any, string>({
        query: (id) => ({
            url: `/course/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ["Course"],
    }),
    // Milestone Endpoints
    createMilestone: builder.mutation<any, { title: string; course: string }>({
        query: (data) => ({
            url: "/milestone",
            method: "POST",
            body: data,
        }),
        invalidatesTags: ["Course"],
    }),
    updateMilestone: builder.mutation<any, { id: string; data: any }>({
        query: ({ id, data }) => ({
            url: `/milestone/${id}`,
            method: "PATCH",
            body: data,
        }),
        invalidatesTags: ["Course"],
    }),
    deleteMilestone: builder.mutation<any, string>({
        query: (id) => ({
            url: `/milestone/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ["Course"],
    }),
    // Video Endpoints
    createVideo: builder.mutation<any, FormData>({
        query: (data) => ({
            url: "/video",
            method: "POST",
            body: data,
        }),
        invalidatesTags: ["Course"],
    }),
    updateVideo: builder.mutation<any, { id: string; data: FormData }>({
        query: ({ id, data }) => ({
            url: `/video/${id}`,
            method: "PATCH",
            body: data,
        }),
        invalidatesTags: ["Course"],
    }),
    publishVideo: builder.mutation<any, string>({
        query: (id) => ({
            url: `/video/${id}/publish`,
            method: "PATCH",
        }),
        invalidatesTags: ["Course"],
    }),
    deleteVideo: builder.mutation<any, string>({
        query: (id) => ({
            url: `/video/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ["Course"],
    }),
  }),
});

export const { 
    useGetMyEnrollmentsQuery, 
    useGetAllCoursesQuery,
    useGetMilestonesByCourseQuery,
    useGetVideosByMilestoneQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useCreateMilestoneMutation,
    useUpdateMilestoneMutation,
    useDeleteMilestoneMutation,
    useCreateVideoMutation,
    useUpdateVideoMutation,
    usePublishVideoMutation,
    useDeleteVideoMutation
} = courseApi;
