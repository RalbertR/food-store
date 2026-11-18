import type { AnyFieldApi } from '@tanstack/react-form'

interface CampoCheckboxProps {
  field: AnyFieldApi
  label: string
}

export const CampoCheckbox = ({ field, label }: CampoCheckboxProps) => {
  return (
    <label
      htmlFor={field.name}
      className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      <input
        id={field.name}
        type="checkbox"
        checked={field.state.value}
        onChange={(e) => field.handleChange(e.target.checked)}
        className="h-4 w-4 accent-blue-500"
      />
      {label}
    </label>
  )
}
