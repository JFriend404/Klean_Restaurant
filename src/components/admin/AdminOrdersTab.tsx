import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { OrderStatusBadge } from '@/components/ui/OrderStatusBadge'
import { PageLoader } from '@/components/ui/Spinner'
import type { Order, OrderStatus } from '@/types'
import toast from 'react-hot-toast'

const ORDER_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled',
]

export function AdminOrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*), profile:profiles(full_name, email)')
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
  const { error } = await supabase
    .from('orders')
    .update({ status } as { status: OrderStatus })
    .eq('id', orderId)

  if (error) {
    toast.error('Failed to update status')
  } else {
    toast.success('Order status updated')
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }
}

  if (loading) return <PageLoader />

  return (
    <div className="space-y-3">
      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-500">No orders yet.</div>
      )}
      {orders.map((order) => {
        const isExpanded = expandedId === order.id
        const date = new Date(order.created_at).toLocaleString()

        return (
          <div key={order.id} className="klean-card overflow-hidden">
            <div
              className="p-4 flex flex-wrap items-center gap-4 cursor-pointer hover:bg-dark-600/30 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-gray-500 text-xs">{date}</p>
                {order.profile && (
                  <p className="text-gray-400 text-xs mt-0.5">
                    {order.profile.full_name || order.profile.email}
                  </p>
                )}
              </div>

              <OrderStatusBadge status={order.status} />

              {/* Status changer */}
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                onClick={(e) => e.stopPropagation()}
                className="bg-dark-600 border border-dark-400 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-green"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              <p className="font-semibold text-white text-sm">
                ${order.total_amount.toFixed(2)}
              </p>
            </div>

            {isExpanded && order.order_items && (
              <div className="border-t border-dark-600 p-4 space-y-3">
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
                <div className="text-sm text-gray-500 pt-2 border-t border-dark-600 space-y-1">
                  <p><span className="text-gray-400">Name:</span> {order.delivery_name}</p>
                  <p><span className="text-gray-400">Phone:</span> {order.delivery_phone}</p>
                  <p><span className="text-gray-400">Address:</span> {order.delivery_address}</p>
                  {order.delivery_note && (
                    <p><span className="text-gray-400">Note:</span> {order.delivery_note}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}