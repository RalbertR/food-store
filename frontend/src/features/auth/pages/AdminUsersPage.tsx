import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { UsuariosTabla } from '../components/UsuariosTabla'
import { useAuth } from '../hooks/useAuth'
import { useUsers } from '../hooks/useUsers'

export const AdminUsersPage = () => {
  const { user } = useAuth()
  const { usuarios, isPending, isError, refetch, cambiarEstado } = useUsers()

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Usuarios</h1>

      {isPending && <EstadoCarga />}
      {isError && (
        <EstadoError mensaje="No se pudieron cargar los usuarios." onReintentar={refetch} />
      )}
      {usuarios && usuarios.length === 0 && <EstadoVacio mensaje="Todavía no hay usuarios." />}
      {usuarios && usuarios.length > 0 && (
        <UsuariosTabla
          usuarios={usuarios}
          idActual={user?.id}
          deshabilitado={cambiarEstado.isPending}
          onCambiarEstado={(usuario) => cambiarEstado.mutate(usuario)}
        />
      )}
    </>
  )
}
