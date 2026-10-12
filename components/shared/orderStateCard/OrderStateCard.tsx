import { Card } from "@/components/ui/card";
import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  borderColor: string;
  titleTextColor?: string;
}

export function OrderStatCard({

  label,
  value,
  borderColor,
  titleTextColor,
}: StatCardProps) {
  return (
    <Card
      className={`border-l-2 border-t border-b border-r shadow-md ${borderColor} p-6 bg-white`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className={`text-sm text-gray-500 font-medium ${titleTextColor}`}>
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}
