import { useEffect } from 'react'
import { AppRouter } from '@/routes/AppRouter'
import { Toast } from '@/shared/components/Toast'
import { useAuthStore } from '@/store/authStore'

export const App = () => {
  const checkSession = useAuthStore((state) => state.checkSession)

  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  )
}
