import { api } from '@/shared/api/api'
import type { Paginado } from '@/shared/types/paginado'
import type { FiltrosProductos, Producto } from '../types/producto.types'

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
