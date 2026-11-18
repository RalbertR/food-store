import { useQuery } from '@tanstack/react-query'
import { getPedidos } from '../api/pedidos'
import type { FiltrosPedidos } from '../types/pedido.types'

export const usePedidos = (filtros: FiltrosPedidos) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['pedidos', filtros],
    queryFn: () => getPedidos(filtros),
  })

  return { pedidos: data?.items, total: data?.total ?? 0, isPending, isError, refetch }
}
