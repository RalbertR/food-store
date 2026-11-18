import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import {
  createCategoria,
  deleteCategoria,
  getCategorias,
  updateCategoria,
} from '../services/categoria.service'
import type { CategoriaForm } from '../types/categoria.types'

interface GuardarCategoria {
  id?: number
  datos: CategoriaForm
}

export const useCategories = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  })

  const guardar = useMutation({
    mutationFn: ({ id, datos }: GuardarCategoria) =>
      id ? updateCategoria(id, datos) : createCategoria(datos),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification(id ? 'Categoría actualizada' : 'Categoría creada')
    },
  })

  const eliminar = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      showNotification('Categoría eliminada')
    },
    onError: (error) => showNotification(error.message),
  })

  return { categorias: data, isPending, isError, refetch, guardar, eliminar }
}
