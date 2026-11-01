'use client'

import { Eye, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Order } from '@/types/orders.type'


interface ActionsProps {
  order: Order
  onView?: (order: Order) => void
  onRefresh?: (order: Order) => void
}

export function Actions({ order, onView, onRefresh }: ActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onView?.(order)}
      >
        <Eye className="h-4 w-4 text-purple-600" />
        <span className="sr-only">View order {order.id}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onRefresh?.(order)}
      >
        <RefreshCw className="h-4 w-4 text-red-600" />
        <span className="sr-only">Refresh order {order.id}</span>
      </Button>
    </div>
  )
}
