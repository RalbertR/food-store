const formato = new Intl.DateTimeFormat('es-AR', { dateStyle: 'short', timeStyle: 'short' })

export const formatearFecha = (fecha: string): string => formato.format(new Date(fecha))
