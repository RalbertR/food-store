export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  imagenes_url: string[]
  disponible: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  categorias: { id: number; nombre: string }[]
}

export interface ProductoForm {
  nombre: string
  descripcion: string
  precio_base: number
  imagenes_url: string[]
  disponible: boolean
  categoria_ids: number[]
}
