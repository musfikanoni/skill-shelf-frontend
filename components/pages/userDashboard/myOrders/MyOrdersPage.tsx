"use client";

import * as React from "react";
import { Download, Filter, Search, ChevronDown } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMyOrdersQuery } from "@/redux/api/userDashboardApi/ordersApi";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/components/Others/Loading";

export default function MyOrdersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: getMyOrdersData, isLoading, error } = useGetMyOrdersQuery(
    debouncedSearchTerm || undefined,
  );

  const orders = getMyOrdersData?.data || [];
  // console.log("get-------", orders)

  const [filter, setFilter] = React.useState("All Orders");

  const filteredOrders = orders.filter((order) => {
    if (filter === "All Orders") return true;
    if (filter === "Paid") return order.status === "PAID";
    if (filter === "Pending") return order.status === "PENDING";
    if (filter === "Failed") return order.status === "FAILED";
    return true;
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    console.error("Error fetching my orders:", error);
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to fetch orders</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">No orders found</p>
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
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="pl-10 h-11 border-slate-200 rounded-xl bg-white shadow-sm focus:ring-1 focus:ring-slate-200"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-11 border border-slate-200 rounded-xl gap-2 font-bold text-slate-600 bg-white hover:bg-slate-50 min-w-[120px] inline-flex items-center justify-center px-4 text-sm"
            >
              <Filter className="h-4 w-4" />
              {filter}
              <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border-slate-100 shadow-xl p-2"
            >
              <DropdownMenuLabel className="px-3 py-2 font-extrabold text-[#1E293B]">
                All Orders
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 mx-1" />
              <DropdownMenuItem
                className="px-3 py-2.5 rounded-lg font-bold text-slate-500 cursor-pointer focus:bg-slate-50 focus:text-[#1E293B]"
                onClick={() => setFilter("All Orders")}
              >
                All Orders
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-3 py-2.5 rounded-lg font-bold text-slate-500 cursor-pointer focus:bg-slate-50 focus:text-[#1E293B]"
                onClick={() => setFilter("Paid")}
              >
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-3 py-2.5 rounded-lg font-bold text-slate-500 cursor-pointer focus:bg-slate-50 focus:text-[#1E293B]"
                onClick={() => setFilter("Pending")}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-3 py-2.5 rounded-lg font-bold text-slate-500 cursor-pointer focus:bg-slate-50 focus:text-[#1E293B]"
                onClick={() => setFilter("Failed")}
              >
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                filteredOrders.map((order) => (
                  <TableRow
                    key={order?._id}
                    className="border-slate-50 hover:bg-slate-50/30"
                  >
                    <TableCell className="font-bold text-slate-400 py-5 px-6">
                      #{order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-50">
                          {/* <Cloud className="h-5 w-5 text-indigo-500" /> */}
                          <Image
                            width={40}
                            height={40}
                            src={order.product?.images?.[0]}
                            alt={order.product?.name}
                            className="h-10 w-10 rounded-xl object-cover"
                          />
                        </div>
                        <span className="font-extrabold text-[#1E293B] text-sm">
                          {order.product?.name || "Unknown Product"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400 font-bold py-5 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-extrabold text-[#1E293B] py-5 text-sm">
                      {order.amount !== undefined
                        ? `$${order.amount.toFixed(2)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="py-5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/my-orders/${order._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer h-9 border-slate-200 text-[#1E293B] font-bold rounded-lg px-4 text-xs bg-white hover:bg-slate-50"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 border-slate-200 rounded-lg bg-white hover:bg-slate-50 group"
                          onClick={() => {
                            const fileUrl =
                              order.product?.files?.[order.planType];
                            if (fileUrl) {
                              window.open(fileUrl, "_blank");
                            }
                          }}
                        >
                          <Download className="h-4 w-4 text-slate-400 group-hover:text-[#1E293B]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-20 text-slate-400 font-bold"
                  >
                    No orders found with status "{filter}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold text-slate-400">
            Showing 1 to {filteredOrders.length} of {filteredOrders.length}{" "}
            orders
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-9 border-slate-200 text-slate-400 font-bold rounded-lg px-4 text-xs disabled:opacity-50"
              disabled
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="h-9 border-slate-200 text-[#1E293B] font-bold rounded-lg px-4 text-xs hover:bg-slate-50"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Upgrade Banner */}
      <div className="relative bg-[linear-gradient(90deg,_#6C3FC5_0%,_#4F46E5_100%)] rounded-2xl p-8 md:p-12 overflow-hidden shadow-lg shadow-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-lg space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Upgrade to Platinum
          </h2>
          <p className="text-white/80 font-medium text-sm md:text-base leading-relaxed">
            Unlock dedicated account managers and 24/7 priority support for your
            entire organization.
          </p>
          <Link href={"/dashboard/membership"}>
            <Button className="bg-white text-[#6C3FC5] hover:bg-white/90 font-extrabold rounded-lg px-8 h-12 shadow-sm transition-all text-sm">
              Upgrade Now
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 pointer-events-none">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <polygon
              points="50,5 63,40 95,40 70,60 80,95 50,75 20,95 30,60 5,40 37,40"
              fill="white"
            />
          </svg>
        </div>
      </div>

    </div>
  );
}
