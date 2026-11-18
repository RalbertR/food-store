import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminUsersPage, LoginPage, RegisterPage } from '@/features/auth'
import { CategoriesPage } from '@/features/categories'
import { ProductsPage } from '@/features/products'
import { Navbar } from '@/shared/components/Navbar'
import { UnauthorizedPage } from '@/shared/components/UnauthorizedPage'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRouter = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar nombreApp="Food Store" />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/categories" replace />} />
        </Routes>
      </main>
    </div>
  )
}
