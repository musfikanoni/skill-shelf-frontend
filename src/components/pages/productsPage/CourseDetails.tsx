"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetCourseByIdQuery,
  useCreateEnrollmentCheckoutMutation,
} from "@/redux/api/landingPageApi/LandingPageApi";
import PageLoading from "../../Others/Loading";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import LoginRequiredModal from "../../shared/payment/LoginRequiredModal";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">
        {rating} ({count} reviews)
      </span>
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 flex-shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function CourseDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: userData } = useGetMeQuery({});
  const [createEnrollmentCheckout] = useCreateEnrollmentCheckoutMutation();
  const {
    data: courseData,
    isLoading,
    error,
  } = useGetCourseByIdQuery(id, {
    skip: !id,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const course = courseData?.data?.data || courseData?.data;
  const isLoggedIn = !!userData?.data;

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await createEnrollmentCheckout({
        courseId: course._id,
      }).unwrap();

      if (response.success && response.checkoutUrl) {
        window.open(response.checkoutUrl, "_blank", "noopener,noreferrer");
      } else if (response.success && response.data?.checkoutUrl) {
        window.open(response.data.checkoutUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Failed to retrieve checkout URL. Please try again.");
      }
    } catch (err: any) {
      console.error("Enrollment checkout failed:", err);
      toast.error(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <PageLoading
        title="Loading Course Details"
        message="Fetching course information..."
      />
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-2">
            Course not found or failed to load.
          </p>
          <button
            onClick={() => router.back()}
            className="text-blue-500 underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden">
        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row gap-8 p-8 border-b border-gray-100">
          <div className="w-full sm:w-[400px] aspect-video sm:aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
            <Image
              src={course.thumbnail || "/images/pageHeaderImg/courseImg.png"}
              width={400}
              height={400}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-2">
                {course.category?.name || "Online Course"}
              </p>
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                {course.title}
              </h1>
              <StarRating
                rating={course.averageRating || 0}
                count={course.totalReviews || 0}
              />

              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">
                  About this course
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {course.description ||
                    "No description available for this course."}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black text-violet-600">
                  ${course.price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${course.price + 100}
                </span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="cursor-pointer flex justify-center items-center gap-2 w-full py-4 rounded-xl bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-gray-900 font-extrabold text-sm tracking-widest transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> PROCESSING...
                  </>
                ) : (
                  `Enroll Now · $${course.price}`
                )}
              </button>

              <div className="flex items-center gap-6 mt-4 justify-center">
                {[
                  { icon: "🔒", text: "Secure Payment" },
                  { icon: "↩️", text: "Life-time Access" },
                  { icon: "⚡", text: "Certificate" },
                ].map(({ icon, text }) => (
                  <span
                    key={text}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase"
                  >
                    <span>{icon}</span> {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Course Highlights
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Master the skills with expert guidance
            </p>

            <div className="space-y-4">
              {[
                "Comprehensive video lessons",
                "Hands-on projects and assignments",
                "Exclusive community access",
                "Downloadable resources and templates",
                "One-on-one mentor support",
                "Industry-recognized certificate",
              ].map((label: string) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="text-green-600 w-3 h-3" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Accelerate Your Learning
              </h3>
              <p className="text-xs text-violet-100 leading-relaxed">
                Our structured curriculum is designed to take you from beginner
                to advanced in the shortest time possible.
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-lg">⭐</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    4.9/5 Average Rating
                  </p>
                  <p className="text-xs text-gray-500">
                    Trusted by 10,000+ students worldwide
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
