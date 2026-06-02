import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'

export function useOrders(userId: string | undefined) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setOrders((data as Order[]) || [])
      }
      setLoading(false)
    }

    fetchOrders()
  }, [userId])

  return { orders, loading, error, setOrders }
}