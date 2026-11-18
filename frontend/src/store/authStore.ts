import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cerrarSesion, getPerfil, iniciarSesion } from '@/features/auth/api/auth'
import type { Usuario } from '@/features/usuarios/types/usuario.types'

interface AuthState {
  usuario: Usuario | null
  cargando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,
      login: async (username, password) => {
        await iniciarSesion({ username, password })
        set({ usuario: await getPerfil() })
      },
      logout: async () => {
        try {
          await cerrarSesion()
        } finally {
          set({ usuario: null })
        }
      },
      checkSession: async () => {
        try {
          set({ usuario: await getPerfil(), cargando: false })
        } catch {
          set({ usuario: null, cargando: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
