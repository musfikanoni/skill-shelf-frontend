"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";


interface SubscriptionsClientManagerProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onCreateClick?: () => void;
}

export default function SubscriptionsClientManager({
  children,
  title,
  description,
  onCreateClick,
}: SubscriptionsClientManagerProps) {
  const [stats, table] = React.Children.toArray(children);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1E293B]">{title}</h1>
          <p className="text-slate-400 font-medium">{description}</p>
        </div>
        <div>
          <Button
            onClick={onCreateClick}
            className="cursor-pointer py-5 px-7 border-0 flex-1 bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-black hover:from-[#F9C32C] hover:to-[#EFA00B] hover:text-black"
          >
            <Plus className="h-4 w-4 " />
            Create New Plan
          </Button>
        </div>
      </div>

      <div className="py-6 lg:py-8">
        {stats}
      </div>

      <div>
        {table}
      </div>
    </div>
  );
}

