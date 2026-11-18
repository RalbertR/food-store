import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { EstadoCarga } from '@/shared/components/EstadoCarga'

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, status } = useAuth()

  if (status === 'checking') return <EstadoCarga />
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !user.roles.some((rol) => allowedRoles.includes(rol))) {
    return <Navigate to="/unauthorized" replace />
  }
  return <Outlet />
}
