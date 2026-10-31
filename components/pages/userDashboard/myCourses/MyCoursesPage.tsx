"use client";

import { PlayCircle, Clock, BookOpen, Crown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useGetMyEnrollmentsQuery } from "@/redux/api/userDashboardApi/courseApi";
import Loading from "@/components/Others/Loading";

export default function MyCoursesPage() {
  const { data: enrollments, isLoading, error } = useGetMyEnrollmentsQuery();
  const enrolledCourses = enrollments?.data || [];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to fetch courses</p>
      </div>
    );
  }

  if (!enrolledCourses.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">No courses found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10 px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B]">
            My Courses
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-400">
            Continue your learning journey
          </p>
        </div>
        <Badge className="w-fit bg-[#F5F3FF] text-[#8B5CF6] hover:bg-[#F5F3FF] border-none font-bold px-4 py-1.5 rounded-lg text-xs md:text-sm">
          {enrolledCourses.length} Course
          {enrolledCourses.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <Separator className="bg-[#6B7280] opacity-10" />

      {/* Course List */}
      <div className="space-y-4 md:space-y-6">
        {enrolledCourses.map((enrolledCourse) => {
          const courseData = enrolledCourse.course;
          const formatDuration = (seconds: number) => {
            if (!seconds) return "0 mins";
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            return h > 0 ? `${h}h ${m}m` : `${m}m`;
          };

          return (
            <Card
              key={enrolledCourse._id}
              className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-2xl p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                {/* Course Image */}
                <div className="h-48 sm:h-56 lg:h-48 lg:w-72 shrink-0 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={
                      courseData?.thumbnail ||
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    }
                    alt={courseData?.title?.replace(/(^"|"$)/g, "") || "Course"}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Course Details */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Badge
                      className={`bg-[#F5F3FF] text-[#8B5CF6] hover:bg-opacity-80 border-none font-bold px-3 py-1 rounded-md text-[10px]`}
                    >
                      Course
                    </Badge>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold text-[#1E293B] leading-tight">
                      {courseData?.title?.replace(/(^"|"$)/g, "") ||
                        "Untitled Course"}
                    </h3>
                    <p className="text-slate-400 font-medium text-xs md:text-sm">
                      {courseData?.description?.replace(/(^"|"$)/g, "") ||
                        "No description available"}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span className="text-[10px] md:text-xs font-bold">
                        {formatDuration(enrolledCourse.totalDuration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      <span className="text-[10px] md:text-xs font-bold">
                        {enrolledCourse.totalVideos || 0} lessons
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] md:text-xs font-bold text-[#1E293B]">
                        Progress
                      </span>
                      <span className="text-[10px] md:text-xs font-bold text-[#6C3FC5]">
                        {enrolledCourse.progress || 0}%
                      </span>
                    </div>
                    <Progress
                      value={enrolledCourse.progress || 0}
                      className="h-1.5 md:h-2 bg-slate-100 [&>div]:bg-[#6C3FC5]"
                    />
                  </div>

                  {/* CTA Button */}
                  <div className="pt-2">
                    <Button className="w-full sm:w-auto bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:opacity-90 text-black font-extrabold rounded-xl h-11 px-6 shadow-sm shadow-yellow-100 gap-2">
                      <PlayCircle className="h-5 w-5" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upgrade Banner */}
      <div className="relative bg-[#6C3FC5] rounded-2xl md:rounded-3xl p-6 md:p-12 overflow-hidden shadow-lg shadow-indigo-100 mt-8 md:mt-12">
        <div className="relative z-10 space-y-4 md:space-y-6 max-w-2xl">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-6 w-6 md:h-7 md:w-7 flex items-center justify-center">
              <Crown className="h-5 w-5 md:h-6 md:w-6 text-yellow-400" />
            </div>
            <Badge className="bg-yellow-400 text-[#1E293B] hover:bg-yellow-400 border-none font-extrabold px-2 md:px-3 py-1 rounded-md text-[9px] md:text-[10px] uppercase tracking-wider">
              VIP ACCESS
            </Badge>
          </div>

          <div className="space-y-1 md:space-y-2">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Want More Courses?
            </h2>
            <p className="text-white/80 font-medium text-sm md:text-lg">
              Upgrade to VIP for unlimited access to all 50+ premium courses
            </p>
          </div>

          <Link href={"/user-dashboard/membership"}>
            <Button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-[#1E293B] font-extrabold rounded-xl px-6 md:px-8 h-11 md:h-12 shadow-xl flex items-center justify-center gap-2 group transition-all text-sm md:text-base">
              Upgrade Now
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
