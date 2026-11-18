export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CategoriaForm {
  nombre: string
  descripcion: string
}
