"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetBundleByIdQuery, useCreateBundleCheckoutMutation } from "@/redux/api/landingPageApi/LandingPageApi";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import LoginRequiredModal from "@/components/shared/payment/LoginRequiredModal";
import Loading from "@/components/Others/Loading";


function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className={`w-4 h-4 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)} ({count} reviews)</span>
        </div>
    );
}

function CheckIcon({ className = "" }: { className?: string }) {
    return (
        <svg className={`w-4 h-4 flex-shrink-0 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

export default function BundleDetails({ id }: { id: string }) {
    const router = useRouter();
    const { data: userData } = useGetMeQuery({});
    const [createBundleCheckout] = useCreateBundleCheckoutMutation();
    const { data: bundleData, isLoading, error } = useGetBundleByIdQuery(id, {
        skip: !id,
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const bundle = bundleData?.data;
    const isLoggedIn = !!userData?.data;

    const handlePurchase = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        setIsProcessing(true);
        try {
            const response = await createBundleCheckout({ bundleId: bundle._id }).unwrap();

            if (response.success && response.data?.checkoutUrl) {
                window.open(response.data.checkoutUrl, "_blank", "noopener,noreferrer");
            } else if (response.success && response.checkoutUrl) {
                window.open(response.checkoutUrl, "_blank", "noopener,noreferrer");
            } else {
                toast.error("Failed to retrieve checkout URL. Please try again.");
            }
        } catch (err: any) {
            console.error("Bundle checkout failed:", err);
            toast.error(err?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <Loading title="Loading Bundle Details" message="Fetching bundle information..." />;
    }

    if (error || !bundle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-bold mb-2">Bundle not found or failed to load.</p>
                    <button onClick={() => router.back()} className="text-blue-500 underline">Go Back</button>
                </div>
            </div>
        );
    }

    const items = [...(bundle.products || []), ...(bundle.courses || [])];
    
    // Calculate original price from items for real data feel
    const calculatedOriginalPrice = items.reduce((acc, item) => {
        const price = typeof item.price === 'number' ? item.price : (item.price?.basic || item.price?.pro || item.price?.vip || 0);
        return acc + price;
    }, 0) || (bundle.price * 1.5);

    const savings = Math.max(0, calculatedOriginalPrice - bundle.price);

    // Calculate aggregate ratings from items since bundle itself might not have them
    const avgRating = bundle.averageRating || (items.length > 0 
        ? items.reduce((acc: number, item: any) => acc + (item.averageRating || 0), 0) / items.length 
        : 0);
    const totalReviews = bundle.totalReviews || items.reduce((acc: number, item: any) => acc + (item.totalReviews || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden">

                {/* TOP SECTION */}
                <div className="flex flex-col sm:flex-row gap-8 p-8 border-b border-gray-100">
                    {/* Image */}
                    <div className="w-full sm:w-[350px] aspect-square bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-inner">
                        <Image
                            src={bundle.products?.[0]?.images?.[0] || bundle.courses?.[0]?.thumbnail || "/images/pageHeaderImg/courseImg.png"}
                            width={350}
                            height={350}
                            alt={bundle.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1">
                                Premium Digital Bundle
                            </p>
                            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">{bundle.name}</h1>
                            <StarRating rating={avgRating || 0} count={totalReviews || 0} />

                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide">About this bundle</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {bundle.description || "Get exclusive access to this curated selection of premium digital assets and courses in one high-value bundle."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-black text-violet-600">${bundle.price}</span>
                                <span className="text-sm text-gray-400 line-through">${calculatedOriginalPrice.toFixed(0)}</span>
                            </div>
                            <p className="text-xs font-bold text-green-600 mb-4">You save ${savings.toFixed(0)} today!</p>

                            {/* CTA */}
                            <button
                                onClick={handlePurchase}
                                disabled={isProcessing}
                                className="cursor-pointer flex justify-center items-center gap-2 w-full py-4 rounded-xl bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-gray-900 font-extrabold text-sm tracking-widest transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase">
                                {isProcessing ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> PROCESSING...</>
                                ) : (
                                    `Buy Bundle Now · $${bundle.price}`
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="flex items-center gap-6 mt-4 justify-center">
                                {[
                                    { icon: "🔒", text: "Secure Payment" },
                                    { icon: "↩️", text: "Life-time Access" },
                                    { icon: "⚡", text: "Instant Delivery" },
                                ].map(({ icon, text }) => (
                                    <span key={text} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase">
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
                        <h2 className="text-xl font-bold text-gray-900 mb-1">What&apos;s Included</h2>
                        <p className="text-xs text-gray-500 mb-5">Everything you get in this package</p>
                        
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item: any) => (
                                <div key={item._id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-violet-200 transition-all group">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-sm">
                                        <img 
                                            src={item.images?.[0] || item.thumbnail || "/images/pageHeaderImg/courseImg.png"} 
                                            alt={item.name || item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900 truncate">{item.name || item.title}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="w-3 h-3 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckIcon className="text-green-600 w-2 h-2" />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Included</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No specific items listed in this bundle.</p>
                            )}
                        </div>
                    </div>

                    {/* Guarantee & Features */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold mb-2">30-Day Money Back Guarantee</h3>
                            <p className="text-xs text-violet-100 leading-relaxed">
                                Your satisfaction is our top priority. If you feel this bundle isn&apos;t right for you, we offer a full refund within 30 days of purchase.
                            </p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Bundle Value</h4>
                            <div className="space-y-3">
                                {[
                                    "Save significantly with one-time payment",
                                    "Lifetime access to all future updates",
                                    "Downloadable resources for offline use",
                                    "Priority support for bundle customers"
                                ].map((benefit) => (
                                    <div key={benefit} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <CheckIcon className="text-green-600 w-3 h-3" />
                                        </div>
                                        <span className="text-xs text-gray-700 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {showLoginModal && (
                <LoginRequiredModal
                    onClose={() => setShowLoginModal(false)}
                />
            )}
        </div>
    );
}
