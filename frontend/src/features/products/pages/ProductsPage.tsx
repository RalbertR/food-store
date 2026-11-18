import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '@/features/auth'
import { useCategories } from '@/features/categories'
import { CampoTexto } from '@/shared/components/CampoTexto'
import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Modal } from '@/shared/components/Modal'
import { ProductosTabla } from '../components/ProductosTabla'
import { useProducts } from '../hooks/useProducts'
import type { Producto, ProductoForm } from '../types/producto.types'

const valoresVacios: ProductoForm = {
  nombre: '',
  descripcion: '',
  precio_base: 0,
  imagenes_url: [],
  disponible: true,
  categoria_ids: [],
}

export const ProductsPage = () => {
  const { esAdmin } = useAuth()
  const { productos, isPending, isError, refetch, guardar, eliminar } = useProducts()
  const { categorias } = useCategories()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null)

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: async ({ value }) => {
      await guardar
        .mutateAsync({ id: seleccionado?.id, datos: value })
        .then(() => setModalAbierto(false))
        .catch(() => undefined)
    },
  })

  const abrirModal = (producto: Producto | null) => {
    guardar.reset()
    setSeleccionado(producto)
    form.reset(
      producto
        ? {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio_base: producto.precio_base,
            imagenes_url: producto.imagenes_url,
            disponible: producto.disponible,
            categoria_ids: producto.categorias.map((c) => c.id),
          }
        : valoresVacios,
      { keepDefaultValues: true },
    )
    setModalAbierto(true)
  }

  const handleDelete = (producto: Producto) => {
    if (!confirm(`¿Seguro que querés eliminar el producto ${producto.nombre}?`)) return
    eliminar.mutate(producto.id)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Productos</h1>
        {esAdmin && (
          <button
            type="button"
            onClick={() => abrirModal(null)}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {isPending && <EstadoCarga />}
      {isError && (
        <EstadoError mensaje="No se pudieron cargar los productos." onReintentar={refetch} />
      )}
      {productos && productos.length === 0 && (
        <EstadoVacio mensaje="Todavía no hay productos cargados." />
      )}
      {productos && productos.length > 0 && (
        <ProductosTabla
          productos={productos}
          onEditar={esAdmin ? abrirModal : undefined}
          onEliminar={esAdmin ? handleDelete : undefined}
        />
      )}

      {modalAbierto && (
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Modal
              titulo={seleccionado ? 'Editar producto' : 'Nuevo producto'}
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
              <form.Field name="descripcion">
                {(field) => <CampoTexto field={field} label="Descripción" />}
              </form.Field>
              <form.Field
                name="precio_base"
                validators={{
                  onChange: ({ value }) =>
                    value < 0 ? 'El precio no puede ser negativo' : undefined,
                }}
              >
                {(field) => <CampoTexto field={field} label="Precio base" type="number" />}
              </form.Field>
              <form.Field name="disponible">
                {(field) => (
                  <label className="mb-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    Disponible
                  </label>
                )}
              </form.Field>
              <form.Field
                name="categoria_ids"
                validators={{
                  onChange: ({ value }) =>
                    value.length === 0 ? 'Elegí al menos una categoría' : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categorías
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {categorias?.map((categoria) => (
                        <label
                          key={categoria.id}
                          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <input
                            type="checkbox"
                            checked={field.state.value.includes(categoria.id)}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.checked
                                  ? [...field.state.value, categoria.id]
                                  : field.state.value.filter((id) => id !== categoria.id),
                              )
                            }
                            className="accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                          {categoria.nombre}
                        </label>
                      ))}
                    </div>
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
