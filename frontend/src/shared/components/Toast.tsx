import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notificationStore'

export const Toast = () => {
  const message = useNotificationStore((state) => state.message)
  const show = useNotificationStore((state) => state.show)
  const hideNotification = useNotificationStore((state) => state.hideNotification)

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(hideNotification, 3000)
    return () => clearTimeout(timer)
  }, [show, message, hideNotification])

  if (!show) return null

  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-50 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg dark:bg-gray-700"
    >
      {message}
    </div>
  )
}
