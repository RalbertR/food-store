interface BadgeEstadoProps {
  estado: string
}

const estilos: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  EN_PREPARACION: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ENTREGADO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  CANCELADO: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const etiquetas: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export const BadgeEstado = ({ estado }: BadgeEstadoProps) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado] ?? 'bg-gray-100 text-gray-800'}`}
    >
      {etiquetas[estado] ?? estado}
    </span>
  )
}
