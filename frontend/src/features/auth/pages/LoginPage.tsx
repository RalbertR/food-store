import { useForm } from '@tanstack/react-form'
import { Link, Navigate } from 'react-router-dom'
import { CampoTexto } from '@/shared/components/CampoTexto'
import { useAuth } from '../hooks/useAuth'
import type { LoginForm } from '../types/auth.types'

const valoresVacios: LoginForm = { username: '', password: '' }

export const LoginPage = () => {
  const { usuario, login } = useAuth()

  const form = useForm({
    defaultValues: valoresVacios,
    onSubmit: async ({ value }) => {
      await login.mutateAsync(value).catch(() => undefined)
    },
  })

  if (usuario) return <Navigate to="/" replace />

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
        <h1 className="mb-5 text-2xl font-bold text-gray-900 dark:text-gray-100">Iniciar sesión</h1>

        {login.isError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {login.error.message}
          </p>
        )}

        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => (value.trim() ? undefined : 'Ingresá tu usuario'),
          }}
        >
          {(field) => <CampoTexto field={field} label="Usuario" />}
        </form.Field>
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => (value ? undefined : 'Ingresá tu contraseña'),
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
              Ingresar
            </button>
          )}
        </form.Subscribe>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          ¿No tenés cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Crear una cuenta
          </Link>
        </p>
      </form>
    </div>
  )
}
