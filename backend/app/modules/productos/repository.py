from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(Producto, session)

    def search(
        self,
        skip: int,
        limit: int,
        nombre: str | None = None,
        categoria_id: int | None = None,
        disponible: bool | None = None,
    ) -> tuple[list[Producto], int]:
        filtros = [col(Producto.activo)]
        if nombre:
            filtros.append(col(Producto.nombre).ilike(f"%{nombre}%"))
        if categoria_id is not None:
            filtros.append(Producto.categoria_id == categoria_id)
        if disponible is not None:
            filtros.append(Producto.disponible == disponible)
        total = self.session.exec(select(func.count()).select_from(Producto).where(*filtros)).one()
        productos = self.session.exec(
            select(Producto).where(*filtros).order_by(Producto.id).offset(skip).limit(limit)
        ).all()
        return list(productos), total
