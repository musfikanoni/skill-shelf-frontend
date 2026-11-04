"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, GraduationCap } from "lucide-react";

export interface LoadingProps {
  title?: string;
  message?: string;
  showProgressDots?: boolean;
  spinnerSize?: "sm" | "md" | "lg";
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  className?: string;
  showBrand?: boolean;
}

function getAutoTitle(pathname: string | null): string {
  if (!pathname || pathname === "/") return "Loading SkillShelf...";

  const lower = pathname.toLowerCase();

  // Specific and known routes
  if (lower.includes("seo-toolkit")) return "Loading Product...";
  if (lower.includes("products")) return "Loading Products...";
  if (lower.includes("my-courses")) return "Loading Courses...";
  if (lower.includes("courses")) return "Loading Courses...";
  if (lower.includes("bundles")) return "Loading Bundles...";
  if (lower.includes("my-orders") || lower.includes("orders")) return "Loading Orders...";
  if (lower.includes("downloads")) return "Loading Downloads...";
  if (lower.includes("membership")) return "Loading Membership...";
  if (lower.includes("affiliate")) return "Loading Affiliate...";
  if (lower.includes("subscriptions")) return "Loading Subscriptions...";
  if (lower.includes("categories")) return "Loading Categories...";
  if (lower.includes("coupons")) return "Loading Coupons...";
  if (lower.includes("users")) return "Loading Users...";
  if (lower.includes("settings")) return "Loading Settings...";
  if (lower.includes("shopping-cart") || lower.includes("cart")) return "Loading Cart...";
  if (lower.includes("admin-dashboard")) return "Loading Admin Dashboard...";
  if (lower.includes("user-dashboard")) return "Loading Dashboard...";
  if (lower.includes("signin") || lower.includes("login")) return "Loading Sign In...";
  if (lower.includes("signup") || lower.includes("register")) return "Loading Sign Up...";

  // Fallback to last meaningful segment
  try {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      // Check if it's an ID
      if (!/^[0-9a-fA-F]{24}$/.test(last) && !/^\d+$/.test(last)) {
        const readable = last
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return `Loading ${readable}...`;
      } else if (segments.length > 1) {
        const prev = segments[segments.length - 2]
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return `Loading ${prev}...`;
      }
    }
  } catch {}

  return "Loading...";
}

function getAutoMessage(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("product")) return "Fetching latest digital products...";
  if (lower.includes("course")) return "Fetching lessons and curriculum...";
  if (lower.includes("bundle")) return "Fetching bundle catalog...";
  if (lower.includes("order")) return "Fetching order details...";
  if (lower.includes("download")) return "Fetching your downloadable files...";
  if (lower.includes("membership") || lower.includes("subscription")) return "Fetching available plans and pricing...";
  if (lower.includes("affiliate")) return "Fetching affiliate activity...";
  if (lower.includes("dashboard")) return "Preparing your dashboard...";
  if (lower.includes("cart")) return "Updating your shopping cart...";
  return "Getting everything ready for you...";
}

const Loading: React.FC<LoadingProps> = ({
  title,
  message,
  showProgressDots = true,
  spinnerSize,
  size = "md",
  fullScreen = false,
  className = "",
  showBrand = true,
}) => {
  const pathname = usePathname();

  const finalTitle = useMemo(() => {
    if (title) return title;
    return getAutoTitle(pathname);
  }, [title, pathname]);

  const finalMessage = useMemo(() => {
    if (message !== undefined) return message;
    return getAutoMessage(finalTitle);
  }, [message, finalTitle]);

  const finalSize = spinnerSize || size;
  const isSmall = finalSize === "sm";
  const isLarge = finalSize === "lg";

  return (
    <div
      className={`flex flex-col items-center justify-center transition-all duration-300 ${
        fullScreen
          ? "fixed inset-0 z-50 bg-white/90 backdrop-blur-md"
          : isSmall
          ? "py-8 px-4"
          : isLarge
          ? "min-h-[70vh] py-16 px-4"
          : "min-h-[45vh] py-12 px-4"
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Glow */}
        <div
          className={`absolute rounded-full bg-gradient-to-tr from-[#7B3FE4]/20 via-[#F5C518]/25 to-[#FF8C00]/20 blur-xl animate-pulse pointer-events-none ${
            isSmall ? "w-20 h-20" : isLarge ? "w-36 h-36" : "w-28 h-28"
          }`}
        />

        {/* Outer dashed spinning ring (counter-clockwise) */}
        <div
          className={`rounded-full border-2 border-dashed border-[#F5C518]/60 animate-[spin_6s_linear_infinite_reverse] ${
            isSmall ? "w-14 h-14" : isLarge ? "w-24 h-24" : "w-20 h-20"
          }`}
        />

        {/* Inner spinning gradient ring (clockwise) */}
        <div
          className={`absolute rounded-full border-2 border-transparent border-t-[#7B3FE4] border-r-[#4F8EF7] animate-spin ${
            isSmall ? "w-14 h-14" : isLarge ? "w-24 h-24" : "w-20 h-20"
          }`}
        />

        {/* Center Cute Card Badge */}
        <div
          className={`absolute flex items-center justify-center rounded-2xl bg-white shadow-md border border-slate-100 transition-transform duration-300 ${
            isSmall ? "w-9 h-9" : isLarge ? "w-16 h-16" : "w-12 h-12"
          }`}
        >
          {/* Animated cute icon */}
          <div className="relative flex items-center justify-center">
            <GraduationCap
              className={`text-[#7B3FE4] animate-bounce transition-all ${
                isSmall ? "w-4 h-4" : isLarge ? "w-8 h-8" : "w-6 h-6"
              }`}
            />
            {/* Cute mini sparkle */}
            <Sparkles
              className={`absolute -top-1.5 -right-2 text-[#F5C518] animate-pulse ${
                isSmall ? "w-2.5 h-2.5" : "w-3.5 h-3.5"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Brand & Texts */}
      <div className="mt-5 text-center flex flex-col items-center">
        {showBrand && !isSmall && (
          <div className="flex items-center justify-center gap-0.5 leading-none mb-1.5 select-none">
            <span className="text-sm font-extrabold bg-gradient-to-r from-[#4F8EF7] to-[#7B3FE4] bg-clip-text text-transparent">
              Skill
            </span>
            <span className="text-sm font-extrabold bg-gradient-to-r from-[#FF8C00] to-[#F5C518] bg-clip-text text-transparent">
              Shelf
            </span>
          </div>
        )}

        {finalTitle && (
          <h3
            className={`font-bold text-slate-800 tracking-tight ${
              isSmall ? "text-xs" : isLarge ? "text-lg" : "text-sm sm:text-base"
            }`}
          >
            {finalTitle}
          </h3>
        )}

        {finalMessage && (
          <p
            className={`text-slate-500 max-w-xs mt-1 leading-relaxed ${
              isSmall ? "text-[11px]" : "text-xs"
            }`}
          >
            {finalMessage}
          </p>
        )}
      </div>

      {/* Progress Indicator: Cute colorful dancing dots */}
      {showProgressDots && (
        <div className="flex items-center gap-1.5 mt-3.5">
          <div className="w-2 h-2 rounded-full bg-[#7B3FE4] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-[#4F8EF7] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-[#F5C518] animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default Loading;
