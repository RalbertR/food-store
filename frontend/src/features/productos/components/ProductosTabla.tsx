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
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import type { Producto } from '../types/producto.types'

const columnHelper = createColumnHelper<Producto>()

interface ProductosTablaProps {
  productos: Producto[]
  onEditar: (producto: Producto) => void
  onEliminar: (producto: Producto) => void
  onCambiarStock: (producto: Producto) => void
}

export const ProductosTabla = ({
  productos,
  onEditar,
  onEliminar,
  onCambiarStock,
}: ProductosTablaProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const columnas = [
    columnHelper.accessor('nombre', { header: 'Nombre' }),
    columnHelper.accessor((producto) => producto.categoria.nombre, {
      id: 'categoria',
      header: 'Categoría',
    }),
    columnHelper.accessor('precio_base', {
      header: 'Precio',
      cell: (info) => formatearPrecio(info.getValue()),
    }),
    columnHelper.accessor('stock', { header: 'Stock' }),
    columnHelper.accessor('disponible', {
      header: 'Disponible',
      cell: (info) =>
        info.getValue() ? (
          <span className="font-semibold text-green-700 dark:text-green-400">Sí</span>
        ) : (
          <span className="font-semibold text-red-600 dark:text-red-400">No</span>
        ),
    }),
    columnHelper.display({
      id: 'cambiarStock',
      header: '',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onCambiarStock(row.original)}
          className="whitespace-nowrap font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Cambiar stock
        </button>
      ),
    }),
  ]

  const table = useReactTable({
    data: productos,
    columns: columnas,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return <Tabla table={table} onEditar={onEditar} onEliminar={onEliminar} />
}
