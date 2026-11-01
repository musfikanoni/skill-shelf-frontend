"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Affiliate } from "@/components/shared/affiliate/AffiliateTable";
// import { Affiliate } from "@/components/shared/affiliate/AffiliateTable";

interface EditAffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: any) => void;
  affiliate: Affiliate | null;
}

export function EditAffiliateModal({
  isOpen,
  onClose,
  onSave,
  affiliate,
}: EditAffiliateModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<string>("PENDING");

  useEffect(() => {
    if (affiliate) {
      setAmount(affiliate.amount);
      setStatus(affiliate.status);
    }
  }, [affiliate]);

  const handleSave = () => {
    if (affiliate) {
      onSave(affiliate._id, { amount, status });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl border border-slate-200 shadow-lg p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-slate-100">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Edit Affiliate Information
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Partner Info Summary */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
            <div>
              <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Affiliate Partner</Label>
              <p className="text-sm font-semibold text-slate-900">{affiliate?.user?.name}</p>
              <p className="text-xs text-slate-500">{affiliate?.user?.email}</p>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <Label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Referred User</Label>
              <p className="text-sm font-semibold text-slate-900">{affiliate?.referredUser?.name}</p>
              <p className="text-xs text-slate-500">{affiliate?.referredUser?.email}</p>
            </div>
          </div>

          <div className="grid gap-10">
            <div className="flex flex-col gap-3">
              <Label htmlFor="amount" className="text-[15px] font-semibold text-slate-800 ml-1">
                Commission Amount ($)
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-12 border-slate-200 focus:ring-1 focus:ring-slate-950 rounded-lg text-base"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="status" className="text-[15px] font-semibold text-slate-800 ml-1">
                Approval Status
              </Label>
              <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                <SelectTrigger className="h-12 border-slate-200 focus:ring-1 focus:ring-slate-950 rounded-lg text-base">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-2xl">
                  <SelectItem value="PENDING" className="py-2.5">Pending Verification</SelectItem>
                  <SelectItem value="APPROVED" className="py-2.5">Approved Partner</SelectItem>
                  <SelectItem value="REJECT" className="py-2.5">Rejected Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 flex justify-end gap-3 border-t border-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-[8px] flex justify-center items-center text-slate-700 text-sm font-semibold font-inter outline outline-1 outline-offset-[-1px] outline-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 rounded-[8px] flex justify-center items-center text-black text-sm font-semibold font-inter hover:brightness-105 transition-all shadow-md border-none"
            style={{
              background: "linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)"
            }}
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

