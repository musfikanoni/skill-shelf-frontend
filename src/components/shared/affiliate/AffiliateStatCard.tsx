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

export function AffiliateStatCard({ label, value, color }: AffiliateStatCardProps) {
  return (
    <div className={cn(
      "h-40 px-6 pt-6 bg-white rounded-2xl outline outline-2 outline-offset-[-2px] flex flex-col justify-start items-start gap-2",
      colorMap[color].split(' ')[0]
    )}>
      <div className="text-slate-600 text-base font-semibold font-['Inter'] leading-6">
        {label}
      </div>
      <div className={cn(
        "text-4xl font-bold font-['Inter'] leading-10",
        colorMap[color].split(' ')[1]
      )}>
        {value}
      </div>
    </div>
  );
}
