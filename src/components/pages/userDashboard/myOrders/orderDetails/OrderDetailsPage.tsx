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
  BookOpen,
  PlayCircle,
  Sparkles,
  Lock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
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
    doc.text(`Order ID: #${order._id ? order._id.substring(0, 8) : "N/A"}`, 20, 40);
    doc.text(`Date: ${formattedDate}`, 20, 46);
    doc.text(`Status: ${(order.status || "COMPLETED").toUpperCase()}`, 20, 52);

    // Billing Information
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Billing Information", 20, 70);
    doc.setLineWidth(0.5);
    doc.line(20, 72, 190, 72);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Name: ${order.user?.name || "Customer"}`, 20, 80);
    doc.text(`Email: ${order.user?.email || "N/A"}`, 20, 86);

    // Product Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Product Details", 20, 106);
    doc.line(20, 108, 190, 108);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Product: ${order.product?.name || order.itemType || "Product"}`, 20, 116);
    doc.text(`Plan: ${order.planType || "Standard"}`, 20, 122);
    doc.text(`Quantity: ${order.quantity || 1}`, 20, 128);
    doc.text(`Price: $${order.amount !== undefined ? Number(order.amount).toFixed(2) : "0.00"}`, 20, 134);

    // Total Amount
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Total Amount", 140, 154);
    doc.setTextColor(108, 63, 197);
    doc.text(`$${order.amount !== undefined ? Number(order.amount).toFixed(2) : "0.00"}`, 140, 162);

    doc.save(`Invoice_${order._id ? order._id.substring(0, 8) : "order"}.pdf`);
  };

  const isBundle =
    order.itemType === "BUNDLE" ||
    (order.product as any)?.category?.name === "Bundle Package" ||
    !!(order.product as any)?.courses?.length ||
    !!(order.product as any)?.products?.length;

  const bundleProducts: any[] = (order.product as any)?.products || [];
  const bundleCourses: any[] = (order.product as any)?.courses || [];
  const isPaid = order.status?.toUpperCase() === "PAID";

  return (
    <div className="space-y-6 pb-10">
      {/* Back Button */}
      <Link
        href="/user-dashboard/my-orders"
        className="flex items-center gap-2 text-slate-400 hover:text-[#1E293B] font-medium text-sm transition-colors group w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Banner */}
      <div className="bg-[#6C3FC5] rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Order Details
            </h1>
            {isBundle && (
              <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Bundle Package
              </span>
            )}
          </div>
          <p className="text-white/80 text-sm font-medium">
            Order ID #{order._id ? order._id.slice(-6).toUpperCase() : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isBundle && (
            <>
              {isPaid ? (
                <>
                  <Link href="/user-dashboard/my-courses">
                    <Button className="bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg h-11 px-5 border border-white/30 gap-2 cursor-pointer transition-colors">
                      <PlayCircle className="h-4 w-4" />
                      Watch Courses
                    </Button>
                  </Link>
                  <Link href="/user-dashboard/downloads">
                    <Button className="bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg h-11 px-5 border border-white/30 gap-2 cursor-pointer transition-colors">
                      <Download className="h-4 w-4" />
                      My Downloads
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-black/20 rounded-xl text-white/90 text-xs font-bold border border-white/20">
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  Access Locked (Payment {order.status})
                </div>
              )}
            </>
          )}
          <Button
            onClick={handleDownloadInvoice}
            className="bg-white text-[#6C3FC5] hover:bg-slate-50 font-bold rounded-lg h-11 px-6 shadow-sm gap-2 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </div>

      {/* Payment Pending Alert Banner */}
      {!isPaid && (
        <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start sm:items-center gap-3.5 text-amber-900 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-sm">
            <span className="font-bold text-amber-950 block">
              Payment Pending — Content Locked
            </span>
            <span>
              Your order payment status is currently{" "}
              <span className="font-bold uppercase text-amber-800">
                {order.status || "PENDING"}
              </span>
              . Video course lessons and digital file downloads will be unlocked as soon as payment is confirmed.
            </span>
          </div>
        </div>
      )}

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
                    #{order._id ? order._id.slice(-6).toUpperCase() : ""}
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

          {/* Items Included Section */}
          <Card className="bg-white border-none shadow-sm rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">
                  {isBundle ? "Items Included in this Bundle" : "Purchased Item"}
                </h3>
                {isBundle && (
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    This package provides complete access to digital books & video courses.
                  </p>
                )}
              </div>
              {isBundle && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                    {bundleProducts.length} Product{bundleProducts.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">
                    {bundleCourses.length} Course{bundleCourses.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {isBundle ? (
              <div className="space-y-6">
                {/* 1. Books / Products Section */}
                {bundleProducts.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Digital Books & Products ({bundleProducts.length})
                    </h4>
                    <div className="space-y-3">
                      {bundleProducts.map((prod: any) => (
                        <div
                          key={prod._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-blue-50 border border-blue-100 flex items-center justify-center rounded-xl shrink-0">
                              <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-bold text-[#1E293B] text-sm">
                                {prod.name}
                              </h5>
                              <p className="text-xs text-slate-400 font-medium">
                                E-book / Product • Lifetime Download Access
                              </p>
                            </div>
                          </div>

                          {isPaid ? (
                            <Link href="/user-dashboard/downloads">
                              <Button
                                size="sm"
                                className="bg-[linear-gradient(180deg,_#F5C518_0%,_#EFA00B_100%)] hover:opacity-90 text-black font-bold rounded-lg h-9 px-4 gap-2 text-xs shrink-0 cursor-pointer shadow-sm"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download Book
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              size="sm"
                              disabled
                              className="bg-slate-100 text-slate-400 font-bold rounded-lg h-9 px-4 gap-2 text-xs shrink-0 cursor-not-allowed border border-slate-200 shadow-none"
                              title="Payment pending — download locked"
                            >
                              <Lock className="h-3.5 w-3.5 text-slate-400" />
                              Download Locked
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Video Courses Section */}
                {bundleCourses.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-purple-600" />
                      Video Courses ({bundleCourses.length})
                    </h4>
                    <div className="space-y-3">
                      {bundleCourses.map((course: any) => (
                        <div
                          key={course._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-purple-50 border border-purple-100 flex items-center justify-center rounded-xl shrink-0">
                              <PlayCircle className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <h5 className="font-bold text-[#1E293B] text-sm">
                                {course.title}
                              </h5>
                              <p className="text-xs text-slate-400 font-medium">
                                {course.instructor ? `Instructor: ${course.instructor} • ` : ""}Video Lessons
                              </p>
                            </div>
                          </div>

                          {isPaid ? (
                            <Link href="/user-dashboard/my-courses">
                              <Button
                                size="sm"
                                className="bg-[#6C3FC5] hover:bg-[#5b32aa] text-white font-bold rounded-lg h-9 px-4 gap-2 text-xs shrink-0 cursor-pointer shadow-sm"
                              >
                                <PlayCircle className="h-3.5 w-3.5" />
                                Watch Videos
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              size="sm"
                              disabled
                              className="bg-slate-100 text-slate-400 font-bold rounded-lg h-9 px-4 gap-2 text-xs shrink-0 cursor-not-allowed border border-slate-200 shadow-none"
                              title="Payment pending — course watch locked"
                            >
                              <Lock className="h-3.5 w-3.5 text-slate-400" />
                              Watch Locked
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bundleProducts.length === 0 && bundleCourses.length === 0 && (
                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-[#1E293B] text-sm">
                        {order.product?.name || "Bundle Package"}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        Access all bundled courses in My Courses and books in Downloads once paid.
                      </p>
                    </div>
                    {isPaid ? (
                      <div className="flex items-center gap-2">
                        <Link href="/user-dashboard/my-courses">
                          <Button className="bg-[#6C3FC5] hover:bg-[#5b32aa] text-white font-bold rounded-lg h-9 px-4 text-xs">
                            My Courses
                          </Button>
                        </Link>
                        <Link href="/user-dashboard/downloads">
                          <Button className="bg-[#F5C518] hover:bg-[#E5B508] text-black font-bold rounded-lg h-9 px-4 text-xs">
                            My Downloads
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg">
                        <Lock className="w-3.5 h-3.5" /> Payment Pending
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Regular Single Product or Course */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-purple-50 flex items-center justify-center rounded-xl shrink-0">
                    <Package className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#1E293B] text-base">
                      {order.product?.name || (order.itemType ? order.itemType.toLowerCase() : "Product")}
                    </h4>
                    <p className="text-xs font-medium text-slate-500">
                      {order.planType && `Plan: ${order.planType} • `}Quantity: {order.quantity || 1}{" "}
                      <span className="ml-2 text-[#6C3FC5] font-bold text-base">
                        ${order.amount !== undefined ? Number(order.amount).toFixed(2) : "0.00"}
                      </span>
                    </p>
                  </div>
                </div>

                {isPaid ? (
                  order.itemType === "COURSE" ? (
                    <Link href="/user-dashboard/my-courses">
                      <Button className="bg-[#6C3FC5] hover:bg-[#5b32aa] text-white font-bold rounded-lg h-11 px-6 shadow-sm gap-2 shrink-0 cursor-pointer">
                        <PlayCircle className="h-4 w-4" />
                        Watch Videos
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/user-dashboard/downloads">
                      <Button className="bg-[#F5C518] hover:bg-[#E5B508] text-black font-bold rounded-lg h-11 px-6 shadow-md shadow-yellow-100 gap-2 shrink-0 cursor-pointer">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </Link>
                  )
                ) : (
                  <Button
                    disabled
                    className="bg-slate-100 text-slate-400 font-bold rounded-lg h-11 px-6 gap-2 shrink-0 cursor-not-allowed border border-slate-200 shadow-none"
                    title="Payment pending — access locked"
                  >
                    <Lock className="h-4 w-4 text-slate-400" />
                    {order.itemType === "COURSE" ? "Watch Locked (Pending)" : "Download Locked (Pending)"}
                  </Button>
                )}
              </div>
            )}
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
                  ${order.amount !== undefined ? Number(order.amount).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[#1E293B]">
                  Total
                </span>
                <span className="text-2xl font-bold text-[#6C3FC5]">
                  ${order.amount !== undefined ? Number(order.amount).toFixed(2) : "0.00"}
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
                  {order.user?.name || "Customer"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Email
                </p>
                <p className="text-sm font-bold text-[#1E293B]">
                  {order.user?.email || "N/A"}
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
                  {order.stripeSessionId
                    ? `${order.stripeSessionId.substring(0, 18)}...`
                    : "Completed via Stripe"}
                </p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
