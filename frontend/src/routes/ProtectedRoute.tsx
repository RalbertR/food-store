import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import type { Rol } from '@/features/usuarios'
import { EstadoCarga } from '@/shared/components/EstadoCarga'

interface ProtectedRouteProps {
  allowedRoles?: Rol[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { usuario, cargando } = useAuth()
  const location = useLocation()

  if (cargando) return <EstadoCarga />
  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  return <Outlet />
}
