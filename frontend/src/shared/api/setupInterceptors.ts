import type { AxiosError } from 'axios'
import { useAuthStore } from '@/features/auth'
import { useNotificationStore } from '@/store/notificationStore'
import { api } from './api'

const RUTAS_DE_AUTH = ['/auth/token', '/auth/me']

const ACCESO_DENEGADO = 'Acceso denegado: no tenés permisos para esta acción'

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: unknown }>) => {
    const url = error.config?.url ?? ''
    const status = error.response?.status
    const esDeAuth = RUTAS_DE_AUTH.some((ruta) => url.includes(ruta))

    if (status === 401 && !esDeAuth) {
      useAuthStore.setState({ user: null, status: 'unauthenticated' })
    }

    if (status === 403) {
      useNotificationStore.getState().showNotification(ACCESO_DENEGADO)
      return Promise.reject(new Error(ACCESO_DENEGADO))
    }

    const detail = error.response?.data?.detail
    let mensaje = 'No se pudo completar la operación'
    if (!error.response) mensaje = 'No se pudo conectar con el servidor'
    else if (typeof detail === 'string') mensaje = detail
    return Promise.reject(new Error(mensaje))
  },
)
