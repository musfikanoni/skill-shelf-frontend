"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGetProductByIdQuery, useCreateOrderCheckoutMutation } from "@/redux/api/landingPageApi/LandingPageApi";
import PageLoading from "../Others/Loading";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import LoginRequiredModal from "../shared/payment/LoginRequiredModal";
// import LoginRequiredModal from "../subscription/payment/LoginRequiredModal";

const packages = [
    {
        id: "basic",
        name: "Basic",
        description: "Product Files • Basic PLR Rights • Email Support",
        priceKey: "basic",
    },
    {
        id: "pro",
        name: "Pro",
        description:
            "Everything In Basic • Premium Templates • Priority Support • Commercial License",
        priceKey: "pro",
    },
    {
        id: "vip",
        name: "VIP",
        description:
            "Everything In Pro • Done-For-You Marketing • Private Coaching • Reseller Rights",
        priceKey: "vip",
    },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className={`w-4 h-4 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">{rating} ({count} reviews)</span>
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

export default function SEOToolkitBundle() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");
    const [selected, setSelected] = useState("basic");
    const { data: userData } = useGetMeQuery({});
    const [createOrderCheckout] = useCreateOrderCheckoutMutation();

    const [isProcessing, setIsProcessing] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const { data: productData, isLoading, error } = useGetProductByIdQuery(productId, {
        skip: !productId,
    });

    const product = productData?.data?.data || productData?.data;
    const isLoggedIn = !!userData?.data;

    const handlePurchase = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        setIsProcessing(true);
        try {
            const response = await createOrderCheckout({ 
                productId: product._id,
                planType: selected,
                quantity: 1 
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
            toast.error(err?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return <PageLoading title="Loading Product Details" message="Fetching the best offers for you..." />;
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-bold mb-2">Product not found or failed to load.</p>
                    <button onClick={() => router.back()} className="text-blue-500 underline">Go Back</button>
                </div>
            </div>
        );
    }

    // Map API prices to packages
    const getPrice = (key: string) => {
        if (typeof product.price === 'number') return product.price;
        return product.price?.[key] || 0;
    };

    const selectedPkgPrice = getPrice(selected);

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4 font-sans">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md overflow-hidden">

                {/* TOP SECTION */}
                <div className="flex flex-col sm:flex-row gap-5 p-6 border-b border-gray-100">
                    {/* Image */}
                    <div className="w-[300px] h-[300px] bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center">
                        <Image
                            src={product.images?.[0] || "/images/seoToolkitImg/seoToolkitImg1.png"}
                            width={300}
                            height={300}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">
                            {product.category?.name || 'Bundles'}
                        </p>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                        <StarRating rating={product.averageRating || 5} count={product.totalReviews || 423} />

                        {/* Package Selector */}
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Choose Your Package:</p>
                            <div className="space-y-2">
                                {packages.map((pkg) => (
                                    <label
                                        key={pkg.id}
                                        onClick={() => setSelected(pkg.id)}
                                        className={`flex items-start justify-between w-full px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-150 ${selected === pkg.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 bg-white hover:border-blue-300"
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected === pkg.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                                }`}>
                                                {selected === pkg.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{pkg.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{pkg.description}</p>
                                            </div>
                                        </div>
                                        <span className={`text-base font-bold ml-3 flex-shrink-0 ${selected === pkg.id ? "text-blue-600" : "text-gray-700"}`}>
                                            ${getPrice(pkg.priceKey)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handlePurchase}
                            disabled={isProcessing}
                            className="cursor-pointer flex justify-center items-center gap-2 mt-4 w-full py-4 rounded-xl bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-gray-900 font-extrabold text-sm tracking-widest transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase">
                            {isProcessing ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> PROCESSING...</>
                            ) : (
                                `Buy Now · $${selectedPkgPrice}`
                            )}
                        </button>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-4 mt-3 justify-center">
                            {[
                                { icon: "🔒", text: "Secure Payment" },
                                { icon: "↩️", text: "30-Day Money Back" },
                                { icon: "⚡", text: "Instant Access" },
                            ].map(({ icon, text }) => (
                                <span key={text} className="flex items-center gap-1 text-xs text-gray-400">
                                    <span>{icon}</span> {text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Product Overview */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Product Overview</h2>
                        <p className="text-xs text-gray-500 mb-3">Everything you need for success</p>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Key Features</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                            {(product.features || ["10 SEO Tools", "5 Training videos", "3 eBooks", "Templates"]).map((label: string) => (
                                <div key={label} className="flex items-center gap-1.5">
                                    <CheckIcon className="text-green-500" />
                                    <span className="text-xs text-gray-700">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Full PLR Rights */}
                        <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <CheckIcon className="text-white w-3 h-3" />
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Full PLR Rights Included</p>
                                    <p className="text-xs text-gray-500">Use these products to build your business</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                {[
                                    "Resell with 100% profit",
                                    "Edit and rebrand",
                                    "Use for client work",
                                    "Include in bundles"
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
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold leading-tight">Money Back Guarantee</h3>
                            <p className="text-xs text-violet-200 leading-relaxed">
                                Try it risk-free for 30 days. If you&apos;re not satisfied, we&apos;ll refund your purchase.
                            </p>
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