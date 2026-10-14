'use client'

import {SquarePen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Subscription as Affiliate } from '@/types/subscriptions.type'

interface AffiliateActionProps {
  subscription: Affiliate
  onView?: (item: Affiliate) => void
  onRefresh?: (item: Affiliate) => void
}

export function AffiliateAction({
  subscription,
  onView,
  onRefresh,
}: AffiliateActionProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onView?.(subscription)}
      >
        <SquarePen className="h-4 w-4 text-purple-600" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onRefresh?.(subscription)}
      >
        <X className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  )
}