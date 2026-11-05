"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AffiliateStatCardProps {
  label: string;
  value: string | number;
  color: "emerald" | "purple" | "yellow" | "blue";
}

const colorMap = {
  emerald: "outline-[#009966]/20 text-[#009966]",
  purple: "outline-purple-200 text-purple-600",
  yellow: "outline-yellow-200 text-yellow-600",
  blue: "outline-blue-200 text-blue-600",
};

export function AffiliateStatCard({ label, value, color = "emerald" }: AffiliateStatCardProps) {
  const colorStyle = colorMap[color] || colorMap.emerald;
  const [outlineColor, textColor] = colorStyle.split(' ');

  return (
    <div className={cn(
      "w-full min-h-[115px] p-5 sm:p-6 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] flex flex-col justify-between gap-3 shadow-sm",
      outlineColor
    )}>
      <div className="text-slate-600 text-sm sm:text-base font-semibold font-['Inter'] leading-snug">
        {label}
      </div>
      <div className={cn(
        "text-3xl sm:text-4xl font-bold font-['Inter'] leading-none",
        textColor
      )}>
        {value}
      </div>
    </div>
  );
}
