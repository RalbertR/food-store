import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '@/store/notificationStore'
import { registrarUsuario } from '../services/auth.service'
import { useAuthStore } from '../store/authStore'
import type { LoginForm } from '../types/auth.types'

export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const status = useAuthStore((state) => state.status)
  const iniciar = useAuthStore((state) => state.login)
  const cerrar = useAuthStore((state) => state.logout)
  const hasRole = useAuthStore((state) => state.hasRole)
  const showNotification = useNotificationStore((state) => state.showNotification)
  const navigate = useNavigate()

  const login = useMutation({
    mutationFn: (datos: LoginForm) => iniciar(datos.email, datos.password),
    onSuccess: () => navigate('/categories'),
  })

  const registro = useMutation({
    mutationFn: registrarUsuario,
    onSuccess: () => {
      showNotification('Cuenta creada, ya podés iniciar sesión')
      navigate('/login')
    },
  })

  const logout = async () => {
    await cerrar()
    navigate('/login')
  }

  return { user, status, esAdmin: hasRole('admin'), login, registro, logout }
}
