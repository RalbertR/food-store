import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import { activarUsuario, desactivarUsuario, getUsuarios } from '../api/usuarios'
import type { Usuario } from '../types/usuario.types'

export const useUsuarios = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  })

  const cambiarEstado = useMutation({
    mutationFn: (usuario: Usuario) =>
      usuario.disabled ? activarUsuario(usuario.id) : desactivarUsuario(usuario.id),
    onSuccess: (usuario) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      showNotification(usuario.disabled ? 'Usuario desactivado' : 'Usuario activado')
    },
    onError: (error) => showNotification(error.message),
  })

  return { usuarios: data, isPending, isError, refetch, cambiarEstado }
}
