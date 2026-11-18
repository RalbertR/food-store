import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import type { Rol } from '@/features/usuarios'
import { EstadoCarga } from '@/shared/components/EstadoCarga'

interface ProtectedRouteProps {
  allowedRoles?: Rol[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { usuario, cargando } = useAuth()

  if (cargando) return <EstadoCarga />
  if (!usuario) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />
  }
  return <Outlet />
}
