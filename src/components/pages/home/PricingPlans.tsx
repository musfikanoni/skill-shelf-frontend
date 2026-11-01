"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  useGetPlansQuery,
  useCreateCheckoutSessionMutation,
} from "../../../redux/api/landingPageApi/LandingPageApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import LoginRequiredModal from "../../shared/payment/LoginRequiredModal";

const CheckIcon: React.FC = () => (
  <svg
    className="w-5 h-5 text-green-500 flex-shrink-0"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="10" fill="#22c55e" opacity="0.15" />
    <path
      d="M6 10.5l2.5 2.5 5.5-5.5"
      stroke="#22c55e"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon: React.FC = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 14 14"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 1l1.545 3.09L12 4.635l-2.5 2.41.59 3.41L7 8.845l-3.09 1.61.59-3.41L2 4.635l3.455-.545L7 1z" />
  </svg>
);

const DiamondIcon: React.FC = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1L14 6L8 15L2 6L8 1Z"
      stroke="#a855f7"
      strokeWidth="1.5"
      fill="rgba(168,85,247,0.2)"
    />
  </svg>
);

interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  isPopular?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  onSelect: (id: string) => void;
  processingId: string | null;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onSelect,
  processingId,
}) => {
  const [hovered, setHovered] = useState(false);
  const isPopular = plan.name.toLowerCase().includes("pro") || plan.isPopular;
  const isProcessing = processingId === plan._id;
  const isDisabled = processingId !== null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex flex-col rounded-2xl px-8 py-8 transition-all duration-300
        ${
          isPopular
            ? "border-2 border-purple-500 shadow-2xl shadow-purple-200 scale-[1.03] bg-white z-10"
            : "border border-gray-200 bg-white shadow-md"
        }
        ${hovered && !isPopular ? "shadow-xl -translate-y-1" : ""}
      `}
      style={{ minHeight: 450 }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white text-xs font-bold px-2 md:px-4 py-1.5 rounded-full tracking-wide shadow">
            <StarIcon />
            MOST POPULAR
          </span>
        </div>
      )}

      <h3 className="text-center text-xl font-semibold text-gray-800 mb-2 mt-2">
        {plan.name}
      </h3>

      <div className="text-center mb-6">
        <span className="text-5xl font-extrabold text-gray-900">
          ${plan.price}
        </span>
        <span className="text-gray-500 text-base font-medium">
          /{plan.interval.toLowerCase()}
        </span>
      </div>

      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2.5">
            <CheckIcon />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan._id)}
        disabled={isDisabled}
        className={`
          flex justify-center items-center gap-2 w-full py-3.5 rounded-xl font-extrabold text-sm tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isPopular
              ? "bg-gradient-to-b from-[#6C3FC5] to-[#341E5F] text-white shadow-md hover:shadow-lg active:scale-95"
              : "bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-gray-900 shadow-md hover:shadow-lg active:scale-95"
          }
        `}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> PROCESSING...
          </>
        ) : (
          "SELECT PLAN"
        )}
      </button>
    </div>
  );
};

const PricingPlans: React.FC = () => {
  const pathName = usePathname();
  const { data: plansData, isLoading, error } = useGetPlansQuery({});
  const { data: userData } = useGetMeQuery({});
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isLoggedIn = userData?.success;

  const handlePurchase = async (id: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setProcessingId(id);
    try {
      const response = await createCheckoutSession({ planId: id }).unwrap();

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
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <section className="flex flex-col items-center justify-center py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-center">
          <Skeleton className="h-[450px] rounded-2xl" />
          <Skeleton className="h-[480px] rounded-2xl" />
          <Skeleton className="h-[450px] rounded-2xl" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-red-500 font-bold">Failed to load pricing plans.</p>
      </section>
    );
  }

  const plans: Plan[] = plansData?.data || [];

  return (
    <>
      <section className="flex flex-col items-center justify-center py-16 px-4">
        {pathName === "/" && (
          <>
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-600 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-5 uppercase">
              <DiamondIcon />
              Membership Plans
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 text-center">
              Choose Your Plan
            </h1>
            <p className="text-gray-500 text-md lg:text-lg mb-12 text-center">
              Select the perfect plan for your business needs
            </p>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-center">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onSelect={handlePurchase}
              processingId={processingId}
            />
          ))}
        </div>
      </section>

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default PricingPlans;
