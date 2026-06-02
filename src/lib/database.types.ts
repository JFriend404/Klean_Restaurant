export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          address: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          role?: 'customer' | 'admin'
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
        }
        Update: {
          name?: string
          slug?: string
          icon?: string | null
        }
      }
      foods: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          image_url: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          is_available?: boolean
        }
        Update: {
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          is_available?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_name: string
          delivery_phone: string
          delivery_address: string
          delivery_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          total_amount: number
          delivery_name: string
          delivery_phone: string
          delivery_address: string
          delivery_note?: string | null
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          food_id: string | null
          food_name: string
          food_price: number
          quantity: number
          subtotal: number
        }
        Insert: {
          id?: string
          order_id: string
          food_id?: string | null
          food_name: string
          food_price: number
          quantity: number
          subtotal: number
        }
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'customer' | 'admin'
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
    }
  }
}