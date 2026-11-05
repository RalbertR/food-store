from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)


def create_all_tables() -> None:
    import app.modules.categorias.models
    import app.modules.pedidos.models
    import app.modules.productos.models
    import app.modules.usuarios.models

    SQLModel.metadata.create_all(engine)


def session_factory() -> Session:
    return Session(engine)
