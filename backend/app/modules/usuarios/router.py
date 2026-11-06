from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.unit_of_work import get_usuario_uow

router = APIRouter(prefix="/admin/usuarios", tags=["usuarios"])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(get_usuario_uow())


@router.get("", response_model=list[UserPublic])
def listar_usuarios(
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
):
    return service.listar()


@router.post("/{usuario_id}/activar", response_model=UserPublic)
def activar_usuario(
    usuario_id: int,
    _admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
):
    return service.activar(usuario_id)


@router.post("/{usuario_id}/desactivar", response_model=UserPublic)
def desactivar_usuario(
    usuario_id: int,
    admin: Annotated[UserPublic, Depends(require_role(["admin"]))],
    service: Annotated[UsuarioService, Depends(get_usuario_service)],
):
    return service.desactivar(usuario_id, admin.id)
