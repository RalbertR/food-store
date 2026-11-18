import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import { crearPedido } from '../api/pedidos'

export const useCrearPedido = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  return useMutation({
    mutationFn: crearPedido,
    onSuccess: (pedido) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      showNotification(`Pedido #${pedido.id} confirmado`)
    },
  })
}
