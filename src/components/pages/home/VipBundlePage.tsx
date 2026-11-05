"use client";

import React, { useState } from "react";
import SecondaryButton from "../../shared/secondaryButton/SecondaryButton";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { toast } from "sonner";
import {
  useCreateCheckoutSessionMutation,
  useGetPlansQuery,
} from "@/redux/api/landingPageApi/LandingPageApi";
import LoginRequiredModal from "../../shared/payment/LoginRequiredModal";

export default function VipBundlePage() {
  const { data: plansData, isLoading, error } = useGetPlansQuery({});
  const { data: userData } = useGetMeQuery({});
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isLoggedIn = userData?.success;

  if (isLoading) {
    return (
      <div
        className="min-h-[450px] flex flex-col items-center justify-center px-4 py-12 md:py-16 animate-pulse"
        style={{
          background:
            "radial-gradient(ellipse at top left, #3b1a6e 0%, #1a0a3c 40%, #0f0626 100%)",
        }}
      >
        <div className="h-8 w-72 bg-amber-400/20 rounded-full mb-6" />
        <div className="h-10 w-96 max-w-full bg-purple-900/40 rounded-xl mb-4" />
        <div className="h-4 w-80 max-w-full bg-purple-900/30 rounded mb-10" />
        <div className="w-full max-w-2xl h-64 bg-purple-950/40 border border-purple-800/30 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return null;
  }

  const vipPlan = (plansData?.data || []).find(
    (plan: any) => plan.name === "VIP ALL ACCESS",
  );

  if (!vipPlan) {
    return null;
  }

  const features = vipPlan.features || [];
  const currentPrice = vipPlan.price || 0;
  const originalPrice = currentPrice + 2200;
  const savings = 2200;
  const interval =
    vipPlan.interval?.toLowerCase() === "year" ? "year" : "month";

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await createCheckoutSession({
        planId: vipPlan._id,
      }).unwrap();

      if (response.success && response.checkoutUrl) {
        window.open(response.checkoutUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Failed to retrieve checkout URL. Please try again.");
      }
    } catch (err: any) {
      console.error("Checkout session creation failed:", err);
      toast.error(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-16"
      style={{
        background:
          "radial-gradient(ellipse at top left, #3b1a6e 0%, #1a0a3c 40%, #0f0626 100%)",
      }}
    >
      <div
        className="mb-6 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 text-center max-w-[95vw]"
        style={{
          background: "linear-gradient(90deg, #f5a623 0%, #f0c040 100%)",
          color: "#1a0a3c",
        }}
      >
        <span>👑</span>
        <span className="truncate">VIP ALL-ACCESS BUNDLE – SAVE $2,000+</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center mb-4 leading-tight">
        Get Everything in One Bundle
      </h1>
      <p className="text-base sm:text-lg text-purple-200 text-center mb-8 md:mb-12 max-w-xl">
        Unlock unlimited access to 500+ products, all courses, and exclusive VIP
        content
      </p>

      {/* Card */}
      <div
        className="w-full max-w-2xl rounded-2xl p-5 sm:p-8 flex flex-col md:flex-row gap-6 md:gap-8"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {/* Left: Features */}
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg sm:text-xl mb-4 sm:mb-5">
            What&apos;s Included:
          </h2>
          <ul className="space-y-3">
            {features.map((feature: string, i: number) => (
              <li
                key={i}
                className="flex items-center gap-3 text-gray-200 text-sm"
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ border: "2px solid #f5a623" }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#f5a623"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Pricing */}
        <div className="flex-shrink-0 w-full md:w-64 rounded-2xl p-6 flex flex-col items-center text-center bg-[linear-gradient(135deg,#9810FA_0%,#E60076_100%)]">
          <p className="text-purple-100 text-sm font-medium mb-1">
            Total Value:
          </p>
          <p className="text-white text-xl sm:text-2xl font-bold line-through opacity-70 mb-1">
            ${originalPrice}
          </p>
          <p className="text-purple-100 text-sm font-medium mb-1">
            Your Price:
          </p>
          <p className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none mb-1">
            ${currentPrice}
          </p>
          <p className="text-purple-100 text-sm mb-4">/{interval}</p>

          <div
            className="w-full py-2 rounded-xl mb-4 font-bold text-white text-sm"
            style={{ background: "rgba(255,255,255,0.18)" }}
          >
            You Save ${savings}!
          </div>

          <div className="flex justify-center items-center w-full">
            <SecondaryButton
              label={isProcessing ? "Processing..." : "Get the Bundle Now"}
              onClick={handlePurchase}
              icon={isProcessing ? undefined : IoIosArrowRoundForward}
              iconPosition="right"
              disabled={isProcessing}
            />
          </div>

          <p className="text-purple-100 text-xs mt-3">
            ✓ 30-Day Money Back Guarantee
          </p>
        </div>
      </div>

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
