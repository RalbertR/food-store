import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '@/features/auth'
import { CampoTexto } from '@/shared/components/CampoTexto'
import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Modal } from '@/shared/components/Modal'
import { CategoriasTabla } from '../components/CategoriasTabla'
import { useCategories } from '../hooks/useCategories'
import type { Categoria, CategoriaForm } from '../types/categoria.types'

const valoresVacios: CategoriaForm = { nombre: '', descripcion: '' }

export const CategoriesPage = () => {
  const { esAdmin } = useAuth()
  const { categorias, isPending, isError, refetch, guardar, eliminar } = useCategories()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [seleccionada, setSeleccionada] = useState<Categoria | null>(null)

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: async ({ value }) => {
      await guardar
        .mutateAsync({ id: seleccionada?.id, datos: value })
        .then(() => setModalAbierto(false))
        .catch(() => undefined)
    },
  })

  const abrirModal = (categoria: Categoria | null) => {
    guardar.reset()
    setSeleccionada(categoria)
    form.reset(
      categoria ? { nombre: categoria.nombre, descripcion: categoria.descripcion } : valoresVacios,
      { keepDefaultValues: true },
    )
    setModalAbierto(true)
  }

  const handleDelete = (categoria: Categoria) => {
    if (!confirm(`¿Seguro que querés eliminar la categoría ${categoria.nombre}?`)) return
    eliminar.mutate(categoria.id)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Categorías</h1>
        {esAdmin && (
          <button
            type="button"
            onClick={() => abrirModal(null)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
          >
            + Nueva categoría
          </button>
        )}
      </div>

      {isPending && <EstadoCarga />}
      {isError && (
        <EstadoError mensaje="No se pudieron cargar las categorías." onReintentar={refetch} />
      )}
      {categorias && categorias.length === 0 && (
        <EstadoVacio mensaje="Todavía no hay categorías cargadas." />
      )}
      {categorias && categorias.length > 0 && (
        <CategoriasTabla
          categorias={categorias}
          onEditar={esAdmin ? abrirModal : undefined}
          onEliminar={esAdmin ? handleDelete : undefined}
        />
      )}

      {modalAbierto && (
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Modal
              titulo={seleccionada ? 'Editar categoría' : 'Nueva categoría'}
              error={guardar.error?.message ?? null}
              puedeGuardar={canSubmit && !isSubmitting}
              onGuardar={() => form.handleSubmit()}
              onCancelar={() => setModalAbierto(false)}
            >
              <form.Field
                name="nombre"
                validators={{
                  onChange: ({ value }) =>
                    value.trim() ? undefined : 'El nombre no puede quedar vacío',
                }}
              >
                {(field) => <CampoTexto field={field} label="Nombre de la categoría" />}
              </form.Field>
              <form.Field name="descripcion">
                {(field) => <CampoTexto field={field} label="Descripción" />}
              </form.Field>
            </Modal>
          )}
        </form.Subscribe>
      )}
    </>
  )
}
