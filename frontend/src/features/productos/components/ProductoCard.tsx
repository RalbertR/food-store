import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import { useCartStore } from '@/store/cartStore'
import { useNotificationStore } from '@/store/notificationStore'
import type { Producto } from '../types/producto.types'

interface ProductoCardProps {
  producto: Producto
}

export const ProductoCard = ({ producto }: ProductoCardProps) => {
  const agregar = useCartStore((state) => state.agregar)
  const enCarrito = useCartStore(
    (state) => state.items.find((i) => i.producto_id === producto.id)?.cantidad ?? 0,
  )
  const showNotification = useNotificationStore((state) => state.showNotification)
  const sinStock = producto.stock === 0
  const sePuedeAgregar = producto.disponible && enCarrito < producto.stock

  const handleAgregar = () => {
    agregar({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio_unitario: producto.precio_base,
    })
    showNotification(`${producto.nombre} agregado al carrito`)
  }

  return (
    <article className="flex flex-col rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
      {producto.imagen_url && (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="mb-4 h-32 w-full rounded-lg object-cover"
        />
      )}
      <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">
        {producto.categoria.nombre}
      </p>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{producto.nombre}</h2>
      {producto.descripcion && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{producto.descripcion}</p>
      )}
      <div className="mt-auto flex items-end justify-between">
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {formatearPrecio(producto.precio_base)}
        </span>
        {!producto.disponible ? (
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">No disponible</span>
        ) : sinStock ? (
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">Sin stock</span>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">Stock: {producto.stock}</span>
        )}
      </div>
      <button
        type="button"
        onClick={handleAgregar}
        disabled={!sePuedeAgregar}
        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Agregar al carrito
      </button>
      {enCarrito > 0 && (
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {enCarrito} en el carrito
        </p>
      )}
    </article>
  )
}
