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
import type { Categoria } from '../types/categoria.types'

const columnHelper = createColumnHelper<Categoria>()

const columnas = [
  columnHelper.accessor('id', { header: 'Número' }),
  columnHelper.accessor('nombre', { header: 'Nombre' }),
  columnHelper.accessor('descripcion', { header: 'Descripción' }),
]

interface CategoriasTablaProps {
  categorias: Categoria[]
  onEditar?: (categoria: Categoria) => void
  onEliminar?: (categoria: Categoria) => void
}

export const CategoriasTabla = ({ categorias, onEditar, onEliminar }: CategoriasTablaProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

  const table = useReactTable({
    data: categorias,
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
