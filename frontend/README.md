# tp-categorias

En el TP de la Unidad 10 tomé el frontend del TP9 y lo reorganicé por features. Sigue teniendo el CRUD de categorías, productos e ingredientes, el login, el registro y el panel de usuarios. Cada dominio tiene ahora su carpeta con sus componentes, hooks, tipos y páginas, y lo que comparten quedó en `shared/`. También le sumé el modo oscuro y los avisos con un Toast.

## Cómo correrlo

El backend `fastapi-productos` del TP9 tiene que estar levantado en http://localhost:8000. En esta unidad no cambia y no se vuelve a entregar. Los usuarios de prueba que carga su seed están en el README del backend.

```bash
pnpm install
pnpm dev
```

La aplicación queda en http://localhost:5173. Sin sesión arranca en el login, y con sesión en la página de categorías. No hay dependencias nuevas respecto del TP9.

## Estructura

```
src/
├── main.tsx                    # carga los interceptores, QueryClientProvider y BrowserRouter
├── App.tsx                     # checkAuth al arrancar, AppRouter y Toast
├── index.css                   # Tailwind y la variante dark por clase
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── UsuariosTabla.tsx      # tabla del panel de usuarios
│   │   ├── hooks/
│   │   │   ├── useAuth.ts             # usuario, estado, login, registro y logout
│   │   │   └── useUsers.ts            # listado de usuarios y activar o desactivar
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── AdminUsersPage.tsx
│   │   ├── services/
│   │   │   └── auth.service.ts        # llamadas a /api/v1/auth
│   │   ├── store/
│   │   │   └── authStore.ts           # user, status, checkAuth, login, logout y hasRole
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts                   # lo que la feature deja usar desde afuera
│   ├── categories/
│   │   ├── components/
│   │   │   └── CategoriasTabla.tsx    # columnas y useReactTable
│   │   ├── hooks/
│   │   │   └── useCategories.ts       # useQuery y las mutaciones guardar y eliminar
│   │   ├── pages/
│   │   │   └── CategoriesPage.tsx
│   │   ├── services/
│   │   │   └── categoria.service.ts
│   │   ├── types/
│   │   │   └── categoria.types.ts
│   │   └── index.ts
│   ├── products/                      # misma estructura que categories
│   └── ingredients/                   # misma estructura, el hook también trae las unidades
├── shared/
│   ├── api/
│   │   ├── api.ts                     # instancia de Axios con withCredentials
│   │   └── setupInterceptors.ts       # interceptor de 401 y 403
│   ├── components/
│   │   ├── Navbar.tsx                 # links, usuario, botón del tema y cerrar sesión
│   │   ├── UnauthorizedPage.tsx
│   │   ├── Toast.tsx
│   │   ├── Tabla.tsx                  # tabla de TanStack Table con orden y paginación
│   │   ├── Modal.tsx                  # modal del formulario de alta y edición
│   │   ├── CampoTexto.tsx             # input con sus errores de validación
│   │   ├── EstadoCarga.tsx
│   │   ├── EstadoVacio.tsx
│   │   └── EstadoError.tsx
│   └── types/
│       └── paginado.ts                # interface de las respuestas paginadas
├── store/
│   ├── themeStore.ts                  # modo oscuro, con persist en theme-storage
│   └── notificationStore.ts           # mensaje del Toast
└── routes/
    ├── AppRouter.tsx                  # layout y rutas
    └── ProtectedRoute.tsx             # valida sesión y rol y devuelve un Outlet
```

## Cómo funciona

Cada carpeta de `features/` junta todo lo de un dominio. El service hace las llamadas con Axios, el hook las envuelve con TanStack Query, el componente de tabla arma `useReactTable` y la página se queda con el formulario y el modal. Lo que la feature deja usar desde afuera sale por su `index.ts`, y desde otra carpeta se importa solo ese archivo, nunca algo de adentro. Así `ProductsPage` toma `useCategories` de `@/features/categories` para armar los checkboxes del modal, y las tres páginas del catálogo toman `useAuth` de `@/features/auth` para saber si mostrar los botones de admin. Lo que usan varias features quedó en `shared/`, y los dos stores de interfaz en `store/`.

