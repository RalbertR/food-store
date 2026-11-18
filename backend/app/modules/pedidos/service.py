from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import EstadoPedido, PedidoCreate, PedidoRead, PedidosPaginados
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.productos.service import ProductoNoEncontrado
from app.modules.usuarios.schemas import UserPublic


class PedidoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class ProductoRepetido(Exception):
    pass


class ProductoNoDisponible(Exception):
    pass


class StockInsuficiente(Exception):
    pass


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def crear(self, usuario_id: int, data: PedidoCreate) -> PedidoRead:
        with self.uow as uow:
            ids = [item.producto_id for item in data.items]
            if len(ids) != len(set(ids)):
                raise ProductoRepetido("El pedido tiene productos repetidos")
            pedido = uow.pedidos.add(
                Pedido(
                    usuario_id=usuario_id,
                    forma_pago=data.forma_pago.value,
                    direccion_entrega=data.direccion_entrega,
                    notas=data.notas,
                    total=0,
                )
            )
            total = 0.0
            for item in data.items:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(f"Producto {item.producto_id} no encontrado")
                if not producto.disponible:
                    raise ProductoNoDisponible(f"{producto.nombre} no está disponible")
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(f"Stock insuficiente para {producto.nombre}")
                producto.stock -= item.cantidad
                subtotal = producto.precio_base * item.cantidad
                pedido.items.append(
                    DetallePedido(
                        producto_id=item.producto_id,
                        cantidad=item.cantidad,
                        nombre_producto=producto.nombre,
                        precio_unitario=producto.precio_base,
                        subtotal=subtotal,
                    )
                )
                total += subtotal
            pedido.total = total
            return PedidoRead.model_validate(pedido)

    def listar(
        self, usuario: UserPublic, skip: int, limit: int, estado: EstadoPedido | None
    ) -> PedidosPaginados:
        with self.uow as uow:
            usuario_id = None if usuario.role == "admin" else usuario.id
            pedidos, total = uow.pedidos.list_by_usuario(
                skip, limit, usuario_id, estado.value if estado else None
            )
            items = [PedidoRead.model_validate(p) for p in pedidos]
            return PedidosPaginados(total=total, items=items)

    def obtener(self, pedido_id: int, usuario: UserPublic) -> PedidoRead:
        with self.uow as uow:
            return PedidoRead.model_validate(self._buscar(uow, pedido_id, usuario))

    def _buscar(self, uow: PedidoUnitOfWork, pedido_id: int, usuario: UserPublic) -> Pedido:
        pedido = uow.pedidos.get_by_id(pedido_id)
        if pedido is None:
            raise PedidoNoEncontrado("Pedido no encontrado")
        if usuario.role != "admin" and pedido.usuario_id != usuario.id:
            raise PedidoAjeno("El pedido es de otro usuario")
        return pedido
