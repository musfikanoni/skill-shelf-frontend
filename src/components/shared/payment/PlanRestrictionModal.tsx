"use client";

import { AlertTriangle, Crown, Download, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlanRestrictionModalProps {
  onClose: () => void;
  title: string;
  message: string;
  currentPlan?: string | null;
  targetPlan?: string | null;
  actionType?: "upgrade" | "downloads" | "none";
}

export default function PlanRestrictionModal({
  onClose,
  title,
  message,
  actionType = "upgrade",
}: PlanRestrictionModalProps) {
  const router = useRouter();

  const handleAction = () => {
    onClose();
    if (actionType === "downloads") {
      router.push("/user-dashboard/downloads");
    } else {
      router.push("/user-dashboard/membership");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-8 ring-amber-50">
            <AlertTriangle className="h-8 w-8" />
          </div>
        </div>

        <h2 className="mb-2 text-center text-xl sm:text-2xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="mb-6 text-center text-gray-600 text-sm leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          {actionType === "downloads" ? (
            <button
              onClick={handleAction}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 shadow-md cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Go to My Downloads
            </button>
          ) : actionType === "upgrade" ? (
            <button
              onClick={handleAction}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6C3FC5] py-3.5 text-sm font-bold text-white transition hover:bg-[#5a32a6] shadow-md cursor-pointer"
            >
              <Crown className="h-4 w-4" />
              Upgrade Membership Plan
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
