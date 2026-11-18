import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import { createProducto, deleteProducto, updateProducto, updateStock } from '../api/productos'
import type { FiltrosProductos, ProductoForm, StockForm } from '../types/producto.types'
import { useProductos } from './useProductos'

const FILTROS_ADMIN: FiltrosProductos = { pagina: 0, limit: 100, search: '', categoria_id: null }

interface GuardarProducto {
  id?: number
  datos: ProductoForm
}

interface GuardarStock {
  id: number
  datos: StockForm
}

export const useAdminProductos = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)
  const { productos, isPending, isError, refetch } = useProductos(FILTROS_ADMIN)

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ['productos'] })

  const guardar = useMutation({
    mutationFn: ({ id, datos }: GuardarProducto) =>
      id ? updateProducto(id, datos) : createProducto(datos),
    onSuccess: (_, { id }) => {
      invalidar()
      showNotification(id ? 'Producto actualizado' : 'Producto creado')
    },
  })

  const cambiarStock = useMutation({
    mutationFn: ({ id, datos }: GuardarStock) => updateStock(id, datos),
    onSuccess: (producto) => {
      invalidar()
      showNotification(`Stock de ${producto.nombre} actualizado`)
    },
  })

  const eliminar = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      invalidar()
      showNotification('Producto eliminado')
    },
    onError: (error) => showNotification(error.message),
  })

  return { productos, isPending, isError, refetch, guardar, cambiarStock, eliminar }
}
