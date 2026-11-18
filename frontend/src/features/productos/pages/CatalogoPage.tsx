import { useState, type FormEvent } from 'react'
import { useCategorias } from '@/features/categorias'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { Paginacion } from '@/shared/components/Paginacion'
import { Skeleton } from '@/shared/components/Skeleton'
import { ProductoCard } from '../components/ProductoCard'
import { useProductos } from '../hooks/useProductos'

const LIMITE = 9

const estiloCampo =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100'

export const CatalogoPage = () => {
  const [pagina, setPagina] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [search, setSearch] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | null>(null)
  const { categorias } = useCategorias()
  const { productos, total, isPending, isError, refetch } = useProductos({
    pagina,
    limit: LIMITE,
    search,
    categoria_id: categoriaId,
  })

  const buscar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPagina(0)
    setSearch(busqueda.trim())
  }

  const filtrarPorCategoria = (valor: string) => {
    setPagina(0)
    setCategoriaId(valor ? Number(valor) : null)
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Catálogo</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        <form onSubmit={buscar} className="flex flex-1 gap-2">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre"
            aria-label="Buscar por nombre"
            className={`${estiloCampo} flex-1`}
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Buscar
          </button>
        </form>
        <select
          value={categoriaId ?? ''}
          onChange={(e) => filtrarPorCategoria(e.target.value)}
          aria-label="Filtrar por categoría"
          className={estiloCampo}
        >
          <option value="">Todas las categorías</option>
          {categorias?.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {isPending && <Skeleton cantidad={LIMITE} />}
      {isError && (
        <EstadoError mensaje="No se pudieron cargar los productos." onReintentar={refetch} />
      )}
      {productos && productos.length === 0 && (
        <EstadoVacio mensaje="No hay productos que coincidan con la búsqueda." />
      )}
      {productos && productos.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
          <Paginacion
            pagina={pagina}
            totalPaginas={Math.ceil(total / LIMITE)}
            onCambiar={setPagina}
          />
        </>
      )}
    </>
  )
}
