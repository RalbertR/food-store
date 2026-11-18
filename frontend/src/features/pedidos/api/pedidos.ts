import { api } from '@/shared/api/api'
import type { Paginado } from '@/shared/types/paginado'
import type { FiltrosPedidos, Pedido, PedidoCreate } from '../types/pedido.types'

export const getPedidos = async (filtros: FiltrosPedidos): Promise<Paginado<Pedido>> => {
  const respuesta = await api.get<Paginado<Pedido>>('/pedidos', {
    params: {
      skip: filtros.pagina * filtros.limit,
      limit: filtros.limit,
      estado: filtros.estado ?? undefined,
    },
  })
  return respuesta.data
}

export const crearPedido = async (datos: PedidoCreate): Promise<Pedido> => {
  const respuesta = await api.post<Pedido>('/pedidos', datos)
  return respuesta.data
}

export const cancelarPedido = async (id: number): Promise<Pedido> => {
  const respuesta = await api.patch<Pedido>(`/pedidos/${id}/cancelar`)
  return respuesta.data
}
