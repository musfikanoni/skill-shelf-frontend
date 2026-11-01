'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { AffiliateTableHeader } from './AffiliateTableHeader'
import { cn } from "@/lib/utils"
import { Check, X, Pencil, Trash2 } from 'lucide-react'

export interface Affiliate {
  _id: string
  user: {
    name: string
    email: string
    totalCommission: number
  }
  referredUser: {
    name: string
    email: string
  }
  amount: number
  status: 'APPROVED' | 'PENDING' | 'REJECT'
  createdAt: string
}

interface AffiliateTableProps {
  data: Affiliate[]
  isLoading?: boolean
  onApprove?: (item: Affiliate) => void
  onReject?: (item: Affiliate) => void
  onDelete?: (item: Affiliate) => void
  onViewDetails?: (item: Affiliate) => void
  onSearch?: (query: string) => void
  onStatusFilter?: (status: string) => void
  totalItems?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  tableTitle?: string
}

export function AffiliateTable({
  data,
  isLoading = false,
  onApprove,
  onReject,
  onDelete,
  onViewDetails,
  onSearch,
  onStatusFilter,
  totalItems = 0,
  currentPage: initialPage = 1,
  pageSize = 10,
  onPageChange,
  tableTitle = "All Affiliates",
}: AffiliateTableProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const handleSearch = (query: string) => {
    setCurrentPage(1)
    onSearch?.(query)
  }

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <AffiliateTableHeader
        onSearch={handleSearch}
        onStatusFilter={onStatusFilter}
        tableTitle={tableTitle}
        searchPlaceholder="Search Affiliate..."
      />

      <div className="flex-1 overflow-auto">
        <Table className="border-collapse">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="h-14 border-b border-slate-200 bg-slate-50 hover:bg-slate-50">
              <TableHead className="w-36 pl-6 py-4 font-bold text-slate-700 text-base">Name</TableHead>
              <TableHead className="w-52 px-6 py-4 font-bold text-slate-700 text-base text-left">Email</TableHead>
              <TableHead className="w-44 px-6 py-4 font-bold text-slate-700 text-base text-center">Referred User</TableHead>
              <TableHead className="w-32 px-6 py-4 font-bold text-slate-700 text-base text-center">Earnings</TableHead>
              <TableHead className="w-36 px-6 py-4 font-bold text-slate-700 text-base text-center">Status</TableHead>
              <TableHead className="w-36 pr-6 py-4 font-bold text-slate-700 text-base text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i} className="h-16 border-b border-slate-200">
                  <TableCell colSpan={6}><Skeleton className="h-4 w-full" /></TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400 text-sm">
                  No affiliates found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={item._id || index}
                  className="h-16 border-b border-slate-200 hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="w-36 pl-6 font-normal text-slate-700 text-base">
                    {item.user?.name}
                  </TableCell>
                  <TableCell className="w-52 px-6 font-bold text-slate-900 text-base">
                    {item.user?.email}
                  </TableCell>
                  <TableCell className="w-44 px-6 text-center font-normal text-slate-600 text-base">
                    {item.referredUser?.name}
                  </TableCell>
                  <TableCell className="w-32 px-6 text-center font-semibold text-slate-900 text-base">
                    ${item.amount}
                  </TableCell>
                  <TableCell className="w-36 px-6 text-center">
                    <div className={cn(
                      "inline-flex px-3 py-1 rounded-[10px] justify-center items-center text-sm font-bold capitalize",
                      item.status === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                      item.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {item.status.toLowerCase()}
                    </div>
                  </TableCell>
                  <TableCell className="w-36 pr-6">
                    <div className="flex justify-center items-center gap-2">
                      {item.status === 'PENDING' && (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => onApprove?.(item)}
                            className="p-1.5 bg-emerald-100 text-emerald-700 rounded-[10px] flex items-center gap-1 hover:bg-emerald-200 transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                            <span className="text-xs font-semibold pr-1">Approve</span>
                          </button>
                          <button
                            onClick={() => onReject?.(item)}
                            className="p-1.5 bg-red-100 text-red-700 rounded-[10px] flex items-center gap-1 hover:bg-red-200 transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                            <span className="text-xs font-semibold pr-1">Reject</span>
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={() => onDelete?.(item)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-[10px] flex items-center gap-1 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {item.status === 'APPROVED' && (
                        <button
                          onClick={() => onViewDetails?.(item)}
                          className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-[10px] text-xs font-semibold hover:bg-purple-200 transition-colors whitespace-nowrap"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}