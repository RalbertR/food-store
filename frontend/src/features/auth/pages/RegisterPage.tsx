import { useForm } from '@tanstack/react-form'
import { Link } from 'react-router-dom'
import { CampoTexto } from '@/shared/components/CampoTexto'
import { useAuth } from '../hooks/useAuth'
import type { RegistroForm } from '../types/auth.types'

const valoresVacios: RegistroForm = {
  nombre: '',
  apellido: '',
  email: '',
  celular: '',
  password: '',
}

const obligatorio = ({ value }: { value: string }) =>
  value.trim() ? undefined : 'Este campo es obligatorio'

export const RegisterPage = () => {
  const { registro } = useAuth()

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: async ({ value }) => {
      await registro.mutateAsync(value).catch(() => undefined)
    },
  })

  return (
    <div className="mx-auto max-w-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        noValidate
        className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
      >
        <h1 className="mb-5 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Crear una cuenta
        </h1>

        {registro.isError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {registro.error.message}
          </p>
        )}

        <form.Field name="nombre" validators={{ onChange: obligatorio }}>
          {(field) => <CampoTexto field={field} label="Nombre" />}
        </form.Field>
        <form.Field name="apellido" validators={{ onChange: obligatorio }}>
          {(field) => <CampoTexto field={field} label="Apellido" />}
        </form.Field>
        <form.Field name="email" validators={{ onChange: obligatorio }}>
          {(field) => <CampoTexto field={field} label="Email" type="email" />}
        </form.Field>
        <form.Field name="celular">
          {(field) => <CampoTexto field={field} label="Celular (opcional)" />}
        </form.Field>
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length >= 8 ? undefined : 'La contraseña necesita al menos 8 caracteres',
          }}
        >
          {(field) => <CampoTexto field={field} label="Contraseña" type="password" />}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="mt-2 w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Registrarme
            </button>
          )}
        </form.Subscribe>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Ya tengo cuenta
          </Link>
        </p>
      </form>
    </div>
  )
}
