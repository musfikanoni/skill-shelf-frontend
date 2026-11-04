"use client";

import * as React from "react";
import { Download, Filter, Search, Package, FileText, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMyOrdersQuery } from "@/redux/api/userDashboardApi/ordersApi";
import Link from "next/link";
import Loading from "@/components/Others/Loading";
import { toast } from "sonner";

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data: getMyOrdersData,
    isLoading,
    error,
  } = useGetMyOrdersQuery(debouncedSearchTerm || undefined);

  const orders = getMyOrdersData?.data || [];

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order: any) => {
      if (filter === "all") return true;
      return order?.status?.toUpperCase() === filter.toUpperCase();
    });
  }, [orders, filter]);

  const handleDownload = (order: any) => {
    if (order.status !== "PAID") {
      toast.error("Downloads are only available for paid orders.");
      return;
    }

    const files = order.product?.files;
    const plan = (order.planType || order.purchasedPlan || "").toLowerCase();
    const fileUrl =
      files?.[plan] ||
      files?.basic ||
      files?.pro ||
      files?.vip ||
      (typeof files === "string" ? files : null);

    if (fileUrl) {
      window.open(fileUrl, "_blank");
      toast.success("Opening product download...");
    } else {
      toast.info("Opening your Downloads library...");
      window.location.href = "/user-dashboard/downloads";
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    console.error("Error fetching my orders:", error);
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-red-500 font-semibold">Failed to fetch orders</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="rounded-xl border-slate-200"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-[#1E293B]">My Orders</h1>
          <p className="text-slate-400 font-medium">
            View and manage all your past purchases.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="pl-10 h-11 border-slate-200 rounded-xl bg-white shadow-sm focus:ring-1 focus:ring-slate-200"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-40 shrink-0">
            <Select
              value={filter}
              onValueChange={(val: any) => setFilter(val || "all")}
            >
              <SelectTrigger className="py-5 border border-slate-200 rounded-xl bg-white px-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <SelectValue placeholder="All Orders" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders Table Section */}
      <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider px-6">
                  ORDER ID
                </TableHead>
                <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider">
                  PRODUCT NAME
                </TableHead>
                <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider">
                  DATE
                </TableHead>
                <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider">
                  STATUS
                </TableHead>
                <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider">
                  PRICE
                </TableHead>
                <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider text-right pr-6">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => {
                  const imageUrl = order?.product?.images?.[0];
                  return (
                    <TableRow
                      key={order?._id}
                      className="border-slate-50 hover:bg-slate-50/30 transition-colors"
                    >
                      <TableCell className="font-bold text-slate-400 py-5 px-6">
                        #{order._id ? order._id.slice(-6).toUpperCase() : "N/A"}
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-50 border border-indigo-100/50 overflow-hidden">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={order.product?.name || "Product"}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display =
                                    "none";
                                  const fallback =
                                    e.currentTarget.parentElement?.querySelector(
                                      ".fallback-icon"
                                    ) as HTMLElement;
                                  if (fallback) fallback.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="fallback-icon items-center justify-center"
                              style={{ display: imageUrl ? "none" : "flex" }}
                            >
                              <Package className="h-5 w-5 text-indigo-500" />
                            </div>
                          </div>
                          <div>
                            <span className="font-extrabold text-[#1E293B] text-sm block">
                              {order.product?.name || "Product"}
                            </span>
                            {order.planType && (
                              <span className="text-xs text-slate-400 font-medium">
                                Plan: {order.planType}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400 font-bold py-5 text-sm">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          variant="outline"
                          className={
                            order.status === "PAID"
                              ? "bg-[#DCFCE7] text-[#166534] border-none font-bold px-3 py-1 text-[10px] rounded-lg"
                              : order.status === "PENDING"
                              ? "bg-[#FEF08A] text-[#854D0E] border-none font-bold px-3 py-1 text-[10px] rounded-lg"
                              : "bg-[#FFEDD5] text-[#9A3412] border-none font-bold px-3 py-1 text-[10px] rounded-lg"
                          }
                        >
                          {order.status || "UNKNOWN"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-extrabold text-[#1E293B] py-5 text-sm">
                        {order.amount !== undefined
                          ? `$${Number(order.amount).toFixed(2)}`
                          : "—"}
                      </TableCell>
                      <TableCell className="py-5 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* Fixed View Details Link to proper dashboard route */}
                          <Link
                            href={`/user-dashboard/my-orders/${order._id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer h-9 border-slate-200 text-[#1E293B] font-bold rounded-lg px-4 text-xs bg-white hover:bg-slate-50 transition-colors"
                            >
                              View Details
                            </Button>
                          </Link>

                          {/* Download Button (Active only if PAID) */}
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={order.status !== "PAID"}
                            title={
                              order.status === "PAID"
                                ? "Download Files"
                                : `Payment ${order.status || "Pending"} — download locked`
                            }
                            className={`h-9 w-9 border-slate-200 rounded-lg bg-white transition-colors ${
                              order.status === "PAID"
                                ? "hover:bg-slate-50 cursor-pointer group"
                                : "opacity-40 cursor-not-allowed bg-slate-50"
                            }`}
                            onClick={() => handleDownload(order)}
                          >
                            {order.status === "PAID" ? (
                              <Download className="h-4 w-4 text-slate-400 group-hover:text-[#1E293B]" />
                            ) : (
                              <Lock className="h-4 w-4 text-slate-400" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-16 text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="w-10 h-10 text-slate-300" />
                      <p className="font-bold text-slate-600 text-base">
                        No orders found
                      </p>
                      <p className="text-sm text-slate-400">
                        {searchTerm || filter !== "all"
                          ? `No orders matching "${searchTerm || filter}"`
                          : "You have not placed any orders yet."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer info */}
        {filteredOrders.length > 0 && (
          <div className="p-5 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400">
              Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
