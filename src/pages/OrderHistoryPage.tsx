import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { OrderStatusBadge } from '@/components/ui/OrderStatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { useNavigate } from 'react-router-dom'

export function OrderHistoryPage() {
  const { profile } = useAuth()
  const { orders, loading } = useOrders(profile?.id)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const navigate = useNavigate()

  if (loading) return <PageLoader />

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No orders yet"
        description="Your order history will appear here after you place your first order"
        action={
          <button onClick={() => navigate('/menu')} className="klean-btn-primary">
            Start Ordering
          </button>
        }
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Order History</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id
          const date = new Date(order.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })

          return (
            <div key={order.id} className="klean-card overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-dark-600/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white font-medium text-sm">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">{date}</p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-white">
                    ${order.total_amount.toFixed(2)}
                  </p>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && order.order_items && (
                <div className="border-t border-dark-600 p-4 space-y-4">
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {item.food_name} ×{item.quantity}
                        </span>
                        <span className="text-white">${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dark-600 pt-3 space-y-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-20 shrink-0">Deliver to</span>
                      <span className="text-gray-300">{order.delivery_address}</span>
                    </div>
                    {order.delivery_note && (
                      <div className="flex gap-2">
                        <span className="text-gray-500 w-20 shrink-0">Note</span>
                        <span className="text-gray-300">{order.delivery_note}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}