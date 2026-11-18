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
import type { Usuario } from '../types/usuario.types'

const columnHelper = createColumnHelper<Usuario>()

interface UsuariosTablaProps {
  usuarios: Usuario[]
  idActual: number | undefined
  deshabilitado: boolean
  onCambiarEstado: (usuario: Usuario) => void
}

export const UsuariosTabla = ({
  usuarios,
  idActual,
  deshabilitado,
  onCambiarEstado,
}: UsuariosTablaProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })

  const columnas = [
    columnHelper.accessor('username', { header: 'Usuario' }),
    columnHelper.accessor('full_name', { header: 'Nombre' }),
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('role', { header: 'Rol' }),
    columnHelper.accessor('disabled', {
      header: 'Estado',
      cell: (info) =>
        info.getValue() ? (
          <span className="font-semibold text-red-600 dark:text-red-400">Desactivado</span>
        ) : (
          <span className="font-semibold text-green-700 dark:text-green-400">Activo</span>
        ),
    }),
    columnHelper.display({
      id: 'accion',
      header: 'Acción',
      cell: ({ row }) =>
        row.original.id === idActual ? null : (
          <button
            type="button"
            onClick={() => onCambiarEstado(row.original)}
            disabled={deshabilitado}
            className="font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400"
          >
            {row.original.disabled ? 'Activar' : 'Desactivar'}
          </button>
        ),
    }),
  ]

  const table = useReactTable({
    data: usuarios,
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
