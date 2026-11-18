import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'
import { registrarUsuario } from '../api/auth'
import type { LoginForm } from '../types/auth.types'

export const useAuth = () => {
  const usuario = useAuthStore((state) => state.usuario)
  const cargando = useAuthStore((state) => state.cargando)
  const iniciar = useAuthStore((state) => state.login)
  const cerrar = useAuthStore((state) => state.logout)
  const showNotification = useNotificationStore((state) => state.showNotification)
  const navigate = useNavigate()

  const login = useMutation({
    mutationFn: (datos: LoginForm) => iniciar(datos.username, datos.password),
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

  return { usuario, cargando, esAdmin: usuario?.role === 'admin', login, registro, logout }
}
