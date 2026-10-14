"use client"

import { 
  DollarSign, 
  Download, 
  PlayCircle, 
  ShoppingCart, 
  Star,
  Zap,
  BookMarked,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useGetUserDashboardQuery } from "@/redux/api/userDashboardApi/overviewAPi"
import Loading from "@/components/Others/Loading"



const inProgressCourses = [
  {
    title: "Advanced YouTube Growth Strategies",
    progress: 65,
    subtitle: "Module 4: Algorithm Secrets",
  },
  {
    title: "Email Marketing Crash Course",
    progress: 12,
    subtitle: "Module 1: Getting Started",
  },
]

export default function OverviewPage() {

  const { data: getUserDashboardData, isLoading, isError } = useGetUserDashboardQuery();
  const dashboardData = getUserDashboardData?.data;

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to fetch dashboard data</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">No dashboard data found</p>
      </div>
    );
  }

const stats = [
  {
    title: "Total Orders",
    value: dashboardData.totalOrders?.toString() || "0",
    change: "",
    changeColor: "text-emerald-500",
    icon: ShoppingCart,
  },
  {
    title: "Active Membership",
    value: dashboardData.activePlan 
      ? typeof dashboardData.activePlan === 'string' 
        ? dashboardData.activePlan.charAt(0).toUpperCase() + dashboardData.activePlan.slice(1)
        : "None"
      : "None",
    change: "",
    changeColor: "text-emerald-500",
    icon: Star,
  },
  {
    title: "Courses Enrolled",
    value: dashboardData.totalPurchasedCourses?.toString() || "0",
    change: "",
    changeColor: "text-emerald-500",
    icon: BookMarked,
  },
  {
    title: "Affiliate Earnings",
    value: "$0",
    change: "",
    changeColor: "text-emerald-500",
    icon: DollarSign,
  },
];

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B]">My Dashboard</h1>
        <p className="text-sm md:text-base text-slate-400 font-medium mt-1">Here is what is happening with your account today.</p>
      </div>

      {/* Banner */}
      <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-xl">
        <CardContent className="p-6 md:p-8 flex flex-col xl:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-md text-center xl:text-left">
            <h3 className="text-lg md:text-xl font-bold text-[#1E293B]">Ready to continue learning?</h3>
            <p className="text-slate-400 text-xs md:text-sm font-medium">
              Pick up right where you left off in your latest course.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 w-full xl:w-auto">
            <Link href={"/dashboard/my-courses"}>
              <Button className="w-full sm:w-auto bg-[#6C3FC5] text-white rounded-md h-11 md:h-12 px-6 font-bold shadow-md shadow-indigo-100">
                <PlayCircle className="mr-2 h-5 w-5 fill-white/20" />
                Continue Course
              </Button>
            </Link>
            <Link href={"/dashboard/downloads"}>
              <Button variant="outline" className="w-full sm:w-auto border-slate-200 text-slate-600 rounded-md h-11 md:h-12 px-6 font-bold bg-white hover:bg-slate-50 transition-all">
                <Download className="mr-2 h-5 w-5 text-slate-400" />
                Download Products
              </Button>
            </Link>
            <Link href={"/dashboard/membership"}>
              <Button variant="outline" className="w-full sm:w-auto border-slate-200 text-slate-600 rounded-md h-11 md:h-12 px-6 font-bold bg-white hover:bg-slate-50 transition-all">
                <Zap className="mr-2 h-5 w-5 text-slate-400" />
                Upgrade Membership
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white border border-slate-100 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[12px] md:text-sm font-bold text-slate-400 uppercase tracking-tight">{stat.title}</CardTitle>
              <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl md:text-3xl font-extrabold text-[#1E293B]">{stat.value}</div>
                <p className={`text-[10px] md:text-[11px] font-bold ${stat.changeColor} mb-1`}>{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Purchases */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#1E293B]">Recent Purchases</h3>
          <Link  href={"/dashboard/my-orders"}>
            <Button variant="link" className="text-[#6366F1] text-xs font-bold p-0 h-auto">
              View all orders
            </Button>
          </Link>
        </div>
        <Card className="bg-white border border-slate-100 shadow-sm overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider px-6 min-w-[120px]">ORDER ID</TableHead>
                  <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider min-w-[200px]">PRODUCT</TableHead>
                  <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider min-w-[120px]">DATE</TableHead>
                  <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider min-w-[100px]">AMOUNT</TableHead>
                  <TableHead className="font-bold text-slate-400 py-4 uppercase text-[10px] tracking-wider text-right pr-6 min-w-[120px]">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(dashboardData.lastThreeOrders || []).map((purchase: any) => (
                  <TableRow key={purchase._id} className="border-slate-50 hover:bg-slate-50/30">
                    <TableCell className="font-bold text-slate-400 py-5 px-6">#{purchase._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell className="font-extrabold text-[#1E293B] py-5">
                      {purchase.itemType === 'PRODUCT' ? 'Digital Product' : purchase.itemType === 'COURSE' ? 'Course' : 'Subscription'}
                    </TableCell>
                    <TableCell className="text-slate-400 font-bold py-5">{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-extrabold text-[#1E293B] py-5">${purchase.amount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell className="py-5 text-right pr-6">
                      <Badge 
                        variant="outline"
                        className={
                          purchase.status === "PAID" || purchase.status === "COMPLETED" 
                            ? "bg-emerald-50 text-emerald-500 border-emerald-100 font-extrabold px-3 py-1 text-[10px] rounded-lg"
                            : "bg-orange-50 text-orange-500 border-orange-100 font-extrabold px-3 py-1 text-[10px] rounded-lg"
                        }
                      >
                        {purchase.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>
    </div>
  )
}