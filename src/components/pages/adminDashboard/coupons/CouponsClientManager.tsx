"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CouponsClientManagerProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onCreateClick?: () => void;
  createButtonText?: string;
}

export default function CouponsClientManager({
  children,
  title,
  description,
  onCreateClick,
  createButtonText = "Create Coupon",
}: CouponsClientManagerProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1E293B]">{title}</h1>
          <p className="text-slate-400 font-medium">{description}</p>
        </div>
        <div>
          <Button
            onClick={onCreateClick}
            className="cursor-pointer py-5 px-7 border-0 bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-black hover:from-[#F9C32C] hover:to-[#EFA00B] hover:text-black font-bold rounded-[14px]"
          >
            <Plus className="h-4 w-4 mr-1" />
            {createButtonText}
          </Button>
        </div>
      </div>

      {children}
    </div>
  );
}
