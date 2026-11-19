import { useState } from 'react'
import { useUsuarios } from '@/features/usuarios'
import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { PedidosTabla } from '../components/PedidosTabla'
import { useCambiarEstadoPedido } from '../hooks/useCambiarEstadoPedido'
import { usePedidos } from '../hooks/usePedidos'
import type { EstadoPedido, Pedido } from '../types/pedido.types'

const OPCIONES_ESTADO: { valor: EstadoPedido; etiqueta: string }[] = [
  { valor: 'PENDIENTE', etiqueta: 'Pendiente' },
  { valor: 'EN_PREPARACION', etiqueta: 'En preparación' },
  { valor: 'ENTREGADO', etiqueta: 'Entregado' },
  { valor: 'CANCELADO', etiqueta: 'Cancelado' },
]

export const AdminPedidosPage = () => {
  const [estado, setEstado] = useState<EstadoPedido | null>(null)
  const { pedidos, isPending, isError, refetch } = usePedidos({ pagina: 0, limit: 100, estado })
  const { usuarios } = useUsuarios()
  const cambiarEstado = useCambiarEstadoPedido()

  const nombreCliente = (usuarioId: number) =>
    usuarios?.find((usuario) => usuario.id === usuarioId)?.username ?? `#${usuarioId}`

  const handleCambiarEstado = (pedido: Pedido, nuevo: EstadoPedido) => {
    if (
      nuevo === 'CANCELADO' &&
      !confirm(`¿Seguro que querés cancelar el pedido #${pedido.id}? Se devuelve el stock.`)
    )
      return
    cambiarEstado.mutate({ id: pedido.id, estado: nuevo })
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pedidos</h1>
        <select
          value={estado ?? ''}
          onChange={(e) => setEstado(e.target.value ? (e.target.value as EstadoPedido) : null)}
          aria-label="Filtrar por estado"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="">Todos los estados</option>
          {OPCIONES_ESTADO.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.etiqueta}
            </option>
          ))}
        </select>
      </div>

      {isPending && <EstadoCarga />}
      {isError && <EstadoError mensaje="No se pudieron cargar los pedidos." onReintentar={refetch} />}
      {pedidos && pedidos.length === 0 && (
        <EstadoVacio mensaje="No hay pedidos con ese estado." />
      )}
      {pedidos && pedidos.length > 0 && (
        <PedidosTabla
          pedidos={pedidos}
          nombreCliente={nombreCliente}
          deshabilitado={cambiarEstado.isPending}
          onCambiarEstado={handleCambiarEstado}
        />
      )}
    </>
  )
}
