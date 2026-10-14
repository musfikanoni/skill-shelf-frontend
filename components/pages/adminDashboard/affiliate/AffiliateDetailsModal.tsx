"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, UserCheck, DollarSign, Calendar, ShieldCheck, X } from "lucide-react";
import { Affiliate } from "@/components/shared/affiliate/AffiliateTable";

interface AffiliateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  affiliate: Affiliate | null;
}

export function AffiliateDetailsModal({
  isOpen,
  onClose,
  affiliate,
}: AffiliateDetailsModalProps) {
  if (!affiliate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-slate-900">
            Affiliate Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-8 space-y-8">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Affiliate Partner */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600">
                <User size={18} strokeWidth={2.5} />
                <span className="text-[11px] font-black uppercase tracking-widest">Affiliate Partner</span>
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{affiliate.user?.name}</p>
                <p className="text-xs text-slate-500 font-medium">{affiliate.user?.email}</p>
              </div>
            </div>

            {/* Referred User */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600">
                <UserCheck size={18} strokeWidth={2.5} />
                <span className="text-[11px] font-black uppercase tracking-widest">Referred User</span>
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{affiliate.referredUser?.name}</p>
                <p className="text-xs text-slate-500 font-medium">{affiliate.referredUser?.email}</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <DollarSign size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Amount</span>
              </div>
              <p className="text-lg font-black text-slate-900">${affiliate.amount}</p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Status</span>
              </div>
              <div className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                affiliate.status === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                affiliate.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {affiliate.status}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Created At</span>
              </div>
              <p className="text-sm font-bold text-slate-700">
                {new Date(affiliate.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button
            onClick={onClose}
            className="px-8 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition-all shadow-lg shadow-slate-200"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
