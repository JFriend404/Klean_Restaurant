export type UserRole = 'customer' | 'admin'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  address: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  created_at: string
}

export interface Food {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface Order {
  id: string
  user_id: string | null
  status: OrderStatus
  total_amount: number
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  delivery_note: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
  profile?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  food_id: string | null
  food_name: string
  food_price: number
  quantity: number
  subtotal: number
}

export interface CartItem {
  food: Food
  quantity: number
}

export interface CheckoutFormData {
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  delivery_note: string
}