'use client'

import { Loader2, SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface Category {
  id: string | number
  name: string
  categoryId: string | number
}

interface CategoryTableProps {
  data: Category[]
  onEdit?: (category: Category) => void
  onDelete?: (category: Category) => void
  isLoading?: boolean
}

export function CategoryTable({
  data,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoryTableProps) {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-slate-200 text-left">
              <TableHead className="h-14 px-6 text-slate-700 text-base font-bold font-inter">
                Category Name
              </TableHead>
              <TableHead className="h-14 px-6 text-slate-700 text-base font-bold font-inter">
                Category ID
              </TableHead>
              <TableHead className="h-14 px-6 text-slate-700 text-base font-bold font-inter">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    <span className="text-slate-500 font-medium">Loading categories...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-slate-500 font-medium">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              data.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-slate-200 hover:bg-slate-50/50 transition-colors"
                >
                  <TableCell className="px-6 py-5">
                    <span className="text-slate-900 text-base font-bold font-inter">
                      {category.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-sm font-bold font-inter">
                      {category.categoryId}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center justify-start gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(category)}
                        className="h-10 w-10 p-0 text-[#9810FA] hover:bg-[#9810FA1A] hover:text-[#9810FA] rounded-lg transition-colors"
                        disabled={isLoading}
                      >
                        <SquarePen size={24} className="!w-6 !h-6" strokeWidth={2.5} />
                        <span className="sr-only">Edit {category.name}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(category)}
                        className="h-10 w-10 p-0 text-[#E7000B] hover:bg-[#E7000B1A] hover:text-[#E7000B] rounded-lg transition-colors"
                        disabled={isLoading}
                      >
                        <Trash2 size={24} className="!w-6 !h-6" strokeWidth={2.5} />
                        <span className="sr-only">Delete {category.name}</span>
                      </Button>
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
