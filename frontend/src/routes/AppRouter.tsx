import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage, RegisterPage, UnauthorizedPage } from '@/features/auth'
import { AdminCategoriasPage } from '@/features/categorias'
import { CarritoPage } from '@/features/pedidos'
import { CatalogoPage } from '@/features/productos'
import { AdminUsuariosPage } from '@/features/usuarios'
import { Navbar } from '@/shared/components/Navbar'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRouter = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar nombreApp="Food Store" />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Routes>
          <Route path="/" element={<CatalogoPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
            <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
