'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { User, CreditCard, Package, Info } from 'lucide-react';
import { StatusBadge } from '@/components/shared/orders/StatusBadge';
import { useGetMyOrderByIdQuery } from '@/redux/api/userDashboardApi/ordersApi';

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ orderId, isOpen, onClose }: OrderDetailsModalProps) {
  const { data: response, isLoading } = useGetMyOrderByIdQuery(orderId as string, {
    skip: !orderId || !isOpen,
  });

  const order = response?.data;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden rounded-xl border border-slate-200 shadow-2xl bg-[#F8FAFC]">
        <DialogHeader className="px-8 py-6 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#0F172A] flex items-center gap-3">
              Order Details
              <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-tight">
                {order ? `#${order._id.slice(-8).toUpperCase()}` : ''}
              </span>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl col-span-2" />
            </div>
          ) : order ? (
            <div className="space-y-8">
              
              {/* Quick Summary Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Order Status</p>
                  <div className="pt-1">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Date</p>
                  <p className="text-[#1E293B] font-bold text-lg">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Time</p>
                  <p className="text-[#1E293B] font-bold text-lg">{format(new Date(order.createdAt), 'HH:mm')}</p>
                </div>
                <div className="bg-indigo-600 p-4 rounded-xl shadow-lg shadow-indigo-100 flex flex-col gap-1">
                  <p className="text-indigo-100 text-[11px] font-bold uppercase tracking-wider">Total Amount</p>
                  <p className="text-white font-black text-2xl">${order.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Information Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Customer Information Card */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">Customer Details</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Name</span>
                      <span className="text-[#0F172A] font-bold text-sm">{order.user.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Email Address</span>
                      <span className="text-[#0F172A] font-bold text-sm">{order.user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Customer ID</span>
                      <span className="text-indigo-500 font-mono text-[10px] bg-indigo-50 px-2 py-0.5 rounded">{order.user._id}</span>
                    </div>
                  </div>
                </div>

                {/* Product Information Card */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">Product Details</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Item Type</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-black uppercase tracking-tighter border border-indigo-100">
                        {order.itemType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Subscription Plan</span>
                      <span className="text-[#0F172A] font-bold text-sm uppercase tracking-tight">{order.planType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-sm font-medium">Quantity</span>
                      <span className="text-[#0F172A] font-bold text-sm">{order.quantity}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Transaction Reference Section */}
              <div className="bg-slate-100/50 p-5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-3">
                  <CreditCard className="w-4 h-4 text-indigo-500" />
                  Transaction Reference (Stripe)
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <code className="text-[#1E293B] font-mono text-xs select-all break-all overflow-hidden">
                    {order.stripeSessionId}
                  </code>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12">
              <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-lg">Order detail not found.</p>
              <p className="text-slate-400 text-sm">Please refresh the list and try again.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
