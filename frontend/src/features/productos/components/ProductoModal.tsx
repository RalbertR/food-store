import { useForm } from '@tanstack/react-form'
import type { Categoria } from '@/features/categorias'
import { CampoCheckbox } from '@/shared/components/CampoCheckbox'
import { CampoTexto } from '@/shared/components/CampoTexto'
import { Modal } from '@/shared/components/Modal'
import type { Producto, ProductoForm } from '../types/producto.types'

const valoresVacios: ProductoForm = {
  nombre: '',
  descripcion: '',
  precio_base: 0,
  imagen_url: '',
  stock: 0,
  disponible: true,
  categoria_id: 0,
}

const aFormulario = (producto: Producto): ProductoForm => ({
  nombre: producto.nombre,
  descripcion: producto.descripcion ?? '',
  precio_base: producto.precio_base,
  imagen_url: producto.imagen_url ?? '',
  stock: producto.stock,
  disponible: producto.disponible,
  categoria_id: producto.categoria_id,
})

interface ProductoModalProps {
  producto: Producto | null
  categorias: Categoria[]
  error: string | null
  onGuardar: (datos: ProductoForm) => Promise<void>
  onCancelar: () => void
}

export const ProductoModal = ({
  producto,
  categorias,
  error,
  onGuardar,
  onCancelar,
}: ProductoModalProps) => {
  const form = useForm({
    defaultValues: producto ? aFormulario(producto) : valoresVacios,
    onSubmit: ({ value }) => onGuardar(value),
  })

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Modal
          titulo={producto ? 'Editar producto' : 'Nuevo producto'}
          error={error}
          puedeGuardar={canSubmit && !isSubmitting}
          onGuardar={() => form.handleSubmit()}
          onCancelar={onCancelar}
        >
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) =>
                value.trim().length >= 2 && value.length <= 100
                  ? undefined
                  : 'El nombre tiene que tener entre 2 y 100 caracteres',
            }}
          >
            {(field) => <CampoTexto field={field} label="Nombre" />}
          </form.Field>
          <form.Field name="descripcion">
            {(field) => <CampoTexto field={field} label="Descripción" />}
          </form.Field>
          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="precio_base"
              validators={{
                onChange: ({ value }) => (value >= 0 ? undefined : 'El precio no puede ser negativo'),
              }}
            >
              {(field) => <CampoTexto field={field} label="Precio" type="number" />}
            </form.Field>
            <form.Field
              name="stock"
              validators={{
                onChange: ({ value }) =>
                  Number.isInteger(value) && value >= 0
                    ? undefined
                    : 'El stock tiene que ser un entero desde 0',
              }}
            >
              {(field) => <CampoTexto field={field} label="Stock" type="number" step="1" />}
            </form.Field>
          </div>
          <form.Field
            name="categoria_id"
            validators={{
              onChange: ({ value }) => (value > 0 ? undefined : 'Elegí una categoría'),
            }}
          >
            {(field) => (
              <div className="mb-4">
                <label
                  htmlFor={field.name}
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Categoría
                </label>
                <select
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value={0}>Elegí una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
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
          <form.Field name="imagen_url">
            {(field) => <CampoTexto field={field} label="URL de la imagen" />}
          </form.Field>
          <form.Field name="disponible">
            {(field) => <CampoCheckbox field={field} label="Disponible para la venta" />}
          </form.Field>
        </Modal>
      )}
    </form.Subscribe>
  )
}
