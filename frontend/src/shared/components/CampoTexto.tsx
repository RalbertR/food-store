import type { AnyFieldApi } from '@tanstack/react-form'

interface CampoTextoProps {
  field: AnyFieldApi
  label: string
  type?: 'text' | 'number' | 'email' | 'password'
}

export const CampoTexto = ({ field, label, type = 'text' }: CampoTextoProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={field.name}
        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={field.name}
        type={type}
        step={type === 'number' ? '0.01' : undefined}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) =>
          field.handleChange(type === 'number' ? Number(e.target.value) : e.target.value)
        }
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
      />
      {field.state.meta.errors.map((error) => (
        <p key={String(error)} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ))}
    </div>
  )
}
