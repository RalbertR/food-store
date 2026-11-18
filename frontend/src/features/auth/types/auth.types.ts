export type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

export interface UsuarioAuth {
  id: number
  nombre: string
  apellido: string
  email: string
  roles: string[]
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegistroForm {
  nombre: string
  apellido: string
  email: string
  celular: string
  password: string
}

export interface UsuarioAdmin extends UsuarioAuth {
  celular: string | null
  deleted_at: string | null
}
