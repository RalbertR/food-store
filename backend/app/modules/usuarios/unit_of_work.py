from app.core.database import session_factory
from app.core.unit_of_work import UnitOfWork
from app.modules.usuarios.repository import UsuarioRepository


class UsuarioUnitOfWork(UnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.usuarios = UsuarioRepository(self.session)
        return self


def get_usuario_uow() -> UsuarioUnitOfWork:
    return UsuarioUnitOfWork(session_factory)
