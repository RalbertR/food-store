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
import type { Producto } from '../types/producto.types'

const columnHelper = createColumnHelper<Producto>()

const columnas = [
  columnHelper.accessor('nombre', { header: 'Nombre' }),
  columnHelper.accessor('precio_base', {
    header: 'Precio',
    cell: (info) => `$ ${info.getValue().toLocaleString('es-AR')}`,
  }),
  columnHelper.accessor((producto) => producto.categorias.map((c) => c.nombre).join(', '), {
    id: 'categorias',
    header: 'Categorías',
  }),
  columnHelper.accessor('disponible', {
    header: 'Disponible',
    cell: (info) => (info.getValue() ? 'Sí' : 'No'),
  }),
]

interface ProductosTablaProps {
  productos: Producto[]
  onEditar?: (producto: Producto) => void
  onEliminar?: (producto: Producto) => void
}

export const ProductosTabla = ({ productos, onEditar, onEliminar }: ProductosTablaProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

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
