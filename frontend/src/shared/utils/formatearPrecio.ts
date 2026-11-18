const formato = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })

export const formatearPrecio = (monto: number): string => formato.format(monto)
