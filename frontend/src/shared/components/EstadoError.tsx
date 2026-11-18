interface EstadoErrorProps {
  mensaje: string
  onReintentar: () => void
}

export const EstadoError = ({ mensaje, onReintentar }: EstadoErrorProps) => {
  return (
    <div
      role="alert"
      className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
    >
      <p>{mensaje}</p>
      <button
        type="button"
        onClick={() => onReintentar()}
        className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-red-100 dark:border-red-800 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        Reintentar
      </button>
    </div>
  )
}
