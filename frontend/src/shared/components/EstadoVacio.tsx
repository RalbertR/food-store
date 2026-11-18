interface EstadoVacioProps {
  mensaje: string
}

export const EstadoVacio = ({ mensaje }: EstadoVacioProps) => {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
      {mensaje}
    </div>
  )
}
