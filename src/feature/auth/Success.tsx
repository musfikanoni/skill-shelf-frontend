"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthBackground from "@/components/shared/auth/AuthBackground";
import { useVerifyPaymentSessionMutation } from "@/redux/api/landingPageApi/LandingPageApi";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [verifyPaymentSession, { isLoading }] =
    useVerifyPaymentSessionMutation();
  const [verifiedType, setVerifiedType] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (sessionId) {
      verifyPaymentSession(sessionId)
        .unwrap()
        .then((res: any) => {
          if (res?.data?.type) {
            setVerifiedType(res.data.type);
          }
          setIsDone(true);
        })
        .catch((err) => {
          console.error("Verification error:", err);
          setIsDone(true);
        });
    } else {
      setIsDone(true);
    }
  }, [sessionId, verifyPaymentSession]);

  return (
    <AuthBackground>
      <div className="max-w-[560px] w-full mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl flex flex-col items-center">
        {/* Yellow Circle with Shield */}
        <div className="relative mb-6 mt-2">
          <div className="w-24 h-24 md:w-[100px] md:h-[100px] rounded-full bg-gradient-to-b from-[#F5C518] to-[#FF8C00] flex items-center justify-center shadow-[0_4px_14px_0_rgba(245,197,24,0.39)] relative z-10">
            {isLoading ? (
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            ) : (
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm4.7 8.7l-5.7 5.7c-.4.4-1 .4-1.4 0l-2.6-2.6c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.9 1.9 5-5c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4z" />
              </svg>
            )}
          </div>

          <div className="absolute top-[-5px] right-[-15px] w-2.5 h-2.5 bg-[#F5C518] rounded-full"></div>
          <div className="absolute top-[5px] left-[-20px] w-3 h-3 bg-[#F5C518] rounded-full"></div>
          <div className="absolute bottom-[-5px] left-[5px] w-2 h-2 bg-[#F5C518] rounded-full"></div>
        </div>

        {/* Text content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-[28px] font-bold text-[#2D2D2D] mb-2">
            {isLoading ? "Verifying Payment..." : "Congratulations!"}
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#6B7280]">
            {isLoading
              ? "Please wait while we confirm your payment and activate your access..."
              : "Your payment has been successfully verified and your account is ready."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          {verifiedType === "COURSE" ? (
            <Link href="/user-dashboard/my-courses" className="w-full sm:w-auto">
              <button className="w-full text-black font-bold rounded-xl bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] px-6 py-3 cursor-pointer hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2">
                Go to My Courses
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          ) : verifiedType === "SUBSCRIPTION" ? (
            <Link href="/user-dashboard/membership" className="w-full sm:w-auto">
              <button className="w-full text-black font-bold rounded-xl bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] px-6 py-3 cursor-pointer hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2">
                View Membership
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <Link href="/user-dashboard/my-orders" className="w-full sm:w-auto">
              <button className="w-full text-black font-bold rounded-xl bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] px-6 py-3 cursor-pointer hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2">
                Go to My Orders
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}

          <Link href="/user-dashboard" className="w-full sm:w-auto">
            <button className="w-full text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 px-6 py-3 cursor-pointer transition-all">
              Dashboard
            </button>
          </Link>
        </div>
      </div>
    </AuthBackground>
  );
}
