import { api } from '@/shared/api/api'
import type { Usuario } from '../types/usuario.types'

export const getUsuarios = async (): Promise<Usuario[]> => {
  const respuesta = await api.get<Usuario[]>('/admin/usuarios')
  return respuesta.data
}

export const activarUsuario = async (id: number): Promise<Usuario> => {
  const respuesta = await api.post<Usuario>(`/admin/usuarios/${id}/activar`)
  return respuesta.data
}

export const desactivarUsuario = async (id: number): Promise<Usuario> => {
  const respuesta = await api.post<Usuario>(`/admin/usuarios/${id}/desactivar`)
  return respuesta.data
}
