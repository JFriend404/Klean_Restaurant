import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

interface Props {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { profile, loading, initialized } = useAuth()
  const location = useLocation()

  if (!initialized || loading) return <LoadingScreen />

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}