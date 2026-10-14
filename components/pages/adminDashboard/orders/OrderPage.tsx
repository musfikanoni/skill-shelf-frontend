"use client";

import { useMemo, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AccessDenied } from "@/components/shared/auth/AccessDenied";
import { Order, OrderStatus } from "@/types/orders.type";
import { OrdersTable } from "@/components/shared/orders/Table";
import { useGetAllOrdersQuery } from "@/redux/api/userDashboardApi/ordersApi";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { useDebounce } from "@/hooks/useDebounce";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { isAuthorized, isLoading: isAuthLoading } = useAdminAuth();

  const { data: response, isLoading: isOrdersLoading } = useGetAllOrdersQuery(undefined, {
    skip: !isAuthorized
  });

  const allOrders: Order[] = useMemo(() => {
    if (!response?.data) return [];
    
    return [...response.data]
      .map((order: any) => ({
        id: order._id,
        customerId: order.user?._id || '',
        customerName: order.user?.name || 'Anonymous',
        email: order.user?.email || '',
        amount: order.amount || 0,
        date: order.createdAt || new Date().toISOString(),
        status: (order.status?.toLowerCase() || 'pending') as OrderStatus
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [response]);

  // 5. Apply Filtering Logic (Debounced Search + Status)
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allOrders, debouncedSearchTerm, statusFilter]);

  // 6. Calculate Stats
  const stats = useMemo(() => {
    const orders = allOrders;
    const totalOrders = orders.length;
    const completed = orders.filter((o) => o.status === 'completed' || o.status === 'paid').length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const refunded = orders.filter((o) => o.status === 'refunded').length;

    return {
      totalOrders,
      completed,
      pending,
      refunded
    };
  }, [allOrders]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrderId(order.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen -mt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-500 font-medium animate-pulse">Verifying Authorization...</p>
        </div>
      </div>
    );
  }

  // If unauthorized, show shared Access Denied UI
  if (!isAuthorized) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 font-medium text-sm">
          Manage customer orders and process refunds
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-purple-400 h-32 flex flex-col justify-center gap-2 shadow-sm">
          <span className="text-purple-600 text-sm font-semibold">Total Orders</span>
          <span className="text-slate-900 text-3xl font-bold">{stats.totalOrders.toLocaleString()}</span>
        </div>

        <div className="bg-white p-6 rounded-lg border border-emerald-500 h-32 flex flex-col justify-center gap-2 shadow-sm">
          <span className="text-emerald-600 text-sm font-semibold">Completed</span>
          <span className="text-slate-900 text-3xl font-bold">{stats.completed.toLocaleString()}</span>
        </div>

        <div className="bg-white p-6 rounded-lg border border-amber-400 h-32 flex flex-col justify-center gap-2 shadow-sm">
          <span className="text-amber-600 text-sm font-semibold">Pending</span>
          <span className="text-slate-900 text-3xl font-bold">{stats.pending.toLocaleString()}</span>
        </div>

        <div className="bg-white p-6 rounded-lg border border-red-400 h-32 flex flex-col justify-center gap-2 shadow-sm">
          <span className="text-slate-800 text-sm font-semibold">Refunded</span>
          <span className="text-red-500 text-3xl font-bold">{stats.refunded.toLocaleString()}</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="sm:py-2">
        <OrdersTable
            data={filteredOrders}
            isLoading={isOrdersLoading}
            totalItems={filteredOrders.length}
            pageSize={10}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onSearch={setSearchTerm}
            onStatusFilter={setStatusFilter}
            onView={handleViewDetails}
        />
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
