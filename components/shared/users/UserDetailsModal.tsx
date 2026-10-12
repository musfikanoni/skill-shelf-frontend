"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetUserByIdQuery } from "@/redux/api/userDashboardApi/userManagementApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Briefcase, Building2, ShieldCheck, ShieldAlert, Calendar } from "lucide-react";

interface UserDetailsModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsModal({ userId, isOpen, onClose }: UserDetailsModalProps) {
  const { data: response, isLoading } = useGetUserByIdQuery(userId as string, {
    skip: !userId,
  });

  const user = response?.data;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
        <DialogHeader className="bg-slate-50 p-6 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 col-span-2 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
              <Skeleton className="h-14 rounded-xl" />
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold uppercase">
                  {user.name?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-bold uppercase text-[10px]">
                      {user.role}
                    </Badge>
                    <Badge variant="secondary" className={user.isActive === 'ACTIVE' ? "bg-emerald-100 text-emerald-700 uppercase text-[10px] font-bold" : "bg-red-100 text-red-700 uppercase text-[10px] font-bold"}>
                      {user.isActive}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Information Grid - 2 columns to reduce height */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <InfoItem icon={<Mail className="w-4 h-4" />} label="Email Address" value={user.email} />
                <InfoItem icon={<MapPin className="w-4 h-4" />} label="Location" value={user.location || "N/A"} />
                <InfoItem icon={<Briefcase className="w-4 h-4" />} label="Occupation" value={user.occupation || "N/A"} />
                <InfoItem icon={<Building2 className="w-4 h-4" />} label="Business Name" value={user.businessName || "N/A"} />
                <InfoItem icon={<ShieldCheck className="w-4 h-4" />} label="Verification" value={user.isVerified ? "Verified" : "Pending"} valueClassName={user.isVerified ? "text-emerald-600" : "text-amber-500"} />
                <InfoItem icon={<Calendar className="w-4 h-4" />} label="Member Since" value={new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Failed to load user details.
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ icon, label, value, valueClassName = "" }: { icon: React.ReactNode, label: string, value: string, valueClassName?: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="mt-1 text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-semibold text-slate-700 mt-0.5 ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}
