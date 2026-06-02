import { useState, useRef, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCategories } from '@/hooks/useCategories'
import { Spinner } from '@/components/ui/Spinner'
import type { Food } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  food: Food | null
  onClose: () => void
  onSaved: () => void
}

export function FoodFormModal({ food, onClose, onSaved }: Props) {
  const { categories } = useCategories()
  const fileRef = useRef<HTMLInputElement>(null)
  const isEdit = !!food

  const [form, setForm] = useState({
    name: food?.name ?? '',
    description: food?.description ?? '',
    price: food?.price?.toString() ?? '',
    category_id: food?.category_id ?? '',
    is_available: food?.is_available ?? true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(food?.image_url ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (categories.length > 0 && !form.category_id) {
      setForm((f) => ({ ...f, category_id: categories[0].id }))
    }
  }, [categories, form.category_id])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (foodId: string): Promise<string | null> => {
    if (!imageFile) return food?.image_url ?? null
    const ext = imageFile.name.split('.').pop()
    const path = `${foodId}.${ext}`
    const { error } = await supabase.storage
      .from('food-images')
      .upload(path, imageFile, { upsert: true })
    if (error) { toast.error('Image upload failed'); return null }
    const { data } = supabase.storage.from('food-images').getPublicUrl(path)
    return data.publicUrl + '?t=' + Date.now()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    setSaving(true)

    try {
      if (isEdit) {
        const imageUrl = await uploadImage(food.id)
        const { error } = await supabase
          .from('foods')
          .update({
            name: form.name,
            description: form.description || null,
            price: parseFloat(form.price),
            category_id: form.category_id || null,
            is_available: form.is_available,
            ...(imageUrl ? { image_url: imageUrl } : {}),
          })
          .eq('id', food.id)
        if (error) throw error
        toast.success('Item updated!')
      } else {
        // Create a temp ID for image upload
        const tempId = crypto.randomUUID()
        const imageUrl = imageFile ? await uploadImage(tempId) : null
        const { error } = await supabase.from('foods').insert({
          name: form.name,
          description: form.description || null,
          price: parseFloat(form.price),
          category_id: form.category_id || null,
          is_available: form.is_available,
          image_url: imageUrl,
        })
        if (error) throw error
        toast.success('Item created!')
      }
      onSaved()
    } catch (err) {
      toast.error('Something went wrong')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-700 rounded-2xl border border-dark-500 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-dark-600 sticky top-0 bg-dark-700">
          <h2 className="font-semibold text-white">
            {isEdit ? 'Edit Item' : 'New Item'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Image upload */}
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Image</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="h-40 rounded-xl border-2 border-dashed border-dark-400 hover:border-brand-green/50 cursor-pointer flex items-center justify-center overflow-hidden bg-dark-600 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Upload size={24} />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Smash Burger"
              required
              className="klean-input"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe this item..."
              rows={3}
              className="klean-input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="3.75"
                required
                className="klean-input"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="klean-input"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  form.is_available ? 'bg-brand-green' : 'bg-dark-400'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    form.is_available ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
            <span className="text-gray-400 text-sm">Available on menu</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="klean-btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="klean-btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving && <Spinner size="sm" />}
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}