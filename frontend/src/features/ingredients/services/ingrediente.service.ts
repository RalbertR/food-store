import { api } from '@/shared/api/api'
import type { Paginado } from '@/shared/types/paginado'
import type { Ingrediente, IngredienteForm, UnidadMedida } from '../types/ingrediente.types'

export const getIngredientes = async (): Promise<Ingrediente[]> => {
  const respuesta = await api.get<Paginado<Ingrediente>>('/ingredientes/', {
    params: { limit: 100 },
  })
  return respuesta.data.items
}

export const getUnidadesMedida = async (): Promise<UnidadMedida[]> => {
  const respuesta = await api.get<Paginado<UnidadMedida>>('/unidades-medida/')
  return respuesta.data.items
}

export const createIngrediente = async (datos: IngredienteForm): Promise<Ingrediente> => {
  const respuesta = await api.post<Ingrediente>('/ingredientes/', datos)
  return respuesta.data
}

export const updateIngrediente = async (
  id: number,
  datos: IngredienteForm,
): Promise<Ingrediente> => {
  const respuesta = await api.put<Ingrediente>(`/ingredientes/${id}`, datos)
  return respuesta.data
}

export const deleteIngrediente = async (id: number): Promise<void> => {
  await api.delete(`/ingredientes/${id}`)
}
