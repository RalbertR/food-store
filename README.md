# Food Store

Trabajo Práctico Integrador de Programación 4. Es una tienda de comida donde los clientes recorren el catálogo, arman un carrito y confirman pedidos, y el administrador gestiona categorías, productos, stock, pedidos y usuarios desde su panel. El backend está hecho con FastAPI, SQLModel y PostgreSQL. El frontend usa React con TypeScript, Vite, Tailwind, TanStack Query, Form y Table, Zustand y Axios.

- **Repositorio:** https://github.com/RalbertR/food-store
- **Video de demostración:** pendiente

## Requisitos

| Herramienta | Versión |
|---|---|
| Python | 3.11 a 3.13 |
| PostgreSQL | 15 o superior |
| Node.js | 20.19 o superior |
| pnpm | 9 o superior |

## Backend

Los comandos de esta parte se corren dentro de la carpeta `backend/`.

**1. Base de datos.** Crear en PostgreSQL una base vacía llamada `foodstore_db`. Desde psql alcanza con este comando:

```bash
psql -U postgres -c "CREATE DATABASE foodstore_db;"
```

Las tablas las crea la aplicación, así que no hay que correr ningún script SQL.

**2. Entorno virtual y dependencias.**

```bash
python -m venv .venv
.venv\Scripts\activate          # en macOS o Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Si en Windows hay varias versiones de Python instaladas, el entorno se crea con `py -3.13 -m venv .venv`.

**3. Variables de entorno.** El `.env` no viene en el repositorio. Se arma copiando `.env.example`:

```bash
cp .env.example .env            # en cmd de Windows: copy .env.example .env
```

En `DATABASE_URL` van el usuario, la contraseña y el puerto del PostgreSQL local. `SECRET_KEY` se reemplaza por una clave aleatoria de 32 caracteres o más, que se puede generar así:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Las otras variables se pueden dejar como vienen.

**4. Datos iniciales.**

```bash
python -m app.db.seed
```

El seed crea las tablas y carga el usuario admin, 4 categorías y 9 productos con stock. Si se corre otra vez no duplica nada.

**5. Servidor.**

```bash
uvicorn app.main:app --reload
```

La API queda en http://localhost:8000/api/v1 y la documentación con todos los endpoints en http://localhost:8000/docs.

## Frontend

Con el backend levantado, en otra terminal y dentro de la carpeta `frontend/`:

```bash
cp .env.example .env            # en cmd de Windows: copy .env.example .env
pnpm install
pnpm build
pnpm dev
```

`pnpm build` revisa los tipos y genera la versión de producción, y `pnpm dev` levanta el servidor de desarrollo. La aplicación queda en http://localhost:5173. Hay que abrirla con `localhost` porque ese es el origen que el backend acepta en CORS, y desde `127.0.0.1` la cookie de sesión no viaja.

## Variables de entorno

**`backend/.env`**

| Variable | Para qué sirve | Valor de ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Firma del JWT, mínimo 32 caracteres | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo de firma del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Minutos que duran el token y la cookie | `30` |
| `FRONTEND_ORIGIN` | Origen del frontend permitido en CORS | `http://localhost:5173` |

**`frontend/.env`**

| Variable | Para qué sirve | Valor de ejemplo |
|---|---|---|
| `VITE_API_URL` | Dirección de la API con el prefijo `/api/v1` | `http://localhost:8000/api/v1` |

Si el backend corre en otro puerto hay que cambiar `VITE_API_URL`. Si el que cambia es el puerto del frontend, se ajusta `FRONTEND_ORIGIN`.

## Usuario del seed

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | admin |

El login pide el nombre de usuario y la contraseña. Los clientes se crean desde la pantalla de registro y quedan con el rol `user`.
