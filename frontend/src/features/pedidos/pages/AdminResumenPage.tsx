import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import { useResumenPedidos } from '../hooks/useResumenPedidos'

export const AdminResumenPage = () => {
  const { resumen, isPending, isError, refetch } = useResumenPedidos()

  const tarjetas = resumen
    ? [
        { titulo: 'Pedidos de hoy', valor: resumen.pedidos_hoy },
        { titulo: 'Pendientes', valor: resumen.pendientes },
        { titulo: 'En preparación', valor: resumen.en_preparacion },
        { titulo: 'Entregados', valor: resumen.entregados },
        { titulo: 'Cancelados', valor: resumen.cancelados },
        { titulo: 'Ingresos de entregados', valor: formatearPrecio(resumen.ingresos_entregados) },
      ]
    : []

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Resumen</h1>

      {isPending && <EstadoCarga />}
      {isError && <EstadoError mensaje="No se pudo cargar el resumen." onReintentar={refetch} />}
      {resumen && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tarjetas.map((tarjeta) => (
            <div
              key={tarjeta.titulo}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{tarjeta.titulo}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {tarjeta.valor}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
