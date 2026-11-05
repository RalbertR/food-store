from sqlmodel import Session, select

from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario

CATEGORIAS = [
    ("Pizzas", "Pizzas al molde"),
    ("Empanadas", "Empanadas al horno"),
    ("Bebidas", "Bebidas frías"),
    ("Postres", "Postres caseros"),
]

PRODUCTOS = [
    ("Pizzas", "Pizza muzzarella", "Salsa de tomate y muzzarella", 9500, 20),
    ("Pizzas", "Pizza napolitana", "Muzzarella, tomate y ajo", 10500, 15),
    ("Pizzas", "Pizza fugazzeta", "Muzzarella y cebolla", 10000, 15),
    ("Empanadas", "Empanada de carne", "Carne cortada a cuchillo", 1500, 60),
    ("Empanadas", "Empanada de jamón y queso", "Jamón cocido y muzzarella", 1400, 60),
    ("Bebidas", "Agua mineral 500 ml", "Sin gas", 1200, 40),
    ("Bebidas", "Gaseosa cola 1,5 L", "Botella retornable", 3200, 30),
    ("Postres", "Flan casero", "Con dulce de leche", 3000, 12),
    ("Postres", "Tiramisú", "Porción individual", 4200, 10),
]


def imagen_de(nombre: str) -> str:
    return f"https://placehold.co/400x300?text={nombre.replace(' ', '+')}"


def cargar_admin(session: Session) -> None:
    if session.exec(select(Usuario).where(Usuario.username == "admin")).first():
        return
    session.add(
        Usuario(
            username="admin",
            full_name="Administrador",
            email="admin@foodstore.com",
            hashed_password=hash_password("Admin1234!"),
            role="admin",
        )
    )


def cargar_categorias(session: Session) -> None:
    for nombre, descripcion in CATEGORIAS:
        if not session.exec(select(Categoria).where(Categoria.nombre == nombre)).first():
            session.add(Categoria(nombre=nombre, descripcion=descripcion))
    session.flush()


def cargar_productos(session: Session) -> None:
    for categoria_nombre, nombre, descripcion, precio, stock in PRODUCTOS:
        if session.exec(select(Producto).where(Producto.nombre == nombre)).first():
            continue
        categoria = session.exec(select(Categoria).where(Categoria.nombre == categoria_nombre)).one()
        session.add(
            Producto(
                categoria_id=categoria.id,
                nombre=nombre,
                descripcion=descripcion,
                precio_base=precio,
                imagen_url=imagen_de(nombre),
                stock=stock,
            )
        )


def run() -> None:
    create_all_tables()
    with session_factory() as session:
        cargar_admin(session)
        cargar_categorias(session)
        cargar_productos(session)
        session.commit()
    print("Seed terminado")


if __name__ == "__main__":
    run()
