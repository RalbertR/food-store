import { useQuery } from '@tanstack/react-query'
import { getResumen } from '../api/pedidos'

export const useResumenPedidos = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['pedidos', 'resumen'],
    queryFn: getResumen,
  })

  return { resumen: data, isPending, isError, refetch }
}
