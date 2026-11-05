'use client'

import { Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderStatus } from '@/types/orders.type'

interface TableHeaderProps {
  onSearch?: (query: string) => void
  onStatusFilter?: (status: OrderStatus | 'all') => void
  searchPlaceholder?: string
  tableTitle?: string
}

export function OrderTableHeader({
  onSearch,
  onStatusFilter,
  searchPlaceholder = 'Search by customer or order ID...',
  tableTitle = 'All Orders',
}: TableHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 w-full">
      <h2 className="text-slate-900 text-xl font-bold font-inter leading-7 shrink-0">
        {tableTitle}
      </h2>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
        {/* Search Input */}
        <div className="w-full sm:w-64 md:w-72 lg:w-96 !h-12 sm:!h-14 px-4 py-2 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center gap-2 bg-white">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="flex-1 min-w-0 bg-transparent outline-none text-slate-700 text-sm sm:text-base font-medium font-inter placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter */}
        <Select onValueChange={(value) => onStatusFilter?.(value as OrderStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-44 !h-12 sm:!h-14 px-3 py-2 rounded-lg border-2 border-slate-300 shadow-none focus:ring-0 flex justify-between items-center bg-white text-slate-900 text-sm sm:text-base font-medium shrink-0">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent sideOffset={6} className="rounded-lg">
            <SelectItem value="all" className="py-2 px-4">All Status</SelectItem>
            <SelectItem value="paid" className="py-2 px-4">Paid</SelectItem>
            <SelectItem value="pending" className="py-2 px-4">Pending</SelectItem>
            <SelectItem value="failed" className="py-2 px-4">Failed</SelectItem>
            <SelectItem value="refunded" className="py-2 px-4">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
