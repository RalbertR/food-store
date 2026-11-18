import type { UsuarioAdmin } from '../types/auth.types'

interface UsuariosTablaProps {
  usuarios: UsuarioAdmin[]
  idActual: number | undefined
  deshabilitado: boolean
  onCambiarEstado: (usuario: UsuarioAdmin) => void
}

export const UsuariosTabla = ({
  usuarios,
  idActual,
  deshabilitado,
  onCambiarEstado,
}: UsuariosTablaProps) => {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3 font-semibold">Nombre</th>
            <th className="px-6 py-3 font-semibold">Email</th>
            <th className="px-6 py-3 font-semibold">Roles</th>
            <th className="px-6 py-3 font-semibold">Estado</th>
            <th className="px-6 py-3 text-right font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-t border-gray-100 dark:border-gray-700">
              <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                {usuario.nombre} {usuario.apellido}
              </td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-200">{usuario.email}</td>
              <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                {usuario.roles.join(', ')}
              </td>
              <td className="px-6 py-4">
                {usuario.deleted_at ? (
                  <span className="font-semibold text-red-600 dark:text-red-400">Desactivado</span>
                ) : (
                  <span className="font-semibold text-green-700 dark:text-green-400">Activo</span>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                {usuario.id !== idActual && (
                  <button
                    type="button"
                    onClick={() => onCambiarEstado(usuario)}
                    disabled={deshabilitado}
                    className="font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400"
                  >
                    {usuario.deleted_at ? 'Activar' : 'Desactivar'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
