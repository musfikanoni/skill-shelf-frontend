"use client";

import React from "react";
import SecondaryButton from "../secondaryButton/SecondaryButton";

interface UpgradeBannerProps {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    onClick?: () => void;
}

const UpgradeBanner: React.FC<UpgradeBannerProps> = ({
    title = "Get Unlimited Course Access",
    subtitle = "VIP members get access to all current and future courses",
    buttonText = "Upgrade to VIP",
    onClick,
}) => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
            <div className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-2xl px-5 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden shadow-lg">

                <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    {title}
                </h2>

                <p className="text-purple-200 text-xs sm:text-sm mb-6 max-w-xl mx-auto">
                    {subtitle}
                </p>
         
                <div className="flex justify-center">
                    <SecondaryButton
                        label={buttonText}
                        onClick={onClick}
                        iconPosition="right"
                    />
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[2px] 
                 bg-gradient-to-r from-transparent via-cyan-400
                 to-transparent opacity-70" />
            </div>
        </div>
    );
};

export default UpgradeBanner;
