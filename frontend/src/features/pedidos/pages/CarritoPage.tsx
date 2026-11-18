import { Link } from 'react-router-dom'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import { useCartStore } from '@/store/cartStore'

const botonCantidad =
  'h-8 w-8 rounded-lg border border-gray-300 font-semibold hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'

export const CarritoPage = () => {
  const items = useCartStore((state) => state.items)
  const quitar = useCartStore((state) => state.quitar)
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad)
  const vaciar = useCartStore((state) => state.vaciar)
  const total = useCartStore((state) => state.total())

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Carrito</h1>

      {items.length === 0 ? (
        <>
          <EstadoVacio mensaje="Tu carrito está vacío." />
          <Link
            to="/"
            className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Ir al catálogo
          </Link>
        </>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-semibold">Producto</th>
                  <th className="px-6 py-3 font-semibold">Precio</th>
                  <th className="px-6 py-3 font-semibold">Cantidad</th>
                  <th className="px-6 py-3 font-semibold">Subtotal</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-200">
                {items.map((item) => (
                  <tr key={item.producto_id} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="px-6 py-4 font-semibold">{item.nombre}</td>
                    <td className="px-6 py-4">{formatearPrecio(item.precio_unitario)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(item.producto_id, item.cantidad - 1)}
                          aria-label={`Restar uno de ${item.nombre}`}
                          className={botonCantidad}
                        >
                          −
                        </button>
                        <span className="w-6 text-center">{item.cantidad}</span>
                        <button
                          type="button"
                          onClick={() => cambiarCantidad(item.producto_id, item.cantidad + 1)}
                          aria-label={`Sumar uno de ${item.nombre}`}
                          className={botonCantidad}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {formatearPrecio(item.precio_unitario * item.cantidad)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => quitar(item.producto_id)}
                        className="font-semibold text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={vaciar}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Vaciar carrito
            </button>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Total: {formatearPrecio(total)}
            </p>
          </div>
        </>
      )}
    </>
  )
}