Los imports entre carpetas usan el alias `@/`, que apunta a `src/`. Está declarado en `vite.config.ts` con `resolve.alias` y en `tsconfig.app.json` con `paths`, así lo entienden Vite y TypeScript. Dentro de una misma feature uso rutas relativas cortas como `../hooks/useCategories`.

`useCategories`, `useProducts` y `useIngredients` tienen la misma forma. Devuelven el listado con sus estados de carga y error, una mutación `guardar` que recibe `{ id, datos }` y crea o edita según venga el id, y una mutación `eliminar`. Cuando una mutación sale bien invalidan la consulta y muestran un aviso como "Categoría creada" o "Producto eliminado". `useIngredients` además trae las unidades de medida, que usan la tabla y el select del modal. En auth, `useAuth` expone el usuario, el estado de la sesión, si es admin, el login, el registro y el logout, y `useUsers` maneja el panel de usuarios. Las páginas no llaman a `useQuery` ni a `useMutation`.

El store de auth ya no usa `persist`. Guarda `user` y `status`, que arranca en `checking`. Al montarse, `App.tsx` llama una sola vez a `checkAuth`, que pide `GET /api/v1/auth/me`. Si la cookie sigue vigente el estado pasa a `authenticated` con el usuario, y si no a `unauthenticated`. Por eso al recargar la sesión se recupera sin guardar nada en el navegador. Fuera de esa llamada, `App.tsx` solo monta `AppRouter` y el `Toast`.

`ProtectedRoute` lee el estado con `useAuth` y devuelve un `<Outlet />`, así en `AppRouter` agrupa rutas en lugar de envolver cada página. Mientras el estado es `checking` muestra el skeleton de carga. Sin usuario redirige a `/login`, y si recibe `allowedRoles` y el usuario no tiene ninguno de esos roles, a `/unauthorized`. Categorías, productos e ingredientes cuelgan de un `ProtectedRoute` sin roles y `/admin/users` de otro con `allowedRoles={['admin']}`. Cualquier otra ruta redirige a categorías.

El interceptor de `setupInterceptors.ts` se registra sobre la instancia de `api.ts`, y `main.tsx` lo importa una vez antes de montar la app. Si llega un 401 en una petición que no sea el login o `/auth/me`, la cookie venció, así que deja el store en `unauthenticated` y `ProtectedRoute` lleva al login. Un 403 muestra el aviso "Acceso denegado: no tenés permisos para esta acción" y no toca la sesión. Para el resto de los errores arma el mensaje con el `detail` de FastAPI, como en el TP9.

`themeStore` guarda `darkMode` con `persist` bajo la clave `theme-storage` de `localStorage`, que es lo único que queda guardado en el navegador. El botón del Navbar lo alterna y un `useEffect` del mismo Navbar pone o saca la clase `dark` en `<html>`. En `index.css` agregué `@custom-variant dark`, para que las clases `dark:` de Tailwind dependan de esa clase y no de la preferencia del sistema. `notificationStore` guarda el mensaje del Toast. Lo usan los hooks y el interceptor, y el `Toast` se oculta solo a los 3 segundos.

El login y el registro usan TanStack Form y `CampoTexto`, igual que los modales. Si las credenciales están mal, el login muestra el mensaje sin recargar la página y deja Ingresar deshabilitado hasta que los campos vuelvan a ser válidos. El registro pide nombre, apellido, email, celular opcional y una contraseña de al menos 8 caracteres. Al terminar muestra el aviso "Cuenta creada" y lleva al login. El panel de usuarios lista a todos con su estado y un botón para activarlos o desactivarlos.

En categorías, productos e ingredientes los botones de crear, editar y eliminar se muestran solo si el usuario tiene el rol admin. A un usuario user la tabla le llega sin `onEditar` ni `onEliminar`, y `Tabla` no dibuja la columna de acciones. Ocultar los botones no reemplaza la validación del backend, que igual responde 403 si un user intenta escribir.

Las columnas se definen con `createColumnHelper` en el componente de tabla de cada feature, fuera de la función, así no cambian de referencia en cada render. En `IngredientesTabla` van dentro de un `useMemo`, porque la columna de la unidad necesita la lista de unidades para mostrar el nombre en vez del id. Un clic en el encabezado ordena con `getSortedRowModel` y la flecha marca el sentido. La tabla pagina de a 5 filas con `getPaginationRowModel` y los botones Anterior y Siguiente. Como el orden y la paginación los resuelve la tabla del lado del cliente, cada service pide hasta 100 registros, que es el máximo que acepta el backend.

