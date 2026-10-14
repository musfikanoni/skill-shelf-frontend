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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
      <h2 className="text-slate-900 text-xl font-bold font-inter leading-7">
        {tableTitle}
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="w-full md:w-[400px] !h-14 px-4 py-2 rounded-lg outline-2 outline-offset-[-2px] outline-slate-300 flex items-center gap-2 bg-white">
          <Search className="w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="flex-1 bg-transparent outline-none text-slate-700 text-base font-medium font-inter placeholder:text-slate-700/50"
          />
        </div>

        {/* Status Filter */}
        <Select onValueChange={(value) => onStatusFilter?.(value as OrderStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-48 !h-14 px-3 py-2 rounded-lg border-2 border-slate-300 shadow-none focus:ring-0 flex justify-between items-center bg-white text-slate-900 text-base font-medium">
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
