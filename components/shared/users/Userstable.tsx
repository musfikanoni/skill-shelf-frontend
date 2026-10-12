'use client'

import { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { Membership, Users } from "@/users.type";

type UsersTableProps = {
  data: Users[]
  isLoading?: boolean
  onView?: (user: Users) => void
  onDelete?: (user: Users) => void
  onRefresh?: (user: Users) => void
  onSearch?: (query: string) => void
  onStatusFilter?: (status: Membership | 'all') => void
  totalItems?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  tableTitle?: string
}

export function UsersTable({
  data,
  isLoading = false,
  onView,
  onDelete,

  onSearch,
  onStatusFilter,
  totalItems = 0,
  currentPage: initialPage = 1,
  pageSize = 10,
  onPageChange,
  tableTitle = "User Management",
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [searchQuery, setSearchQuery] = useState('')
  const [membershipFilter, setMembershipFilter] = useState<Membership | 'all'>('all')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    onSearch?.(query)
  }

  const handleMembershipFilter = (membership: Membership | 'all') => {
    setMembershipFilter(membership)
    setCurrentPage(1)
    onStatusFilter?.(membership)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    onPageChange?.(page)
  }

  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className="w-full bg-white rounded-lg shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] outline-2 outline-offset-[-2px] outline-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-white border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900">{tableTitle}</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users......"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="relative">
            <select 
              value={membershipFilter}
              onChange={(e) => handleMembershipFilter(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-medium text-slate-700 focus:outline-none min-w-[120px] cursor-pointer"
            >
              <option value="all">All Plans</option>
              <option value="VIP">VIP</option>
              <option value="Pro">Pro</option>
              <option value="Basic">Basic</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-b border-slate-100">
              <TableHead className="px-6 py-4 font-bold text-[#1E293B] text-center">Name</TableHead>
              <TableHead className="px-6 py-4 font-bold text-[#1E293B] text-center">Email</TableHead>
              <TableHead className="px-6 py-4 font-bold text-[#1E293B] text-center">Membership</TableHead>
              <TableHead className="px-6 py-4 font-bold text-[#1E293B] text-center">Purchases</TableHead>
              <TableHead className="px-6 py-4 font-bold text-[#1E293B] text-center">Total Spent</TableHead>
              <TableHead className="px-6 py-4 font-bold text-[#1E293B] text-center">Joined</TableHead>
              <TableHead className="px-6 py-4 font-bold text-[#1E293B] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i} className="h-16 border-b border-slate-50">
                  <TableCell colSpan={7}><Skeleton className="h-4 w-full" /></TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-400 text-sm">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((user: any, index) => (
                <TableRow
                  key={index}
                  className="h-16 border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="px-6 text-center text-slate-600 text-sm font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-6 text-center text-slate-900 text-sm font-bold">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-6 text-center">
                    <div className={cn(
                      "inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase",
                      user.membership === 'VIP' ? "bg-blue-50 text-blue-500" :
                      user.membership === 'Pro' ? "bg-purple-50 text-purple-500" :
                      "bg-amber-50 text-amber-500"
                    )}>
                      {user.membership}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 text-center text-slate-900 text-sm font-bold">
                    {user.purchases || '0'}
                  </TableCell>
                  <TableCell className="px-6 text-center text-slate-900 text-sm font-extrabold">
                    ${(user.totalSpent || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 text-center text-slate-400 text-sm font-medium">
                    {new Date(user.joined).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onView?.(user)}
                        className="text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                      <button 
                        onClick={() => onDelete?.(user)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 flex items-center justify-between bg-white border-t border-slate-100">
        <div className="text-slate-400 text-xs font-medium">
          Showing <span className="text-slate-900 font-bold">{data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="text-slate-900 font-bold">{totalItems}</span> users
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-10 px-4 rounded-xl border-slate-200 text-slate-400 font-bold hover:bg-slate-50 disabled:opacity-30"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "w-10 h-10 rounded-xl font-bold transition-all",
                  currentPage === page
                    ? "bg-[#F59E0B] text-white border-none shadow-md shadow-orange-100"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                )}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-10 px-4 rounded-xl border-slate-200 text-slate-400 font-bold hover:bg-slate-50 disabled:opacity-30"
          >
            Next
          </Button>
        </div>
      </div>

      </div>
  )
}