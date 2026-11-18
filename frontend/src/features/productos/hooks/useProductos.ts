import { useQuery } from '@tanstack/react-query'
import { getProductos } from '../api/productos'
import type { FiltrosProductos } from '../types/producto.types'

export const useProductos = (filtros: FiltrosProductos) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['productos', filtros],
    queryFn: () => getProductos(filtros),
  })

  return { productos: data?.items, total: data?.total ?? 0, isPending, isError, refetch }
}
