import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { PageLoader } from '@/components/ui/Spinner'
import { FoodFormModal } from './FoodFormModal'
import type { Food } from '@/types'
import toast from 'react-hot-toast'

export function AdminFoodsTab() {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<Food | null>(null)

  const fetchFoods = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('foods')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })
    setFoods((data as Food[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchFoods() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return
    const { error } = await supabase.from('foods').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete item')
    } else {
      toast.success('Item deleted')
      setFoods((prev) => prev.filter((f) => f.id !== id))
    }
  }

  const handleEdit = (food: Food) => {
    setEditingFood(food)
    setModalOpen(true)
  }

  const handleCreate = () => {
    setEditingFood(null)
    setModalOpen(true)
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handleCreate} className="klean-btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-dark-600">
              <th className="pb-3 font-medium">Item</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Available</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-600">
            {foods.map((food) => (
              <tr key={food.id} className="hover:bg-dark-700/50 transition-colors">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-600 shrink-0">
                      {food.image_url ? (
                        <img src={food.image_url} alt={food.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">🍽️</div>
                      )}
                    </div>
                    <span className="text-white font-medium">{food.name}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-400">
                  {food.category ? `${food.category.icon} ${food.category.name}` : '—'}
                </td>
                <td className="py-3 text-brand-green font-medium">
                  ${food.price.toFixed(2)}
                </td>
                <td className="py-3">
                  <span
                    className={`klean-badge ${
                      food.is_available
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {food.is_available ? 'Available' : 'Hidden'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(food)}
                      className="p-2 rounded-lg bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(food.id)}
                      className="p-2 rounded-lg bg-dark-600 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {foods.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No food items yet. Add your first item!
          </div>
        )}
      </div>

      {modalOpen && (
        <FoodFormModal
          food={editingFood}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchFoods() }}
        />
      )}
    </div>
  )
}