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
  const [stats, table] = React.Children.toArray(children);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#1E293B]">{title}</h1>
          <p className="text-slate-400 font-medium">{description}</p>
        </div>
        <div>
          <Button
            onClick={onCreateClick}
            className="cursor-pointer py-5 px-7 border-0 flex-1 bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-black hover:from-[#F9C32C] hover:to-[#EFA00B] hover:text-black font-bold"
          >
            <Plus className="h-4 w-4 " />
            {createButtonText}
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="py-6 lg:py-8">
        {stats}
      </div>

      {/* Table Section */}
      <div>
        {table}
      </div>
    </div>
  );
}
