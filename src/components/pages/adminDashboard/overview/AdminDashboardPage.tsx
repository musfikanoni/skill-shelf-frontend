'use client'
import {
  DollarSign,
  ShoppingCart,
  Target,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/card';
import { useGetDashboardOverviewQuery } from '@/redux/api/adminDashboardApi/AdminDashboardApi'
import { InfoBox } from '../infoBox/info-box';
import { StatCard } from '@/components/shared/statCard/state-card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { FaCheckSquare } from 'react-icons/fa';
import { AccessDenied } from '@/components/shared/auth/AccessDenied';

export function AdminDashboardPage () {

  const { isAuthorized, isLoading: isAuthLoading } = useAdminAuth();

  const { data: overviewResponse, isLoading: isOverviewLoading } = useGetDashboardOverviewQuery({}, {
    skip: !isAuthorized
  });

  const {
    totalRevenue = 0,
    totalOrders = 0,
    activeSubscriptions = 0,
    totalProducts = 0,
    totalUsers = 0
  } = overviewResponse?.data || {};

  if (isAuthLoading || (isAuthorized && isOverviewLoading)) {
    return (
      <div className="flex items-center justify-center h-screen -mt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-500 font-medium animate-pulse">Verifying Authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <AccessDenied />;
  }

  return (
    <div className="animate-in fade-in duration-500">
        <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B]">Super Admin Dashboard</h1>
            <p className="text-sm md:text-base text-slate-400 font-medium mt-1">Welcome to the admin panel!</p>
        </div>
        <div className="w-full space-y-8 py-6 md:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
            icon={<DollarSign className="w-6 h-6 text-blue-500" />}
            label="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            borderColor="border-blue-500"
            bgIcon="bg-blue-100/90"
            />
            <StatCard
            icon={<ShoppingCart className="w-6 h-6 text-purple-500" />}
            label="Total Orders"
            value={totalOrders.toLocaleString()}
            borderColor="border-purple-500"
            bgIcon="bg-purple-100/90"
            />
            <StatCard
            icon={<Target className="w-6 h-6 text-orange-500" />}
            label="Active Subscriptions"
            value={activeSubscriptions.toLocaleString()}
            borderColor="border-orange-500"
            bgIcon="bg-orange-100/90"
            />
            <StatCard
            icon={<Users className="w-6 h-6 text-green-500" />}
            label="Total Users"
            value={totalUsers.toLocaleString()}
            borderColor="border-green-500"
            bgIcon="bg-green-100/90"
            />
        </div>

        {/* Admin Panel Section */}
        <Card className="border-2 shadow-lg border-gray-200/80 p-6 md:p-8 bg-white">
            <div className="space-y-6">
            {/* Header */}
            <div className="space-y-3">
                <h2 className="flex items-center gap-2 text-2xl md:text-3xl font-bold text-gray-900">
                Admin Panel is Working!
                <FaCheckSquare className="w-8 h-8 text-green-600" />
                </h2>
                <p className="text-gray-600 text-base">
                You have successfully accessed the admin dashboard. Use the sidebar
                to navigate to different sections.
                </p>
            </div>

            {/* Info Boxes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoBox
                title="Products"
                subtitle={`${totalProducts} items`}
                bgColor="bg-purple-50"
                textColor="text-purple-700"
                subtextColor="text-purple-600"
                borderColor="border-purple-500/30"
                />
                <InfoBox
                title="Orders"
                subtitle={`${totalOrders} total`}
                bgColor="bg-blue-50"
                textColor="text-blue-700"
                subtextColor="text-blue-600"
                borderColor="border-blue-500/30"
                />
                <InfoBox
                title="Users"
                subtitle={`${totalUsers} members`}
                bgColor="bg-green-50"
                textColor="text-green-700"
                subtextColor="text-green-600"
                borderColor="border-green-500/30"
                />
                <InfoBox
                title="Revenue"
                subtitle={`$${Math.round(totalRevenue / 1000)}K total`}
                bgColor="bg-yellow-50"
                textColor="text-yellow-700"
                subtextColor="text-yellow-600"
                borderColor="border-yellow-500/30"
                />
            </div>
            </div>
        </Card>
        </div>
    </div>
  )
}
