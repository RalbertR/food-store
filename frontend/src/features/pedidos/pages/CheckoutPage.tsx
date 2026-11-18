import { useForm } from '@tanstack/react-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { CampoTexto } from '@/shared/components/CampoTexto'
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import { useCartStore } from '@/store/cartStore'
import { useCrearPedido } from '../hooks/useCrearPedido'
import type { CheckoutForm, FormaPago } from '../types/pedido.types'

const valoresIniciales: CheckoutForm = { direccion_entrega: '', forma_pago: 'EFECTIVO', notas: '' }

export const CheckoutPage = () => {
  const items = useCartStore((state) => state.items)
  const total = useCartStore((state) => state.total())
  const vaciar = useCartStore((state) => state.vaciar)
  const crear = useCrearPedido()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: async ({ value }) => {
      await crear
        .mutateAsync({
          items: items.map((item) => ({ producto_id: item.producto_id, cantidad: item.cantidad })),
          forma_pago: value.forma_pago,
          direccion_entrega: value.direccion_entrega.trim(),
          notas: value.notas.trim() || null,
        })
        .then(() => {
          navigate('/mis-pedidos')
          vaciar()
        })
        .catch(() => undefined)
    },
  })

  if (items.length === 0 && !crear.isSuccess) return <Navigate to="/carrito" replace />

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Confirmar pedido</h1>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
        <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {items.map((item) => (
            <li key={item.producto_id} className="flex justify-between">
              <span>
                {item.cantidad} × {item.nombre}
              </span>
              <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-gray-100 pt-4 text-right text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-gray-100">
          Total: {formatearPrecio(total)}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        noValidate
        className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
      >
        {crear.isError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {crear.error.message}
          </p>
        )}

        <form.Field
          name="direccion_entrega"
          validators={{
            onChange: ({ value }) =>
              value.trim().length >= 5 && value.trim().length <= 200
                ? undefined
                : 'La dirección tiene que tener entre 5 y 200 caracteres',
          }}
        >
          {(field) => <CampoTexto field={field} label="Dirección de entrega" />}
        </form.Field>

        <form.Field name="forma_pago">
          {(field) => (
            <div className="mb-4">
              <label
                htmlFor={field.name}
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Forma de pago
              </label>
              <select
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value as FormaPago)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="notas">
          {(field) => <CampoTexto field={field} label="Notas (opcional)" />}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="mt-2 w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirmar pedido
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  )
}
