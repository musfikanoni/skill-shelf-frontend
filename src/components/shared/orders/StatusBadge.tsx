import { Badge } from '@/components/ui/badge'
import { OrderStatus } from '@/types/orders.type';

interface StatusBadgeProps {
  status: OrderStatus | string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  paid: {
    label: 'Paid',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase() || 'pending';
  const config = statusConfig[normalizedStatus] || {
    label: normalizedStatus,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
  };

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}
