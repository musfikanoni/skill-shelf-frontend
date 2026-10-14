'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from './StatusBadge'
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { OrdersTableProps, OrderStatus } from '@/types/orders.type'
import { Actions } from './Actions'
import { OrderTableHeader } from './OrderTableHeader'


export function OrdersTable({
  data,
  isLoading = false,
  onView,
  onRefresh,
  onSearch,
  onStatusFilter,
  totalItems: initialTotalItems = 0,
  currentPage: initialPage = 1,
  pageSize = 10,
  onPageChange,
  tableTitle,
}: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    onSearch?.(query)
  }

  const handleStatusFilter = (status: OrderStatus | 'all') => {
    setStatusFilter(status)
    setCurrentPage(1)
    onStatusFilter?.(status)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }

  // Client-side filtering logic
  const filteredData = useMemo(() => {
    return data.filter((order) => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="w-full space-y-6">
      <OrderTableHeader
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        tableTitle={tableTitle}
      />

      <Card className="bg-white rounded-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] outline-2 outline-offset-[-2px] outline-slate-200 border-none overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 h-14 border-b border-slate-200">
                <TableHead className="pl-6 font-bold text-slate-900 text-start">
                  Order ID
                </TableHead>

                <TableHead className="px-6 font-bold text-slate-900 text-start">
                  Customer
                </TableHead>

                <TableHead className="px-6 font-bold text-slate-900 text-start">
                  Email
                </TableHead>

                <TableHead className="px-6 font-bold text-slate-900 text-start">
                  Amount
                </TableHead>

                <TableHead className="px-6 font-bold text-slate-900 text-start">
                  Date
                </TableHead>

                <TableHead className="px-6 font-bold text-slate-900 text-start">
                  Status
                </TableHead>

                <TableHead className="px-6 font-bold text-slate-900 text-start">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i} className="h-16">
                    <TableCell className="pl-6"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="px-6"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="px-6"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="px-6"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="px-6"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="px-6"><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="px-6"><Skeleton className="h-4 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((order) => (
                  <TableRow key={order.id} className="h-16 bg-white hover:bg-slate-50 border-b border-slate-100 transition-colors">
                    <TableCell className="pl-6 font-bold text-slate-900 uppercase">
                      #{order.id.slice(-8)}
                    </TableCell>

                    <TableCell className="px-6 text-slate-900 font-bold">
                      {order.customerName}
                    </TableCell>

                    <TableCell className="px-6 text-slate-500 font-medium">
                      {order.email}
                    </TableCell>

                    <TableCell className="px-6 font-bold text-slate-900">
                      ${order.amount.toLocaleString()}
                    </TableCell>

                    <TableCell className="px-6 text-slate-600 font-medium">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>

                    <TableCell className="px-6">
                      <StatusBadge status={order.status} />
                    </TableCell>

                    <TableCell className="px-6">
                      <Actions
                        order={order}
                        onView={onView}
                        onRefresh={onRefresh}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {totalPages > 1 && (
        <div className="h-20 px-6 border-t border-slate-200 flex items-center justify-between bg-white rounded-lg shadow-sm">
          <div className="text-slate-500 text-sm font-medium">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{' '}
            orders
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant={'outline'}
              className="!h-10 rounded-lg border-slate-300 text-slate-700 font-bold"
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1
                // Show max 5 pages for brevity
                if (totalPages > 5 && Math.abs(currentPage - page) > 2) return null;

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "!h-10 w-10 p-0 rounded-lg font-bold",
                      currentPage === page
                        ? "bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-black border-none"
                        : "border-slate-300 text-slate-700"
                    )}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant={'outline'}
              className="!h-10 rounded-lg border-slate-300 text-slate-700 font-bold"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}