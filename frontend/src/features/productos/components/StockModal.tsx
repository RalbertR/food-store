import { useForm } from '@tanstack/react-form'
import { CampoCheckbox } from '@/shared/components/CampoCheckbox'
import { CampoTexto } from '@/shared/components/CampoTexto'
import { Modal } from '@/shared/components/Modal'
import type { Producto, StockForm } from '../types/producto.types'

interface StockModalProps {
  producto: Producto
  error: string | null
  onGuardar: (datos: StockForm) => Promise<void>
  onCancelar: () => void
}

export const StockModal = ({ producto, error, onGuardar, onCancelar }: StockModalProps) => {
  const valoresIniciales: StockForm = { stock: producto.stock, disponible: producto.disponible }

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => onGuardar(value),
  })

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Modal
          titulo={`Stock de ${producto.nombre}`}
          error={error}
          puedeGuardar={canSubmit && !isSubmitting}
          onGuardar={() => form.handleSubmit()}
          onCancelar={onCancelar}
        >
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
          <form.Field name="disponible">
            {(field) => <CampoCheckbox field={field} label="Disponible para la venta" />}
          </form.Field>
        </Modal>
      )}
    </form.Subscribe>
  )
}
