import type { FormEvent, ReactNode } from 'react'

interface ModalProps {
  titulo: string
  error: string | null
  puedeGuardar: boolean
  onGuardar: () => void
  onCancelar: () => void
  children: ReactNode
}

export const Modal = ({
  titulo,
  error,
  puedeGuardar,
  onGuardar,
  onCancelar,
  children,
}: ModalProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onGuardar()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
      >
        <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-gray-100">{titulo}</h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        {children}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!puedeGuardar}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}
