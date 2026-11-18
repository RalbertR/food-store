import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { useThemeStore } from '@/store/themeStore'

interface NavbarProps {
  nombreApp: string
}

const estiloLink =
  'text-sm font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'

export const Navbar = ({ nombreApp }: NavbarProps) => {
  const { usuario, esAdmin, logout } = useAuth()
  const darkMode = useThemeStore((state) => state.darkMode)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <nav className="mx-auto flex h-16 max-w-4xl items-center gap-5 px-4">
        <span className="whitespace-nowrap text-lg font-bold text-blue-600 dark:text-blue-400">
          {nombreApp}
        </span>
        <Link to="/" className={estiloLink}>
          Catálogo
        </Link>
        {esAdmin && (
          <>
            <Link to="/admin/categorias" className={estiloLink}>
              Categorías
            </Link>
            <Link to="/admin/usuarios" className={estiloLink}>
              Usuarios
            </Link>
          </>
        )}
        <div className="ml-auto flex items-center gap-4">
          {usuario && (
            <div className="whitespace-nowrap text-right leading-tight">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {usuario.full_name}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400">{usuario.role}</p>
            </div>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title="Cambiar tema"
            className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {darkMode ? '☀' : '☾'}
          </button>
          {usuario ? (
            <button
              type="button"
              onClick={logout}
              className="whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              to="/login"
              className="whitespace-nowrap rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Ingresar
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
