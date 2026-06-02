import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { profile, loading, initialized, fetchProfile, setLoading, setInitialized, setProfile, signOut } =
    useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
      setInitialized(true)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchProfile(session.user.id)
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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