import { Link } from 'react-router-dom'

export const UnauthorizedPage = () => {
  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Acceso denegado</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">No tenés permisos para ver esta sección.</p>
      <Link
        to="/categories"
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
      >
        Volver a Categorías
      </Link>
    </div>
  )
}
