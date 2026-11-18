import { api } from '@/shared/api/api'
import type { Usuario } from '@/features/usuarios/types/usuario.types'
import type { LoginForm, RegistroForm } from '../types/auth.types'

export const iniciarSesion = async (datos: LoginForm): Promise<void> => {
  await api.post(
    '/auth/token',
    new URLSearchParams({ username: datos.username, password: datos.password }),
  )
}

export const getPerfil = async (): Promise<Usuario> => {
  const respuesta = await api.get<Usuario>('/auth/me')
  return respuesta.data
}

export const cerrarSesion = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const registrarUsuario = async (datos: RegistroForm): Promise<Usuario> => {
  const respuesta = await api.post<Usuario>('/auth/register', datos)
  return respuesta.data
}
