import { api } from '@/shared/api/api'
import type { Paginado } from '@/shared/types/paginado'
import type {
  FiltrosProductos,
  Producto,
  ProductoForm,
  StockForm,
} from '../types/producto.types'

const aPayload = (datos: ProductoForm) => ({
  ...datos,
  nombre: datos.nombre.trim(),
  descripcion: datos.descripcion.trim() || null,
  imagen_url: datos.imagen_url.trim() || null,
})

export const getProductos = async (filtros: FiltrosProductos): Promise<Paginado<Producto>> => {
  const respuesta = await api.get<Paginado<Producto>>('/productos', {
    params: {
      skip: filtros.pagina * filtros.limit,
      limit: filtros.limit,
      search: filtros.search || undefined,
      categoria_id: filtros.categoria_id ?? undefined,
    },
  })
  return respuesta.data
}

export const createProducto = async (datos: ProductoForm): Promise<Producto> => {
  const respuesta = await api.post<Producto>('/productos', aPayload(datos))
  return respuesta.data
}

export const updateProducto = async (id: number, datos: ProductoForm): Promise<Producto> => {
  const respuesta = await api.put<Producto>(`/productos/${id}`, aPayload(datos))
  return respuesta.data
}

export const updateStock = async (id: number, datos: StockForm): Promise<Producto> => {
  const respuesta = await api.patch<Producto>(`/productos/${id}/stock`, datos)
  return respuesta.data
}

export const deleteProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`)
}
