import { Badge } from '@/components/ui/badge'
import { Subscription } from '@/types/subscriptions.type'

interface Props {
  plan: Subscription['plan']
}

const planConfig = {
  Basic: {
    label: 'Basic',
    className: 'bg-yellow-100 text-yellow-800',
  },
  Pro: {
    label: 'Pro',
    className: 'bg-purple-100 text-purple-800',
  },
  VIP: {
    label: 'VIP',
    className: 'bg-blue-100 text-blue-800',
  },
} as const

export function SubscriptionPlanBadge({ plan }: Props) {
  const config = planConfig[plan]

  if (!config) {
    return <Badge variant="secondary">Unknown</Badge>
  }

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  )
}