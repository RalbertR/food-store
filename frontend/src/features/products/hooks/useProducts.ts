import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
} from '../services/producto.service'
import type { ProductoForm } from '../types/producto.types'

interface GuardarProducto {
  id?: number
  datos: ProductoForm
}

export const useProducts = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
  })

  const guardar = useMutation({
    mutationFn: ({ id, datos }: GuardarProducto) =>
      id ? updateProducto(id, datos) : createProducto(datos),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      showNotification(id ? 'Producto actualizado' : 'Producto creado')
    },
  })

  const eliminar = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      showNotification('Producto eliminado')
    },
    onError: (error) => showNotification(error.message),
  })

  return { productos: data, isPending, isError, refetch, guardar, eliminar }
}
