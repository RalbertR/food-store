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


IMAGENES = {
    "Pizza muzzarella": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/Pizza_with_mozzarella_%28argentine_style%29.jpg/500px-Pizza_with_mozzarella_%28argentine_style%29.jpg",
    "Pizza napolitana": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Pizza_napolitana.JPG/500px-Pizza_napolitana.JPG",
    "Pizza fugazzeta": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Fugazzetta%2C_pizza_argentina_artesanal.jpg/500px-Fugazzetta%2C_pizza_argentina_artesanal.jpg",
    "Empanada de carne": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Empanada_mendocina_de_carne.jpg/500px-Empanada_mendocina_de_carne.jpg",
    "Empanada de jamón y queso": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Empanadas_argentinas_de_jam%C3%B3n_y_queso_%28horneadas%29.jpg/500px-Empanadas_argentinas_de_jam%C3%B3n_y_queso_%28horneadas%29.jpg",
    "Agua mineral 500 ml": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Blue_Waters_bottle_no_label.jpg/500px-Blue_Waters_bottle_no_label.jpg",
    "Gaseosa cola 1,5 L": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Glass_cola.jpg/500px-Glass_cola.jpg",
    "Flan casero": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Flan_casero_con_dulce_de_leche.JPG/500px-Flan_casero_con_dulce_de_leche.JPG",
    "Tiramisú": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Tiramisu_at_Italian_restaurant_in_Japan.jpg/500px-Tiramisu_at_Italian_restaurant_in_Japan.jpg",
}


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
        existente = session.exec(select(Producto).where(Producto.nombre == nombre)).first()
        if existente:
            if existente.imagen_url is None or "placehold.co" in existente.imagen_url:
                existente.imagen_url = IMAGENES[nombre]
            continue
        categoria = session.exec(select(Categoria).where(Categoria.nombre == categoria_nombre)).one()
        session.add(
            Producto(
                categoria_id=categoria.id,
                nombre=nombre,
                descripcion=descripcion,
                precio_base=precio,
                imagen_url=IMAGENES[nombre],
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
