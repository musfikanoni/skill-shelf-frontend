import React from "react";

export default function AuthBackground({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen flex items-center justify-center">

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/authImage/authBgColor.png')",
                }}
            />

            {/* Blur Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

        </div>
    );
}
