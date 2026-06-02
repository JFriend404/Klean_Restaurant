import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending:   { label: 'Pending',   className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  preparing: { label: 'Preparing', className: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
  ready:     { label: 'Ready',     className: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
  delivered: { label: 'Delivered', className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={`klean-badge ${config.className}`}>
      {config.label}
    </span>
  )
}