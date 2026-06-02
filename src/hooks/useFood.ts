import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Food } from '@/types'

export function useFood(id: string | undefined) {
  const [food, setFood] = useState<Food | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchFood = async () => {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('foods')
        .select('*, category:categories(*)')
        .eq('id', id)
        .single()

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setFood(data as Food)
      }
      setLoading(false)
    }

    fetchFood()
  }, [id])

  return { food, loading, error }
}