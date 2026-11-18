import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '@/store/notificationStore'
import {
  createIngrediente,
  deleteIngrediente,
  getIngredientes,
  getUnidadesMedida,
  updateIngrediente,
} from '../services/ingrediente.service'
import type { IngredienteForm } from '../types/ingrediente.types'

interface GuardarIngrediente {
  id?: number
  datos: IngredienteForm
}

export const useIngredients = () => {
  const queryClient = useQueryClient()
  const showNotification = useNotificationStore((state) => state.showNotification)

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  })

  const { data: unidades } = useQuery({
    queryKey: ['unidades-medida'],
    queryFn: getUnidadesMedida,
  })

  const guardar = useMutation({
    mutationFn: ({ id, datos }: GuardarIngrediente) =>
      id ? updateIngrediente(id, datos) : createIngrediente(datos),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      showNotification(id ? 'Ingrediente actualizado' : 'Ingrediente creado')
    },
  })

  const eliminar = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] })
      showNotification('Ingrediente eliminado')
    },
    onError: (error) => showNotification(error.message),
  })

  return { ingredientes: data, unidades, isPending, isError, refetch, guardar, eliminar }
}
