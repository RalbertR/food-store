import { formatearPrecio } from '@/shared/utils/formatearPrecio'
import type { Pedido } from '../types/pedido.types'

interface PedidoDetalleProps {
  pedido: Pedido
}

export const PedidoDetalle = ({ pedido }: PedidoDetalleProps) => {
  return (
    <div className="mt-4 border-t border-gray-100 pt-4 text-sm dark:border-gray-700">
      <p className="mb-1 text-gray-600 dark:text-gray-400">
        Entrega en {pedido.direccion_entrega}
      </p>
      {pedido.notas && (
        <p className="mb-3 text-gray-600 dark:text-gray-400">Notas: {pedido.notas}</p>
      )}
      <table className="w-full text-left">
        <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
          <tr>
            <th className="py-2 font-semibold">Producto</th>
            <th className="py-2 font-semibold">Precio</th>
            <th className="py-2 font-semibold">Cantidad</th>
            <th className="py-2 text-right font-semibold">Subtotal</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 dark:text-gray-200">
          {pedido.items.map((item) => (
            <tr key={item.producto_id} className="border-t border-gray-100 dark:border-gray-700">
              <td className="py-2">{item.nombre_producto}</td>
              <td className="py-2">{formatearPrecio(item.precio_unitario)}</td>
              <td className="py-2">{item.cantidad}</td>
              <td className="py-2 text-right">{formatearPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
