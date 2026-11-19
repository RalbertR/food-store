import { useState } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'
import { Tabla } from '@/shared/components/Tabla'
import { BadgeEstado } from '@/shared/ui/BadgeEstado'
import { formatearFecha } from '@/shared/utils/formatearFecha'
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import type { EstadoPedido, Pedido } from '../types/pedido.types'

const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: ['EN_PREPARACION', 'CANCELADO'],
  EN_PREPARACION: ['ENTREGADO', 'CANCELADO'],
  ENTREGADO: [],
  CANCELADO: [],
}

const ACCIONES: Partial<Record<EstadoPedido, string>> = {
  EN_PREPARACION: 'Preparar',
  ENTREGADO: 'Entregar',
  CANCELADO: 'Cancelar',
}

const columnHelper = createColumnHelper<Pedido>()

interface PedidosTablaProps {
  pedidos: Pedido[]
  nombreCliente: (usuarioId: number) => string
  deshabilitado: boolean
  onCambiarEstado: (pedido: Pedido, estado: EstadoPedido) => void
}

export const PedidosTabla = ({
  pedidos,
  nombreCliente,
  deshabilitado,
  onCambiarEstado,
}: PedidosTablaProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const columnas = [
    columnHelper.accessor('id', { header: 'Pedido', cell: (info) => `#${info.getValue()}` }),
    columnHelper.accessor('created_at', {
      header: 'Fecha',
      cell: (info) => formatearFecha(info.getValue()),
    }),
    columnHelper.accessor((pedido) => nombreCliente(pedido.usuario_id), {
      id: 'cliente',
      header: 'Cliente',
    }),
    columnHelper.accessor('forma_pago', {
      header: 'Pago',
      cell: (info) => (info.getValue() === 'EFECTIVO' ? 'Efectivo' : 'Transferencia'),
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => formatearPrecio(info.getValue()),
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: (info) => <BadgeEstado estado={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-4 whitespace-nowrap">
          {TRANSICIONES[row.original.estado].map((destino) => (
            <button
              key={destino}
              type="button"
              onClick={() => onCambiarEstado(row.original, destino)}
              disabled={deshabilitado}
              className={
                destino === 'CANCELADO'
                  ? 'font-semibold text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400'
                  : 'font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400'
              }
            >
              {ACCIONES[destino]}
            </button>
          ))}
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: pedidos,
    columns: columnas,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return <Tabla table={table} />
}
