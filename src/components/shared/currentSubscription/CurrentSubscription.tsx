"use client";
import SecondaryButton from "../secondaryButton/SecondaryButton";

export default function CurrentSubscription() {
    return (
        <div className="flex items-center justify-center p-4 md:pb-16">
            <div className="w-full max-w-6xl bg-purple-600 rounded-2xl p-5 md:p-6 shadow-lg">

                {/* Title */}
                <h2 className="text-white font-bold text-lg mb-5">
                    Current Subscription
                </h2>

                {/* Info Row */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-10 md:gap-20 lg:gap-40 mb-6">

                    <div>
                        <p className="text-white text-xs mb-1">Plan</p>
                        <p className="text-white text-sm font-medium">Pro</p>
                    </div>

                    <div>
                        <p className="text-white text-xs mb-1">Status</p>
                        <p className="text-green-400 text-sm font-semibold">Active</p>
                    </div>
                    <div>
                        <p className="text-white text-xs mb-1">Next Billing Date</p>
                        <p className="text-white text-sm font-medium">
                            May 21, 2026
                        </p>
                    </div>
                </div>

                <hr className="border-white/40 mb-5" />

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <SecondaryButton
                        label="Update Payment Method"
                        onClick={() => console.log("click button")}
                    />

                    <button className="w-full sm:w-auto cursor-pointer bg-[#e83939] hover:bg-[#e83939]/80 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200">
                        Cancel Subscription
                    </button>
                </div>
            </div>
        </div>
    );
}