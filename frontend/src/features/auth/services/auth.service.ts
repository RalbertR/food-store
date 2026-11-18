import { api } from '@/shared/api/api'
import type { LoginForm, RegistroForm, UsuarioAdmin, UsuarioAuth } from '../types/auth.types'

export const iniciarSesion = async (datos: LoginForm): Promise<void> => {
  await api.post(
    '/api/v1/auth/token',
    new URLSearchParams({ username: datos.email, password: datos.password }),
  )
}

export const getPerfil = async (): Promise<UsuarioAuth> => {
  const respuesta = await api.get<UsuarioAuth>('/api/v1/auth/me')
  return respuesta.data
}

export const cerrarSesion = async (): Promise<void> => {
  await api.post('/api/v1/auth/logout')
}

export const registrarUsuario = async (datos: RegistroForm): Promise<UsuarioAdmin> => {
  const respuesta = await api.post<UsuarioAdmin>('/api/v1/auth/register', {
    ...datos,
    celular: datos.celular || null,
  })
  return respuesta.data
}

export const getUsuarios = async (): Promise<UsuarioAdmin[]> => {
  const respuesta = await api.get<UsuarioAdmin[]>('/api/v1/auth/admin/usuarios')
  return respuesta.data
}

export const activarUsuario = async (id: number): Promise<UsuarioAdmin> => {
  const respuesta = await api.post<UsuarioAdmin>(`/api/v1/auth/admin/usuarios/${id}/activar`)
  return respuesta.data
}

export const desactivarUsuario = async (id: number): Promise<UsuarioAdmin> => {
  const respuesta = await api.post<UsuarioAdmin>(`/api/v1/auth/admin/usuarios/${id}/desactivar`)
  return respuesta.data
}
