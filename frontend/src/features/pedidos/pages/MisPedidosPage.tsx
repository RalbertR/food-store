import { useState } from 'react'
import { useAuth } from '@/features/auth'
import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Paginacion } from '@/shared/components/Paginacion'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { formatearFecha } from '@/shared/utils/formatearFecha'
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import { PedidoDetalle } from '../components/PedidoDetalle'
import { useCancelarPedido } from '../hooks/useCancelarPedido'
import { usePedidos } from '../hooks/usePedidos'
import type { Pedido } from '../types/pedido.types'

const LIMITE = 5

export const MisPedidosPage = () => {
  const { usuario } = useAuth()
  const [pagina, setPagina] = useState(0)
  const [abierto, setAbierto] = useState<number | null>(null)
  const { pedidos, total, isPending, isError, refetch } = usePedidos({
    pagina,
    limit: LIMITE,
    estado: null,
  })
  const cancelar = useCancelarPedido()

  const handleCancelar = (pedido: Pedido) => {
    if (!confirm(`¿Seguro que querés cancelar el pedido #${pedido.id}?`)) return
    cancelar.mutate(pedido.id)
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Mis pedidos</h1>

      {isPending && <EstadoCarga />}
      {isError && <EstadoError mensaje="No se pudieron cargar los pedidos." onReintentar={refetch} />}
      {pedidos && pedidos.length === 0 && <EstadoVacio mensaje="Todavía no hiciste pedidos." />}
      {pedidos && pedidos.length > 0 && (
        <>
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <article
                key={pedido.id}
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">Pedido #{pedido.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatearFecha(pedido.created_at)} ·{' '}
                      {pedido.forma_pago === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <BadgeEstado estado={pedido.estado} />
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatearPrecio(pedido.total)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-sm">
                  <button
                    type="button"
                    onClick={() => setAbierto(abierto === pedido.id ? null : pedido.id)}
                    className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    {abierto === pedido.id ? 'Ocultar detalle' : 'Ver detalle'}
                  </button>
                  {pedido.estado === 'PENDIENTE' && pedido.usuario_id === usuario?.id && (
                    <button
                      type="button"
                      onClick={() => handleCancelar(pedido)}
                      disabled={cancelar.isPending}
                      className="font-semibold text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400"
                    >
                      Cancelar pedido
                    </button>
                  )}
                </div>
                {abierto === pedido.id && <PedidoDetalle pedido={pedido} />}
              </article>
            ))}
          </div>
          <Paginacion
            pagina={pagina}
            totalPaginas={Math.ceil(total / LIMITE)}
            onCambiar={setPagina}
          />
        </>
      )}
    </>
  )
}
