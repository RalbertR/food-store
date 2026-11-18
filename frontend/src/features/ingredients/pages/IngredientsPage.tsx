import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '@/features/auth'
import { CampoTexto } from '@/shared/components/CampoTexto'
import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Modal } from '@/shared/components/Modal'
import { IngredientesTabla } from '../components/IngredientesTabla'
import { useIngredients } from '../hooks/useIngredients'
import type { Ingrediente, IngredienteForm } from '../types/ingrediente.types'

const valoresVacios: IngredienteForm = { nombre: '', unidad_medida_id: 0 }

export const IngredientsPage = () => {
  const { esAdmin } = useAuth()
  const { ingredientes, unidades, isPending, isError, refetch, guardar, eliminar } =
    useIngredients()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Ingrediente | null>(null)

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: async ({ value }) => {
      await guardar
        .mutateAsync({ id: seleccionado?.id, datos: value })
        .then(() => setModalAbierto(false))
        .catch(() => undefined)
    },
  })

  const abrirModal = (ingrediente: Ingrediente | null) => {
    guardar.reset()
    setSeleccionado(ingrediente)
    form.reset(
      ingrediente
        ? { nombre: ingrediente.nombre, unidad_medida_id: ingrediente.unidad_medida_id }
        : valoresVacios,
      { keepDefaultValues: true },
    )
    setModalAbierto(true)
  }

  const handleDelete = (ingrediente: Ingrediente) => {
    if (!confirm(`¿Seguro que querés eliminar el ingrediente ${ingrediente.nombre}?`)) return
    eliminar.mutate(ingrediente.id)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ingredientes</h1>
        {esAdmin && (
          <button
            type="button"
            onClick={() => abrirModal(null)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
          >
            + Nuevo ingrediente
          </button>
        )}
      </div>

      {isPending && <EstadoCarga />}
      {isError && (
        <EstadoError mensaje="No se pudieron cargar los ingredientes." onReintentar={refetch} />
      )}
      {ingredientes && ingredientes.length === 0 && (
        <EstadoVacio mensaje="Todavía no hay ingredientes cargados." />
      )}
      {ingredientes && ingredientes.length > 0 && (
        <IngredientesTabla
          ingredientes={ingredientes}
          unidades={unidades}
          onEditar={esAdmin ? abrirModal : undefined}
          onEliminar={esAdmin ? handleDelete : undefined}
        />
      )}

      {modalAbierto && (
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Modal
              titulo={seleccionado ? 'Editar ingrediente' : 'Nuevo ingrediente'}
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
                {(field) => <CampoTexto field={field} label="Nombre" />}
              </form.Field>
              <form.Field
                name="unidad_medida_id"
                validators={{
                  onChange: ({ value }) =>
                    value === 0 ? 'Elegí una unidad de medida' : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <label
                      htmlFor="unidad_medida_id"
                      className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Unidad de medida
                    </label>
                    <select
                      id="unidad_medida_id"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value={0}>Elegí una unidad</option>
                      {unidades?.map((unidad) => (
                        <option key={unidad.id} value={unidad.id}>
                          {unidad.nombre} ({unidad.simbolo})
                        </option>
                      ))}
                    </select>
                    {field.state.meta.errors.map((error) => (
                      <p key={String(error)} className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </Modal>
          )}
        </form.Subscribe>
      )}
    </>
  )
}
