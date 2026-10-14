"use client";

import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { useGetMyOrderByIdQuery } from "@/redux/api/userDashboardApi/ordersApi";
import { useParams } from "next/navigation";
import Loading from "@/components/Others/Loading";
import { OrderDetailsData } from "@/types/orders.type";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data, isLoading, isError } = useGetMyOrderByIdQuery(orderId);

  const order: OrderDetailsData = (data?.data as OrderDetailsData) || data;

  console.log("order data--------", order);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to fetch order details</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Order not found</p>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadInvoice = () => {
    if (!order) return;

    const doc = new jsPDF();

    // Add Header
    doc.setFontSize(22);
    doc.setTextColor(108, 63, 197); // #6C3FC5 purple
    doc.text("INVOICE", 105, 20, { align: "center" });

    // Order Info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Order ID: #${order._id.substring(0, 8)}`, 20, 40);
    doc.text(`Date: ${formattedDate}`, 20, 46);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 52);

    // Billing Information
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Billing Information", 20, 70);
    doc.setLineWidth(0.5);
    doc.line(20, 72, 190, 72);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Name: ${order.user.name}`, 20, 80);
    doc.text(`Email: ${order.user.email}`, 20, 86);

    // Product Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Product Details", 20, 106);
    doc.line(20, 108, 190, 108);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Product: ${order.itemType}`, 20, 116);
    doc.text(`Plan: ${order.planType}`, 20, 122);
    doc.text(`Quantity: ${order.quantity}`, 20, 128);
    doc.text(`Price: $${order.amount.toFixed(2)}`, 20, 134);

    // Total Amount
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Total Amount", 140, 154);
    doc.setTextColor(108, 63, 197);
    doc.text(`$${order.amount.toFixed(2)}`, 140, 162);

    doc.save(`Invoice_${order._id.substring(0, 8)}.pdf`);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Back Button */}
      <Link
        href="/dashboard/my-orders"
        className="flex items-center gap-2 text-slate-400 hover:text-[#1E293B] font-medium text-sm transition-colors group w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Banner */}
      <div className="bg-[#6C3FC5] rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Order Details
          </h1>
          <p className="text-white/80 text-sm font-medium">
            Order ID #{order._id.slice(-6).toUpperCase()}
          </p>
        </div>
        <Button
          onClick={handleDownloadInvoice}
          className="bg-white text-[#6C3FC5] hover:bg-slate-50 font-bold rounded-lg h-11 px-6 shadow-sm gap-2"
        >
          <FileText className="h-4 w-4" />
          Download Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Information & Products */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Information Card */}
          <Card className="bg-white border-none shadow-sm rounded-2xl p-8">
            <h3 className="text-lg font-bold text-[#1E293B] mb-8">
              Order Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Order ID
                  </p>
                  <p className="text-sm font-bold text-[#1E293B]">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Order Date
                  </p>
                  <p className="text-sm font-bold text-[#1E293B]">
                    {formattedDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Status
                  </p>
                  <p className="text-sm font-bold text-emerald-500 capitalize">
                    {order.status.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Products List */}
          <Card className="bg-white border-none shadow-sm rounded-2xl p-8">
            <h3 className="text-lg font-bold text-[#1E293B] mb-8">Products</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-purple-50 flex items-center justify-center rounded-xl shrink-0">
                    <Package className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#1E293B] text-sm capitalize">
                      {order.itemType.toLowerCase()} (Plan: {order.planType})
                    </h4>
                    <p className="text-xs font-bold text-slate-400">
                      Quantity: {order.quantity}{" "}
                      <span className="ml-2 text-[#6C3FC5] font-bold text-base">
                        ${order.amount.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>

                <Link href={"/dashboard/downloads"}>
                  <Button
                    // onClick={handleDownloadInvoice}
                    className="bg-[#F5C518] hover:bg-[#E5B508] text-black font-bold rounded-lg h-11 px-6 shadow-md shadow-yellow-100 gap-2 shrink-0"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Summaries & Billing */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Summary */}
          <Card className="bg-white border-none shadow-sm rounded-2xl p-8">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6">
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">
                  Subtotal
                </span>
                <span className="text-sm font-bold text-[#1E293B]">
                  ${order.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#1E293B]">
                  Total
                </span>
                <span className="text-2xl font-bold text-[#6C3FC5]">
                  ${order.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Billing Info */}
          <Card className="bg-white border-none shadow-sm rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-5 w-5 text-slate-400" />
              <h3 className="text-lg font-bold text-[#1E293B]">Billing Info</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Name
                </p>
                <p className="text-sm font-bold text-[#1E293B]">
                  {order.user.name}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Email
                </p>
                <p className="text-sm font-bold text-[#1E293B]">
                  {order.user.email}
                </p>
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="bg-white border-none shadow-sm rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <h3 className="text-lg font-bold text-[#1E293B]">Payment</h3>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100 flex items-center gap-4 break-all">
              <div className="h-10 w-12 bg-[#6C3FC5] rounded-lg flex items-center justify-center shrink-0">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1E293B]">
                  Stripe Session
                </p>
                <p className="text-[10px] font-bold text-slate-400">
                  {order.stripeSessionId.substring(0, 15)}...
                </p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
