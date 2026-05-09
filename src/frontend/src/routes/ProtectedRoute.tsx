import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { InlineNotice } from '@/components/feedback/InlineNotice'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types/models'

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const location = useLocation()
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <InlineNotice message="Checking your session..." />
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate replace to="/" />
  }

  return <Outlet />
}
