"use client";

import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Loading from "@/components/Others/Loading";
import {
  useCreateSubscriptionCheckoutMutation,
  useGetMySubscriptionQuery,
} from "@/redux/api/userDashboardApi/subscriptionApi";
import { useGetAllPlanQuery } from "@/redux/api/userDashboardApi/planApi";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  buttonText: string;
}

const PricingCard = ({
  plan,
  onCheckout,
  isLoading,
}: {
  plan: PricingPlan;
  onCheckout: (planId: string) => void;
  isLoading: boolean;
}) => {
  const isPro = plan.name.toLowerCase().includes("pro");
  const isVip = plan.name.toLowerCase().includes("vip");

  return (
    <div
      className={`relative flex flex-col bg-white rounded-2xl p-8 shadow-sm border-2 transition-all duration-300 ${
        isPro ? "border-indigo-500 md:scale-105 z-10" : "border-transparent"
      }`}
    >
      {plan.isPopular && (
        <div className="absolute top-0 left-0 right-0 bg-[#6C3FC5] text-white text-[10px] font-bold uppercase py-1.5 rounded-t-xl text-center tracking-widest">
          Most Popular
        </div>
      )}

      <div className={plan.isPopular ? "mt-4" : ""}>
        <h4 className="text-xl font-bold text-slate-800 mb-4">{plan.name}</h4>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-extrabold text-slate-900">
            ${plan.price}
          </span>
          <span className="text-gray-400 text-sm">/{plan.interval}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {plan.features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-sm text-slate-600 leading-tight"
          >
            <div className="mt-0.5 bg-green-50 rounded-full p-0.5 flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-green-500 stroke-[3px]" />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        disabled={plan.isCurrentPlan || isLoading}
        onClick={() => onCheckout(plan.id)}
        className={`w-full py-6 rounded-xl font-bold text-sm transition-colors ${
          plan.isCurrentPlan
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : isVip
              ? "bg-[#6C3FC5] text-white hover:bg-[#6C3FC5]/90 shadow-md"
              : "bg-gray-100 text-slate-700 hover:bg-gray-200"
        }`}
      >
        {isLoading ? "Processing..." : plan.buttonText}
      </Button>
    </div>
  );
};

export default function MembershipPage() {
  const { data, isLoading, isError } = useGetAllPlanQuery();
  const [createSubscriptionCheckout, { isLoading: isCheckoutLoading }] =
    useCreateSubscriptionCheckoutMutation();

  const { data: mySubscriptionData, isLoading: isSubscriptionLoading } =
    useGetMySubscriptionQuery(undefined);

  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    const selectedPlan = plans.find((p: any) => p._id === planId);
    if (
      selectedPlan &&
      activePlanName &&
      selectedPlan.name.toLowerCase() === activePlanName.toLowerCase()
    ) {
      toast.info(
        `You already have an active subscription for ${selectedPlan.name} until ${nextBillingDate}. You can't purchase the same plan again before it expires.`,
      );
      return;
    }

    try {
      setProcessingPlanId(planId);
      const res = await createSubscriptionCheckout({ planId }).unwrap();
      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to initiate checkout. Please try again.",
      );
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (isLoading || isSubscriptionLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl border p-8 text-center">
        <p className="text-red-500 font-medium">
          Failed to load membership plans. Please try again later.
        </p>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl border p-8 text-center">
        <p className="text-slate-500 font-medium">No plans found</p>
      </div>
    );
  }

  const plans = data?.data || [];

  const subscription = mySubscriptionData?.data;
  const isStatusActive = subscription?.status?.toUpperCase() === "ACTIVE";

  let activePlanName: string | null = null;
  if (isStatusActive && subscription?.plan) {
    if (typeof subscription.plan === "object" && subscription.plan?.name) {
      activePlanName = subscription.plan.name;
    } else {
      const planId =
        typeof subscription.plan === "string"
          ? subscription.plan
          : (subscription.plan as any)?._id;
      const matched = plans.find((p: any) => p._id === planId);
      activePlanName = matched?.name || null;
    }
  }

  const subscriptionStatus = isStatusActive
    ? "Active"
    : subscription?.status
      ? subscription.status.charAt(0).toUpperCase() +
        subscription.status.slice(1).toLowerCase()
      : "No Active Plan";

  let nextBillingDate = "N/A";
  if (subscription?.currentPeriodEnd) {
    const date = new Date(subscription.currentPeriodEnd);
    if (!isNaN(date.getTime())) {
      nextBillingDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  const mappedPlans: PricingPlan[] = plans.map((plan: any) => {
    const planNameLower = plan.name.toLowerCase();
    const isPro = planNameLower.includes("pro");
    const isVip = planNameLower.includes("vip");
    const isCurrentPlan = activePlanName
      ? activePlanName.toLowerCase() === planNameLower
      : false;

    let buttonText = "Select Plan";
    if (isCurrentPlan) buttonText = "Current Plan";
    else if (isVip) buttonText = "Upgrade to VIP";

    return {
      id: plan._id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency === "USD" ? "$" : plan.currency,
      interval: (plan.interval ? plan.interval.toLowerCase() : "month") as
        | "month"
        | "year",
      features: plan.features || [],
      isPopular: isPro,
      isCurrentPlan: isCurrentPlan,
      buttonText,
    };
  });

  return (
    <div className="bg-gray-50 font-sans">
      <div>
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Manage Membership
            </h1>
            <p className="text-gray-500 text-sm max-w-lg">
              Tailor your workspace experience by choosing the plan that best
              fits your organizational needs. Upgrade or downgrade at any time.
            </p>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden w-full bg-gradient-to-b from-[#6C3FC5] via-[#6C3FC5] to-[#341E5F] rounded-2xl p-10 md:p-16 text-center text-white mb-16 shadow-xl shadow-indigo-200/50">
          <div className="relative z-10">
            <Crown className="w-14 h-14 mx-auto mb-6 text-white opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
              Choose Your Membership Plan
            </h2>
            <p className="text-indigo-100 text-lg opacity-90">
              Get unlimited access to premium PLR products and courses
            </p>
          </div>
          {/* Decorative background circle */}
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-2">
          {mappedPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onCheckout={handleCheckout}
              isLoading={isCheckoutLoading && processingPlanId === plan.id}
            />
          ))}
        </div>

        {/* Current Subscription Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">
            Current Subscription
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-1">
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                Plan
              </p>
              <p className="text-lg font-bold text-slate-800">
                {activePlanName || "None"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                Status
              </p>
              <p
                className={`text-lg font-bold ${isStatusActive ? "text-green-500" : "text-slate-500"}`}
              >
                {subscriptionStatus}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                Next Billing Date
              </p>
              <p className="text-lg font-bold text-slate-800">
                {nextBillingDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
