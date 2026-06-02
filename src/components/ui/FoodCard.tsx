import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import type { Food } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  food: Food
}

export function FoodCard({ food }: Props) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(food)
    toast.success(`${food.name} added to cart`)
  }

  return (
    <div
      onClick={() => navigate(`/menu/${food.id}`)}
      className="klean-card cursor-pointer group overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-36 md:h-44 overflow-hidden rounded-t-2xl bg-dark-600">
        {food.image_url ? (
          <img
            src={food.image_url}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🍽️
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex items-end justify-between">
        <div>
          <p className="font-medium text-white text-sm truncate max-w-[120px]">
            {food.name}
          </p>
          <p className="text-brand-green font-semibold text-sm mt-0.5">
            ${food.price.toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="w-8 h-8 rounded-full bg-brand-green hover:bg-brand-green-dark flex items-center justify-center transition-colors shrink-0"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>
    </div>
  )
}