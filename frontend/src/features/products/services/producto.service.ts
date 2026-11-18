import { api } from '@/shared/api/api'
import type { Paginado } from '@/shared/types/paginado'
import type { Producto, ProductoForm } from '../types/producto.types'

export const getProductos = async (): Promise<Producto[]> => {
  const respuesta = await api.get<Paginado<Producto>>('/productos', { params: { limit: 100 } })
  return respuesta.data.items
}

export const createProducto = async (datos: ProductoForm): Promise<Producto> => {
  const respuesta = await api.post<Producto>('/productos', datos)
  return respuesta.data
}

export const updateProducto = async (id: number, datos: ProductoForm): Promise<Producto> => {
  const respuesta = await api.put<Producto>(`/productos/${id}`, datos)
  return respuesta.data
}

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`)
}
