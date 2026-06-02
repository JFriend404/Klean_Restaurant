import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useFood } from '@/hooks/useFood'
import { useCartStore } from '@/stores/cartStore'
import { PageLoader } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export function FoodDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { food, loading } = useFood(id)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)

  if (loading) return <PageLoader />
  if (!food) return (
    <div className="text-center py-20 text-gray-500">Food item not found.</div>
  )

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(food)
    toast.success(`${quantity}× ${food.name} added to cart`)
    navigate('/menu')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="klean-card overflow-hidden">
        {/* Image */}
        <div className="h-64 md:h-80 bg-dark-600 overflow-hidden">
          {food.image_url ? (
            <img
              src={food.image_url}
              alt={food.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              🍽️
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Title & category */}
          <div className="flex items-start justify-between">
            <div>
              {food.category && (
                <span className="text-brand-green text-sm font-medium">
                  {food.category.icon} {food.category.name}
                </span>
              )}
              <h1 className="font-display text-3xl font-bold text-white mt-1">
                {food.name}
              </h1>
            </div>
            <p className="text-2xl font-bold text-brand-green shrink-0 ml-4">
              ${food.price.toFixed(2)}
            </p>
          </div>

          {food.description && (
            <p className="text-gray-400 leading-relaxed">{food.description}</p>
          )}

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Quantity</span>
            <div className="flex items-center gap-3 bg-dark-600 rounded-full px-4 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between p-4 bg-dark-600 rounded-xl">
            <span className="text-gray-400">Subtotal</span>
            <span className="font-bold text-xl text-white">
              ${(food.price * quantity).toFixed(2)}
            </span>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="klean-btn-primary w-full flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}