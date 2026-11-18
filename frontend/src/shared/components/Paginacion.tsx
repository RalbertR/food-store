interface PaginacionProps {
  pagina: number
  totalPaginas: number
  onCambiar: (pagina: number) => void
}

const botonPagina =
  'rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'

export const Paginacion = ({ pagina, totalPaginas, onCambiar }: PaginacionProps) => {
  return (
    <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
      <span>
        Página {pagina + 1} de {Math.max(totalPaginas, 1)}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onCambiar(pagina - 1)}
          disabled={pagina === 0}
          className={botonPagina}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => onCambiar(pagina + 1)}
          disabled={pagina + 1 >= totalPaginas}
          className={botonPagina}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
