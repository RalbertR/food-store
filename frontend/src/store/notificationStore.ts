import { create } from 'zustand'

interface NotificationState {
  message: string
  show: boolean
  showNotification: (message: string) => void
  hideNotification: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  message: '',
  show: false,
  showNotification: (message) => set({ message, show: true }),
  hideNotification: () => set({ message: '', show: false }),
}))
