"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import {
  useGetProductByIdQuery,
  useCreateOrderCheckoutMutation,
} from "@/redux/api/landingPageApi/LandingPageApi";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { useGetMySubscriptionQuery } from "@/redux/api/userDashboardApi/subscriptionApi";
import { useGetMyOrdersQuery } from "@/redux/api/userDashboardApi/ordersApi";
import { useGetAllPurchasedProductQuery } from "@/redux/api/userDashboardApi/productApi";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import Loading from "@/components/Others/Loading";
import LoginRequiredModal from "@/components/shared/payment/LoginRequiredModal";
import PlanRestrictionModal from "@/components/shared/payment/PlanRestrictionModal";
import { getProductCategoryName } from "@/constants/productCategory";
import PageTitle from "@/components/shared/PageTitle";

const packages = [
  {
    id: "basic",
    name: "Basic",
    features: ["Product Files", "Basic Commercial Rights", "Email Support"],
    priceKey: "basic",
  },
  {
    id: "pro",
    name: "Pro",
    features: [
      "Everything In Basic",
      "Premium Templates",
      "Priority Support",
      "Commercial License",
    ],
    priceKey: "pro",
  },
  {
    id: "vip",
    name: "VIP",
    features: [
      "Everything In Pro",
      "Done-For-You Marketing",
      "Private Coaching",
      "Reseller Rights",
    ],
    priceKey: "vip",
  },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
  const safeRating = Math.min(5, Math.max(0, Number(rating) || 0));
  const reviewCount = Number(count) || 0;

  return (
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= Math.round(safeRating) && safeRating > 0 ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">
        {safeRating > 0 ? safeRating.toFixed(1) : "0.0"} ({reviewCount} reviews)
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

export default function SEOToolkitBundle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [selected, setSelected] = useState("basic");
  const { data: userData } = useGetMeQuery({});
  const isLoggedIn = !!userData?.data;

  const { data: mySubscriptionData } = useGetMySubscriptionQuery(undefined, {
    skip: !isLoggedIn,
  });

  const { data: purchasedProductsData } = useGetAllPurchasedProductQuery(
    undefined,
    {
      skip: !isLoggedIn,
    },
  );

  const { data: ordersData } = useGetMyOrdersQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [createOrderCheckout] = useCreateOrderCheckoutMutation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    open: boolean;
    title: string;
    message: string;
    currentPlan?: string | null;
    targetPlan?: string | null;
    actionType?: "upgrade" | "downloads" | "none";
  } | null>(null);

  const {
    data: productData,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  const product = productData?.data?.data || productData?.data;

  // Detect user's active membership plan
  const activeSubscription = mySubscriptionData?.data;
  const isActiveSubscriber =
    activeSubscription?.status?.toUpperCase() === "ACTIVE";
  const rawPlanName = (activeSubscription?.plan?.name || "").toLowerCase();

  const userPlan: "pro" | "vip" | "basic" | null = useMemo(() => {
    if (!isActiveSubscriber) return null;
    if (rawPlanName.includes("vip")) return "vip";
    if (rawPlanName.includes("pro")) return "pro";
    if (rawPlanName.includes("basic")) return "basic";
    return null;
  }, [isActiveSubscriber, rawPlanName]);

  // Check if user has already purchased this product
  const isAlreadyPurchased = useMemo(() => {
    if (!productId || !isLoggedIn) return false;

    // 1. Check purchased products list from /product/my-all-product
    const purchasedList = Array.isArray(purchasedProductsData?.data)
      ? purchasedProductsData.data
      : [];
    const inPurchased = purchasedList.some((p: any) => {
      const id = p?._id || p?.id;
      return id?.toString() === productId?.toString();
    });
    if (inPurchased) return true;

    // 2. Check my orders list from /order/my-orders
    const ordersList = Array.isArray(ordersData?.data) ? ordersData.data : [];
    const inOrders = ordersList.some((order: any) => {
      const orderProdId =
        order?.product?._id ||
        order?.product?.id ||
        order?.product ||
        order?.itemId;
      const isPaid =
        order?.status === "PAID" ||
        order?.status === "paid" ||
        order?.isPurchased === true;
      return orderProdId?.toString() === productId?.toString() && isPaid;
    });
    if (inOrders) return true;

    return false;
  }, [purchasedProductsData, ordersData, productId, isLoggedIn]);

  // Auto-select package according to user's active membership plan
  useEffect(() => {
    if (userPlan) {
      setSelected(userPlan);
    } else {
      setSelected("basic");
    }
  }, [userPlan]);

  const isPackageLocked = (pkgId: string) => {
    if (pkgId === "basic") return false;
    if (pkgId === "pro") return userPlan !== "pro" && userPlan !== "vip";
    if (pkgId === "vip") return userPlan !== "vip";
    return false;
  };

  // Handle package selection
  const handlePackageSelect = (pkgId: string) => {
    // Basic is always open
    if (pkgId === "basic") {
      setSelected("basic");
      return;
    }

    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // Check if package is locked for current user
    if (isPackageLocked(pkgId)) {
      const targetName = pkgId.toUpperCase();
      if (userPlan === "pro" && pkgId === "vip") {
        setAlertInfo({
          open: true,
          title: "VIP Membership Required",
          message:
            "You currently have an active Pro Membership. You can't purchase the VIP package with your current membership. Please upgrade your membership to VIP first.",
          currentPlan: userPlan,
          targetPlan: pkgId,
          actionType: "upgrade",
        });
      } else {
        setAlertInfo({
          open: true,
          title: `${targetName} Membership Required`,
          message: `The ${targetName} package requires an active ${targetName} Membership. Please subscribe to or upgrade your membership plan to purchase this package.`,
          currentPlan: userPlan,
          targetPlan: pkgId,
          actionType: "upgrade",
        });
      }
      toast.error(`Active ${targetName} Membership required for this package.`);
      return;
    }

    setSelected(pkgId);
  };

  const handlePurchase = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // If product already purchased, block with alert modal immediately
    if (isAlreadyPurchased) {
      setAlertInfo({
        open: true,
        title: "Product Already Purchased",
        message:
          "You have already purchased this product. A product can only be purchased once. Please visit your dashboard to access and download your product files.",
        actionType: "downloads",
      });
      toast.error("You have already purchased this product.");
      return;
    }

    // Validate plan accessibility
    if (isPackageLocked(selected)) {
      const targetName = selected.toUpperCase();
      setAlertInfo({
        open: true,
        title: "Membership Plan Restriction",
        message: `You can't purchase the ${targetName} package with your current membership status. Please select Basic or upgrade your membership.`,
        currentPlan: userPlan,
        targetPlan: selected,
        actionType: "upgrade",
      });
      toast.error(
        `can't purchase ${targetName} package without required membership.`,
      );
      return;
    }

    setIsProcessing(true);
    try {
      const response = await createOrderCheckout({
        productId: product._id,
        planType: selected,
        quantity: 1,
      }).unwrap();

      if (response.success && response.data?.checkoutUrl) {
        window.open(response.data.checkoutUrl, "_blank", "noopener,noreferrer");
      } else if (response.success && response.checkoutUrl) {
        window.open(response.checkoutUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Failed to retrieve checkout URL. Please try again.");
      }
    } catch (err: any) {
      console.error("Order checkout failed:", err);
      const errMsg =
        err?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      if (errMsg.toLowerCase().includes("already purchased")) {
        setAlertInfo({
          open: true,
          title: "Product Already Purchased",
          message:
            "You have already purchased this product. You can't purchase it again. Please visit your dashboard downloads to access your files.",
          actionType: "downloads",
        });
      }
      toast.error(errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Loading
        title="Loading Product Details"
        message="Fetching the best offers for you..."
      />
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-2">
            Product not found or failed to load.
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

  // Map API prices to packages
  const getPrice = (key: string) => {
    if (typeof product.price === "number") return product.price;
    return product.price?.[key] || 0;
  };

  const selectedPkgPrice = getPrice(selected);

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4 font-sans">
      <PageTitle title={product.name} />
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 p-4 sm:p-6 md:p-8 border-b border-gray-100">
          {/* Image */}
          <div className="w-full sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-square max-w-[320px] sm:max-w-none mx-auto md:mx-0 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
            <Image
              src={
                product.images?.[0] ||
                "/images/seoToolkitImg/seoToolkitImg1.png"
              }
              width={450}
              height={450}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {(() => {
              const catName = getProductCategoryName(product.category);
              if (!catName || catName.toLowerCase().includes("digital") || catName.toLowerCase() === "uncategorized") return null;
              return (
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">
                  {catName}
                </p>
              );
            })()}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <StarRating
              rating={product.averageRating || 0}
              count={product.totalReviews || 0}
            />

            {/* Already Purchased Notice */}
            {isAlreadyPurchased && (
              <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold">
                <div className="flex items-start sm:items-center gap-2 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="leading-snug">
                    You have already purchased this product. You can't purchase
                    it again.
                  </span>
                </div>
                <button
                  onClick={() => router.push("/user-dashboard/downloads")}
                  className="text-amber-800 underline hover:text-amber-950 font-bold cursor-pointer whitespace-nowrap shrink-0 self-end sm:self-auto"
                >
                  Downloads &rarr;
                </button>
              </div>
            )}

            {/* Package Selector */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">
                  Choose Your Package:
                </p>
                {userPlan && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Active: {userPlan.toUpperCase()} Member
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {packages.map((pkg) => {
                  const isUserActivePlan = userPlan === pkg.id;
                  const locked = isPackageLocked(pkg.id);

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg.id)}
                      className={`relative flex items-start justify-between w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                        selected === pkg.id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : locked
                            ? "border-gray-200 bg-gray-50/70 hover:border-amber-300"
                            : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                            selected === pkg.id
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selected === pkg.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">
                              {pkg.name}
                            </p>
                            {isUserActivePlan && (
                              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                Your Plan
                              </span>
                            )}
                            {pkg.id === "basic" && (
                              <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                Open to All
                              </span>
                            )}
                            {locked && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                <Lock className="w-2.5 h-2.5" />
                                Locked
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1">
                            {pkg.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap"
                              >
                                {idx > 0 && (
                                  <span className="text-gray-300 select-none">•</span>
                                )}
                                <span>{feature}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-base font-bold ml-3 flex-shrink-0 ${selected === pkg.id ? "text-blue-600" : "text-gray-700"}`}
                      >
                        ${getPrice(pkg.priceKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            {isAlreadyPurchased ? (
              <button
                onClick={() => router.push("/user-dashboard/downloads")}
                className="cursor-pointer flex items-center justify-center gap-2 mt-4 w-full py-3.5 px-3 sm:px-4 rounded-xl bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-gray-900 font-black text-[11px] min-[390px]:text-xs md:text-sm tracking-tight min-[390px]:tracking-normal transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 uppercase text-center"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span className="text-center leading-tight">
                  Already Purchased · Access in Dashboard
                </span>
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="cursor-pointer flex items-center justify-center gap-2 mt-4 w-full py-3.5 px-4 rounded-xl bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-gray-900 font-extrabold text-xs sm:text-sm tracking-wide sm:tracking-wider transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase text-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" /> PROCESSING...
                  </>
                ) : (
                  `Buy Now · $${selectedPkgPrice}`
                )}
              </button>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 justify-center">
              {[
                { icon: "🔒", text: "Secure Payment" },
                { icon: "↩️", text: "30-Day Money Back" },
                { icon: "⚡", text: "Instant Access" },
              ].map(({ icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1 text-xs text-gray-400"
                >
                  <span>{icon}</span> {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Product Overview */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Product Overview
            </h2>
            <p className="text-xs text-gray-500 mb-3">
              Everything you need for success
            </p>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Key Features
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {(
                product.features || [
                  "10 SEO Tools",
                  "5 Training videos",
                  "3 eBooks",
                  "Templates",
                ]
              ).map((label: string) => (
                <div key={label} className="flex items-center gap-1.5">
                  <CheckIcon className="text-green-500" />
                  <span className="text-xs text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            {/* Full PLR Rights */}
            <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <CheckIcon className="text-white w-3.5 h-3.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-snug">
                    Full Commercial Rights Included
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    Use these products to build your business
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {[
                  "Resell with 100% profit",
                  "Edit and rebrand",
                  "Use for client work",
                  "Include in bundles",
                ].map((label) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <CheckIcon className="text-green-500" />
                    <span className="text-xs text-gray-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-violet-600 rounded-2xl p-5 text-white flex flex-col gap-2 h-fit">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-1">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold leading-tight">
                Money Back Guarantee
              </h3>
              <p className="text-xs text-violet-200 leading-relaxed">
                Try it risk-free for 30 days. If you&apos;re not satisfied,
                we&apos;ll refund your purchase.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}

      {alertInfo?.open && (
        <PlanRestrictionModal
          onClose={() => setAlertInfo(null)}
          title={alertInfo.title}
          message={alertInfo.message}
          currentPlan={alertInfo.currentPlan}
          targetPlan={alertInfo.targetPlan}
          actionType={alertInfo.actionType}
        />
      )}
    </div>
  );
}
