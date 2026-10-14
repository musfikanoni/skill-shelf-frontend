"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseClientManagerProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onCreateClick?: () => void;
  buttonLabel?: string;
}

export default function CourseClientManager({
  children,
  title,
  description,
  onCreateClick,
  buttonLabel = "Create Course",
}: CourseClientManagerProps) {
  const [stats, content] = React.Children.toArray(children);

  const isClose = buttonLabel.toLowerCase() === "close" || buttonLabel.toLowerCase() === "cancel";

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
            className="cursor-pointer py-5 px-7 border-0 flex-1 bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-black hover:from-[#F9C32C] hover:to-[#EFA00B] hover:text-black transition-all duration-300"
          >
            {isClose ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {buttonLabel}
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="py-6 lg:py-8">
        {stats}
      </div>

      {/* Main Content Section */}
      <div>
        {content}
      </div>
    </div>
  );
}
