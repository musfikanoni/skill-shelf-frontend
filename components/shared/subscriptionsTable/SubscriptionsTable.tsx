'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, CreditCard, Calendar, MoreHorizontal, Mail } from "lucide-react";

interface SubscriptionTableProps {
  data: any[];
}

export function SubscriptionsTable({ data }: SubscriptionTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'PAST_DUE':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="hover:bg-transparent border-slate-200">
            <TableHead className="w-[300px] h-14 px-6 text-slate-700 text-base font-bold font-inter">Subscriber</TableHead>
            <TableHead className="px-6 text-slate-700 text-base font-bold font-inter">Plan</TableHead>
            <TableHead className="px-6 text-slate-700 text-base font-bold font-inter text-center">Amount</TableHead>
            <TableHead className="px-6 text-slate-700 text-base font-bold font-inter text-center">Status</TableHead>
            <TableHead className="px-6 text-slate-700 text-base font-bold font-inter">Next Billing</TableHead>
            <TableHead className="w-[100px] px-6 text-slate-700 text-base font-bold font-inter text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sub) => (
            <TableRow key={sub._id} className="border-slate-200 hover:bg-slate-50/50 transition-colors">
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-slate-900 text-base font-bold font-inter">
                      {sub.user?.name || 'Guest User'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-10">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 text-sm font-medium font-inter">
                      {sub.user?.email || 'No email provided'}
                    </span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-violet-50 text-violet-700 rounded-lg border border-violet-100 flex items-center gap-1.5">
                    <span className="text-sm font-bold font-inter">{sub.plan?.name || 'Unknown Plan'}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-slate-900 text-base font-bold font-inter">
                    ${sub.plan?.price || 0}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {sub.plan?.interval || 'Month'}
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 text-center">
                <div className="flex justify-center">
                  <Badge className={`px-3 py-1 rounded-[10px] border font-bold text-xs uppercase shadow-none ${getStatusColor(sub.status)}`}>
                    {sub.status}
                  </Badge>
                </div>
              </TableCell>

              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold font-inter">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {sub.currentPeriodEnd ? format(new Date(sub.currentPeriodEnd), "MMM dd, yyyy") : 'N/A'}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium pl-6 uppercase">
                    Ends at midnight
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-6 py-4 text-right">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-slate-500" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