El formulario es de TanStack Form. Cada campo es un `form.Field` con sus `validators`, que al escribir revisan que el nombre no quede vacío, que el precio no sea negativo, que el producto tenga al menos una categoría y que el ingrediente tenga unidad. Los errores aparecen debajo de cada campo, y si alguno queda sin corregir al enviar, la petición al backend no sale.

## Opcionales

El botón Guardar del modal se deshabilita mientras el formulario tiene errores o se está enviando. La página envuelve el modal en `form.Subscribe`, lee `canSubmit` e `isSubmitting` y se los pasa al modal. Para que `isSubmitting` dure lo que tarda la petición, el `onSubmit` del formulario espera a `mutateAsync`. Los botones de Ingresar y Registrarme funcionan igual.

## Decisiones que tomé

Dentro de cada feature sumé una carpeta `services/` que la estructura de la consigna no muestra. Ahí quedaron las funciones de Axios que ya venían del TP9, y el hook de la feature es el único que las usa. Las rutas del frontend siguen en inglés, `/categories`, `/products` e `/ingredients`, como las pidió el campus desde el TP8, y las carpetas de las features usan esos mismos nombres.

El Navbar y `UnauthorizedPage` están en `shared/components` como pide la estructura. El Navbar necesita el usuario y el logout, así que importa `useAuth` desde `@/features/auth`. `setupInterceptors.ts` hace lo mismo con `useAuthStore`, porque corre fuera de React y no puede usar un hook. Son los dos únicos archivos de `shared/` que dependen de una feature, y los dos pasan por el barrel.

Ante un 403 el interceptor rechaza la promesa con el mismo texto del aviso y no con el `detail` del backend, que dice "Permisos insuficientes. Se requiere uno de estos roles". Si no, el `onError` de eliminar pisaba el aviso de acceso denegado con otro mensaje. Lo probé con un 403 real. Dejé al admin logueado, le vencí el rol en la base y quiso crear una categoría. Salió el aviso, el modal mostró el mismo texto y la sesión siguió abierta.

El error de guardar sigue apareciendo dentro del modal, como en el TP9, porque ahí el usuario lo ve al lado del formulario y puede corregir el dato. El error de eliminar va al Toast y reemplaza el párrafo rojo que antes aparecía arriba de la tabla.

`UsuariosTabla` es una tabla HTML simple. La consigna no pide TanStack Table para esa página y `Tabla` está armada para editar y eliminar, no para activar y desactivar. El admin no ve el botón en su propia fila, así no se puede dejar afuera por error.

El formulario de productos no tiene ingredientes ni imágenes, porque asociar ingredientes era un opcional del TP8 que no hice. Al editar se mandan las imágenes que el producto ya tenía para que el PUT no las borre. Los ingredientes no viajan en el body, así que el backend conserva los que ya estaban.

En lugar de un `CategoriaList` y un `CategoriaModal` por entidad hay una sola `Tabla` y un solo `Modal` en `shared/components`, porque las tres páginas solo cambian en las columnas y los campos. Cada feature tiene su componente de tabla con las columnas, y los campos del formulario se escriben en la página y el modal los recibe como `children`.

Al abrir el modal para editar, `form.reset` carga los datos del registro con la opción `keepDefaultValues`. Sin ella, en el render siguiente `useForm` volvía a recibir los valores vacíos y pisaba los datos cargados. Si la API rechaza el guardado, `mutateAsync` lanza el error y TanStack Form lo vuelve a lanzar, así que en el `onSubmit` lo atrapo para que no quede una promesa rechazada sin manejar.

`pnpm lint` muestra tres avisos `incompatible-library`, uno por cada componente de tabla. Los da `useReactTable`, que devuelve funciones que el compilador de React no puede memorizar, y ya aparecían en el TP9 cuando la tabla estaba en la página. Son avisos y no errores, y la app compila igual.

Cuando el backend rechaza una petición, el navegador anota en la consola la respuesta fallida. Pasa con el 409 de un nombre repetido y también con el 401 de `/auth/me` al abrir la aplicación sin sesión. Es el registro de red que aparece con cualquier respuesta de error, y la aplicación la maneja mostrando el mensaje o llevando al login.
