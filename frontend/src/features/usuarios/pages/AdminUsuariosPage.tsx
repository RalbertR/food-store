import { useAuth } from '@/features/auth'
import { EstadoCarga } from '@/shared/components/EstadoCarga'
import { EstadoError } from '@/shared/components/EstadoError'
import { EstadoVacio } from '@/shared/components/EstadoVacio'
import { UsuariosTabla } from '../components/UsuariosTabla'
import { useUsuarios } from '../hooks/useUsuarios'

export const AdminUsuariosPage = () => {
  const { usuario } = useAuth()
  const { usuarios, isPending, isError, refetch, cambiarEstado } = useUsuarios()

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
          idActual={usuario?.id}
          deshabilitado={cambiarEstado.isPending}
          onCambiarEstado={(fila) => cambiarEstado.mutate(fila)}
        />
      )}
    </>
  )
}
