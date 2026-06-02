import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { EmptyState } from '@/components/ui/EmptyState'

export function CartPage() {
  const navigate = useNavigate()
  const { items, removeItem, increaseQuantity, decreaseQuantity, totalPrice } =
    useCartStore()

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        description="Add some delicious items from our menu"
        action={
          <button onClick={() => navigate('/menu')} className="klean-btn-primary">
            Browse Menu
          </button>
        }
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold text-white">Your Cart</h1>

      {/* Items */}
      <div className="space-y-3">
        {items.map(({ food, quantity }) => (
          <div key={food.id} className="klean-card p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-600 shrink-0">
              {food.image_url ? (
                <img src={food.image_url} alt={food.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{food.name}</p>
              <p className="text-brand-green text-sm">${food.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => decreaseQuantity(food.id)}
                className="w-7 h-7 rounded-full bg-dark-600 hover:bg-dark-500 flex items-center justify-center"
              >
                <Minus size={12} />
              </button>
              <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
              <button
                onClick={() => increaseQuantity(food.id)}
                className="w-7 h-7 rounded-full bg-dark-600 hover:bg-dark-500 flex items-center justify-center"
              >
                <Plus size={12} />
              </button>
            </div>

            <div className="shrink-0 text-right min-w-[60px]">
              <p className="font-semibold text-white text-sm">
                ${(food.price * quantity).toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => removeItem(food.id)}
              className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="klean-card p-5 space-y-3">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Subtotal</span>
          <span>${totalPrice().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Delivery fee</span>
          <span className="text-brand-green">Free</span>
        </div>
        <div className="border-t border-dark-500 pt-3 flex justify-between font-bold text-white text-lg">
          <span>Total</span>
          <span>${totalPrice().toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="klean-btn-primary w-full flex items-center justify-center gap-2"
      >
        <ShoppingBag size={18} />
        Proceed to Checkout
      </button>
    </div>
  )
}