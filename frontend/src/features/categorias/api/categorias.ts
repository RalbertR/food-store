import { api } from '@/shared/api/api'
import type { Categoria, CategoriaForm } from '../types/categoria.types'

export const getCategorias = async (): Promise<Categoria[]> => {
  const respuesta = await api.get<Categoria[]>('/categorias')
  return respuesta.data
}

export const createCategoria = async (datos: CategoriaForm): Promise<Categoria> => {
  const respuesta = await api.post<Categoria>('/categorias', datos)
  return respuesta.data
}

export const updateCategoria = async (id: number, datos: CategoriaForm): Promise<Categoria> => {
  const respuesta = await api.put<Categoria>(`/categorias/${id}`, datos)
  return respuesta.data
}

export const deleteCategoria = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`)
}
