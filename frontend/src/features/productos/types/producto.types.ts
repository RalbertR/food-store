import type { Categoria } from '@/features/categorias'

export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio_base: number
  imagen_url: string | null
  stock: number
  disponible: boolean
  categoria_id: number
  activo: boolean
  categoria: Categoria
}

export interface FiltrosProductos {
  pagina: number
  limit: number
  search: string
  categoria_id: number | null
}

export interface ProductoForm {
  nombre: string
  descripcion: string
  precio_base: number
  imagen_url: string
  stock: number
  disponible: boolean
  categoria_id: number
}

export interface StockForm {
  stock: number
  disponible: boolean
}
