interface SkeletonProps {
  cantidad: number
}

export const Skeleton = ({ cantidad }: SkeletonProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: cantidad }, (_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
        >
          <div className="mb-4 h-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mb-4 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
    </div>
  )
}
