import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Food } from '@/types'

interface UseFoodsOptions {
  categorySlug?: string
  search?: string
}

export function useFoods({ categorySlug, search }: UseFoodsOptions = {}) {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('foods')
        .select('*, category:categories(*)')
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (categorySlug && categorySlug !== 'all') {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single()
        if (cat) {
          query = query.eq('category_id', cat.id)
        }
      }

      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setFoods((data as Food[]) || [])
      }
      setLoading(false)
    }

    fetchFoods()
  }, [categorySlug, search])

  return { foods, loading, error }
}