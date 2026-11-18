import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import { cancelarPedido } from '../api/pedidos'

export const useCancelarPedido = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  return useMutation({
    mutationFn: cancelarPedido,
    onSuccess: (pedido) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      showNotification(`Pedido #${pedido.id} cancelado`)
    },
    onError: (error) => showNotification(error.message),
  })
}
