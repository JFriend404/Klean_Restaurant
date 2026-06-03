import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { profile, loading, initialized, fetchProfile, setLoading, setInitialized, setProfile, signOut } =
    useAuthStore()

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          if (session?.user) {
            await fetchProfile(session.user.id)
          }
          setLoading(false)
          setInitialized(true)
        }
      } catch {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchProfile(session.user.id)
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
        setLoading(false)
        setInitialized(true)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile, setLoading, setInitialized, setProfile])

  return {
    profile,
    loading,
    initialized,
    isAdmin: profile?.role === 'admin',
    isAuthenticated: !!profile,
    signOut,
  }
}