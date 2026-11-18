import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import { activarUsuario, desactivarUsuario, getUsuarios } from '../services/auth.service'
import type { UsuarioAdmin } from '../types/auth.types'

export const useUsers = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  })

  const cambiarEstado = useMutation({
    mutationFn: (usuario: UsuarioAdmin) =>
      usuario.deleted_at ? activarUsuario(usuario.id) : desactivarUsuario(usuario.id),
    onSuccess: (usuario) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] })
      showNotification(usuario.deleted_at ? 'Usuario desactivado' : 'Usuario activado')
    },
    onError: (error) => showNotification(error.message),
  })

  return { usuarios: data, isPending, isError, refetch, cambiarEstado }
}
