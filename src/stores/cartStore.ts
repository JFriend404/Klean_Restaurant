import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Food } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (food: Food) => void
  removeItem: (foodId: string) => void
  increaseQuantity: (foodId: string) => void
  decreaseQuantity: (foodId: string) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (food: Food) => {
        const existing = get().items.find((i) => i.food.id === food.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.food.id === food.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ items: [...get().items, { food, quantity: 1 }] })
        }
      },

      removeItem: (foodId: string) => {
        set({ items: get().items.filter((i) => i.food.id !== foodId) })
      },

      increaseQuantity: (foodId: string) => {
        set({
          items: get().items.map((i) =>
            i.food.id === foodId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })
      },

      decreaseQuantity: (foodId: string) => {
        const item = get().items.find((i) => i.food.id === foodId)
        if (!item) return
        if (item.quantity <= 1) {
          set({ items: get().items.filter((i) => i.food.id !== foodId) })
        } else {
          set({
            items: get().items.map((i) =>
              i.food.id === foodId ? { ...i, quantity: i.quantity - 1 } : i
            ),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.food.price * i.quantity, 0),
    }),
    {
      name: 'klean-cart',
    }
  )
)