from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import get_current_active_user
from app.modules.pedidos.schemas import PedidoCreate, PedidoRead
from app.modules.pedidos.service import (
    PedidoService,
    ProductoNoDisponible,
    ProductoRepetido,
    StockInsuficiente,
)
from app.modules.pedidos.unit_of_work import get_pedido_uow
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic

router = APIRouter(prefix="/pedidos", tags=["pedidos"])


def get_pedido_service() -> PedidoService:
    return PedidoService(get_pedido_uow())


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(
    data: PedidoCreate,
    usuario: Annotated[UserPublic, Depends(get_current_active_user)],
    service: Annotated[PedidoService, Depends(get_pedido_service)],
):
    try:
        return service.crear(usuario.id, data)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except (ProductoRepetido, ProductoNoDisponible, StockInsuficiente) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
