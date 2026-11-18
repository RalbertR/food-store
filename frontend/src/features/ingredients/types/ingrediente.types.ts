export interface Ingrediente {
  id: number
  nombre: string
  unidad_medida_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IngredienteForm {
  nombre: string
  unidad_medida_id: number
}

export interface UnidadMedida {
  id: number
  nombre: string
  simbolo: string
  tipo: string
}
