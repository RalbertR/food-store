import { useMemo, useState } from 'react'
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
import type { Ingrediente, UnidadMedida } from '../types/ingrediente.types'

const columnHelper = createColumnHelper<Ingrediente>()

interface IngredientesTablaProps {
  ingredientes: Ingrediente[]
  unidades: UnidadMedida[] | undefined
  onEditar?: (ingrediente: Ingrediente) => void
  onEliminar?: (ingrediente: Ingrediente) => void
}

export const IngredientesTabla = ({
  ingredientes,
  unidades,
  onEditar,
  onEliminar,
}: IngredientesTablaProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

  const columnas = useMemo(
    () => [
      columnHelper.accessor('nombre', { header: 'Nombre' }),
      columnHelper.accessor(
        (ingrediente) =>
          unidades?.find((unidad) => unidad.id === ingrediente.unidad_medida_id)?.nombre ?? '',
        { id: 'unidad', header: 'Unidad de medida' },
      ),
    ],
    [unidades],
  )

  const table = useReactTable({
    data: ingredientes,
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
