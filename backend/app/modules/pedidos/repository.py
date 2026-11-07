from datetime import datetime

from sqlmodel import Session, col, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(Pedido, session)

    def list_by_usuario(
        self,
        skip: int,
        limit: int,
        usuario_id: int | None = None,
        estado: str | None = None,
    ) -> tuple[list[Pedido], int]:
        filtros = []
        if usuario_id is not None:
            filtros.append(Pedido.usuario_id == usuario_id)
        if estado is not None:
            filtros.append(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(Pedido).where(*filtros)).one()
        pedidos = self.session.exec(
            select(Pedido).where(*filtros).order_by(col(Pedido.id).desc()).offset(skip).limit(limit)
        ).all()
        return list(pedidos), total

    def count_by_estado(self, estado: str) -> int:
        return self.session.exec(
            select(func.count()).select_from(Pedido).where(Pedido.estado == estado)
        ).one()

    def count_desde(self, desde: datetime) -> int:
        return self.session.exec(
            select(func.count()).select_from(Pedido).where(col(Pedido.created_at) >= desde)
        ).one()

    def sum_total_by_estado(self, estado: str) -> float:
        return self.session.exec(
            select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == estado)
        ).one()
