"use client";

import { useForm } from "react-hook-form";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    websiteUrl?: string;
    promotionStrategy: string;
    terms: boolean;
};

export default function AffiliateApplication() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        reset,
    } = useForm<FormData>();

    const onSubmit = async (data: any) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Form submitted:", data);
        reset();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Commission Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center shadow-sm">
                        <div className="text-green-500 text-2xl font-bold mb-1">$</div>
                        <p className="text-sm font-semibold text-gray-800">50% Commission</p>
                        <p className="text-xs text-gray-500 mt-1">Earn generous commissions on every sale</p>
                    </div>

                    {/* Marketing Support Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center shadow-sm">
                        <div className="mb-1">
                            <svg className="w-7 h-7 text-blue-500 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5.478-3.764M9 20H4v-2a4 4 0 015.478-3.764m0 0A4 4 0 1112 7a4 4 0 012.522 9.236M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">Marketing Support</p>
                        <p className="text-xs text-gray-500 mt-1">Get banners, templates, and resources</p>
                    </div>

                    {/* Performance Bonuses Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center shadow-sm">
                        <div className="mb-1">
                            <svg className="w-7 h-7 text-purple-500 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">Performance Bonuses</p>
                        <p className="text-xs text-gray-500 mt-1">Extra rewards for top performers</p>
                    </div>
                </div>

                {/* Application Form */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-5">Affiliate Application</h2>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    {...register("firstName", { required: "First name is required" })}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition ${errors.firstName ? "border-red-400" : "border-gray-300"
                                        }`}
                                />
                                {errors.firstName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    {...register("lastName", { required: "Last name is required" })}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition ${errors.lastName ? "border-red-400" : "border-gray-300"
                                        }`}
                                />
                                {errors.lastName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition ${errors.email ? "border-red-400" : "border-gray-300"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Website URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Website URL (Optional)
                            </label>
                            <input
                                type="url"
                                placeholder="https://yourwebsite.com"
                                {...register("websiteUrl", {
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: "Enter a valid URL starting with http:// or https://",
                                    },
                                })}
                                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition ${errors.websiteUrl ? "border-red-400" : "border-gray-300"
                                    }`}
                            />
                            {errors.websiteUrl && (
                                <p className="text-xs text-red-500 mt-1">{errors.websiteUrl.message}</p>
                            )}
                        </div>

                        {/* Promotion Strategy */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                How will you promote our products?
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Tell us about your marketing strategy..."
                                {...register("promotionStrategy", {
                                    required: "Please describe your promotion strategy",
                                    minLength: {
                                        value: 20,
                                        message: "Please provide at least 20 characters",
                                    },
                                })}
                                className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition resize-none ${errors.promotionStrategy ? "border-red-400" : "border-gray-300"
                                    }`}
                            />
                            {errors.promotionStrategy && (
                                <p className="text-xs text-red-500 mt-1">{errors.promotionStrategy.message}</p>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                {...register("terms", {
                                    required: "You must agree to the terms and conditions",
                                })}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-yellow-500 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer leading-snug">
                                I Agree To The Affiliate Program Terms And Conditions
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-xs text-red-500 -mt-2">{errors.terms.message}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="cursor-pointer w-full bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-semibold text-sm py-3 rounded-lg transition-colors duration-200 mt-1"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                        </button>

                        {isSubmitSuccessful && (
                            <p className="text-center text-sm text-green-600 font-medium">
                                ✅ Application submitted successfully!
                            </p>
                        )}
                    </form>
                </div>

                <div className="bg-[linear-gradient(180deg,#6C3FC5_50%,#341E5F_145%)] rounded-xl p-5 text-white">
                    <h3 className="font-bold text-base mb-1">What happens next?</h3>
                    <p className="text-sm text-indigo-100 leading-relaxed">
                        We&apos;ll review your application within 24–48 hours. Once approved, you&apos;ll
                        receive your unique affiliate link and access to all marketing materials.
                    </p>
                </div>

            </div>
        </div>
    );
}