export const EstadoCarga = () => {
  return (
    <div className="space-y-3" aria-busy="true">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      ))}
    </div>
  )
}
