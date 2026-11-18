import { useState } from 'react'
import { useCategorias } from '@/features/categorias'
import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { ProductoModal } from '../components/ProductoModal'
import { ProductosTabla } from '../components/ProductosTabla'
import { StockModal } from '../components/StockModal'
import { useAdminProductos } from '../hooks/useAdminProductos'
import type { Producto } from '../types/producto.types'

export const AdminProductosPage = () => {
  const { productos, isPending, isError, refetch, guardar, cambiarStock, eliminar } =
    useAdminProductos()
  const { categorias } = useCategorias()
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null)
  const [stockDe, setStockDe] = useState<Producto | null>(null)

  const abrirFormulario = (producto: Producto | null) => {
    guardar.reset()
    setSeleccionado(producto)
    setFormularioAbierto(true)
  }

  const abrirStock = (producto: Producto) => {
    cambiarStock.reset()
    setStockDe(producto)
  }

  const handleDelete = (producto: Producto) => {
    if (!confirm(`¿Seguro que querés eliminar el producto ${producto.nombre}?`)) return
    eliminar.mutate(producto.id)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Productos</h1>
        <button
          type="button"
          onClick={() => abrirFormulario(null)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
        >
          + Nuevo producto
        </button>
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
          onEditar={abrirFormulario}
          onEliminar={handleDelete}
          onCambiarStock={abrirStock}
        />
      )}

      {formularioAbierto && (
        <ProductoModal
          producto={seleccionado}
          categorias={categorias ?? []}
          error={guardar.error?.message ?? null}
          onGuardar={(datos) =>
            guardar
              .mutateAsync({ id: seleccionado?.id, datos })
              .then(() => setFormularioAbierto(false))
              .catch(() => undefined)
          }
          onCancelar={() => setFormularioAbierto(false)}
        />
      )}

      {stockDe && (
        <StockModal
          producto={stockDe}
          error={cambiarStock.error?.message ?? null}
          onGuardar={(datos) =>
            cambiarStock
              .mutateAsync({ id: stockDe.id, datos })
              .then(() => setStockDe(null))
              .catch(() => undefined)
          }
          onCancelar={() => setStockDe(null)}
        />
      )}
    </>
  )
}
