'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

interface AffiliateTableHeaderProps {
  onSearch?: (query: string) => void
  onStatusFilter?: (status: string) => void
  searchPlaceholder?: string
  tableTitle?: string
}

export function AffiliateTableHeader({
  onSearch,
  onStatusFilter,
  searchPlaceholder = 'Search Affiliate...',
  tableTitle,
}: AffiliateTableHeaderProps) {
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    onStatusFilter?.(status)
  }

  const getStatusLabel = (status: string) => {
    if (status === 'all') return 'All Status'
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  return (
    <div className="p-6 flex items-center justify-between bg-white border-b border-slate-200">
      <h2 className="text-xl font-bold text-slate-900">{tableTitle}</h2>
      
      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all placeholder:text-slate-300"
          />
        </div>
        
        <div className="relative group">
          <button 
            className="px-4 py-2 rounded-xl outline-1 -outline-offset-1 outline-slate-300 flex justify-between items-center gap-2 bg-white hover:bg-slate-50 transition-all min-w-[120px]"
          >
            <span className="text-slate-900 text-sm font-medium">{getStatusLabel(selectedStatus)}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
 
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl outline-1 -outline-offset-1 outline-slate-200 py-2 flex flex-col z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button 
              onClick={() => handleStatusChange('all')}
              className="w-full px-4 py-2 text-left text-slate-700 text-sm hover:bg-slate-50 transition-colors"
            >
              All Status
            </button>
            <button 
              onClick={() => handleStatusChange('APPROVED')}
              className="w-full px-4 py-2 text-left text-slate-700 text-sm hover:bg-slate-50 transition-colors"
            >
              Approved
            </button>
            <button 
              onClick={() => handleStatusChange('PENDING')}
              className="w-full px-4 py-2 text-left text-slate-700 text-sm hover:bg-slate-50 transition-colors"
            >
              Pending
            </button>
            <button 
              onClick={() => handleStatusChange('REJECT')}
              className="w-full px-4 py-2 text-left text-slate-700 text-sm hover:bg-slate-50 transition-colors"
            >
              Rejected
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}