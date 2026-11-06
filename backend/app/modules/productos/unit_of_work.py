from app.core.database import session_factory
from app.core.unit_of_work import UnitOfWork
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.repository import ProductoRepository


class ProductoUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.productos = ProductoRepository(self.session)
        self.categorias = CategoriaRepository(self.session)
        return self


def get_producto_uow() -> ProductoUnitOfWork:
    return ProductoUnitOfWork(session_factory)
