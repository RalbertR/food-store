import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import { cambiarEstadoPedido } from '../api/pedidos'
import type { EstadoPedido } from '../types/pedido.types'

interface CambioEstado {
  id: number
  estado: EstadoPedido
}

export const useCambiarEstadoPedido = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  return useMutation({
    mutationFn: ({ id, estado }: CambioEstado) => cambiarEstadoPedido(id, estado),
    onSuccess: (pedido) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      showNotification(`Pedido #${pedido.id} actualizado`)
    },
    onError: (error) => showNotification(error.message),
  })
}
