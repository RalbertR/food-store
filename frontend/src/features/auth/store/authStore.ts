import { create } from 'zustand'
import { cerrarSesion, getPerfil, iniciarSesion } from '../services/auth.service'
import type { AuthStatus, UsuarioAuth } from '../types/auth.types'

interface AuthState {
  user: UsuarioAuth | null
  status: AuthStatus
  checkAuth: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hasRole: (rol: string) => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: 'checking',
  checkAuth: async () => {
    try {
      set({ user: await getPerfil(), status: 'authenticated' })
    } catch {
      set({ user: null, status: 'unauthenticated' })
    }
  },
  login: async (email, password) => {
    await iniciarSesion({ email, password })
    set({ user: await getPerfil(), status: 'authenticated' })
  },
  logout: async () => {
    try {
      await cerrarSesion()
    } finally {
      set({ user: null, status: 'unauthenticated' })
    }
  },
  hasRole: (rol) => get().user?.roles.includes(rol) ?? false,
}))
