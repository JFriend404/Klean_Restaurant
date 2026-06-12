import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/stores/cartStore'
import { useAuth } from '@/hooks/useAuth'
import type { CheckoutFormData } from '@/types'
import toast from 'react-hot-toast'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { items, totalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<CheckoutFormData>({
    delivery_name: profile?.full_name ?? '',
    delivery_phone: profile?.phone ?? '',
    delivery_address: profile?.address ?? '',
    delivery_note: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    if (items.length === 0) { toast.error('Your cart is empty'); return }

    setLoading(true)
    try {
      const orderPayload = {
        user_id: profile.id,
        total_amount: totalPrice(),
        delivery_name: form.delivery_name,
        delivery_phone: form.delivery_phone,
        delivery_address: form.delivery_address,
        delivery_note: form.delivery_note || null,
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single()

      if (orderError) throw orderError

      const orderData = order as { id: string }

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        food_id: item.food.id,
        food_name: item.food.name,
        food_price: item.food.price,
        quantity: item.quantity,
        subtotal: item.food.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/orders')
    } catch (err) {
      toast.error('Failed to place order. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Delivery form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="klean-card p-5 space-y-4">
            <h2 className="font-semibold text-white">Delivery Information</h2>

            {[
              { name: 'delivery_name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { name: 'delivery_phone', label: 'Phone Number', type: 'tel', placeholder: '+855 78 389 563' },
              { name: 'delivery_address', label: 'Delivery Address', type: 'text', placeholder: '1E 21K5 Phnom Penh' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="text-gray-400 text-sm mb-1 block">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name as keyof CheckoutFormData]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="klean-input"
                />
              </div>
            ))}

            <div>
              <label className="text-gray-400 text-sm mb-1 block">Note (optional)</label>
              <textarea
                name="delivery_note"
                value={form.delivery_note}
                onChange={handleChange}
                placeholder="Any special requests..."
                rows={3}
                className="klean-input resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="klean-btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        {/* Order summary */}
        <div className="klean-card p-5 space-y-4 h-fit">
          <h2 className="font-semibold text-white">Order Summary</h2>
          <div className="space-y-3">
            {items.map(({ food, quantity }) => (
              <div key={food.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-600 shrink-0">
                  {food.image_url ? (
                    <img src={food.image_url} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{food.name}</p>
                  <p className="text-gray-500 text-xs">×{quantity}</p>
                </div>
                <p className="text-white text-sm font-medium shrink-0">
                  ${(food.price * quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-500 pt-3 flex justify-between font-bold text-white">
            <span>Total</span>
            <span>${totalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}