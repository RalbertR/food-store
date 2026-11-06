from sqlmodel import Field, SQLModel

from app.modules.categorias.schemas import CategoriaRead


class ProductoCreate(SQLModel):
    nombre: str
    descripcion: str | None = None
    precio_base: float = Field(ge=0)
    imagen_url: str | None = None
    stock: int = Field(default=0, ge=0)
    disponible: bool = True
    categoria_id: int


class ProductoUpdate(SQLModel):
    nombre: str = Field(default=None)
    descripcion: str | None = None
    precio_base: float = Field(default=None, ge=0)
    imagen_url: str | None = None
    stock: int = Field(default=None, ge=0)
    disponible: bool = Field(default=None)
    categoria_id: int = Field(default=None)


class ProductoStockUpdate(SQLModel):
    stock: int = Field(default=None, ge=0)
    disponible: bool = Field(default=None)


class ProductoRead(SQLModel):
    id: int
    nombre: str
    descripcion: str | None = None
    precio_base: float
    imagen_url: str | None = None
    stock: int
    disponible: bool
    categoria_id: int
    activo: bool
    categoria: CategoriaRead


class ProductosPaginados(SQLModel):
    total: int
    items: list[ProductoRead]
