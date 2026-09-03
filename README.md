# Frontend — Catálogo Público del Lote de Autos

React + Vite. Consume tu backend (`car-lot-backend`) para mostrar el inventario disponible.

## 🎨 Sobre el diseño

Paleta oscura tipo asfalto con acento ámbar, tipografía condensada de señalización
(Oswald) para títulos y monoespaciada (IBM Plex Mono) para folios/VIN/precio —
inspirada en los "window stickers" de precio que se pegan en el parabrisas de los
autos en un lote real. Cada tarjeta de vehículo tiene ese detalle (el "hoyo" perforado
junto al precio).

## 🚀 Instalación

### 1. Requisitos
- Node.js 18+
- Tu backend (`car-lot-backend`) corriendo — normalmente en `http://localhost:4000`

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la URL del backend
```bash
cp .env.example .env
```
Por defecto ya apunta a `http://localhost:4000/api`, que es donde corre tu backend
según lo que configuramos. Si tu backend usa otro puerto, cámbialo en `.env`.

### 4. Levantar el frontend
```bash
npm run dev
```
Se abre en `http://localhost:5173`. Con el backend corriendo en otra terminal
(`npm run dev` dentro de `car-lot-backend`), el catálogo debería cargar los autos
automáticamente.

## 📁 Estructura

```
car-lot-frontend/
├── src/
│   ├── api.js              # cliente que habla con tu backend
│   ├── utils.js             # formato de precio, km, labels en español
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── FilterBar.jsx
│   │   └── VehicleCard.jsx  # tarjeta "sticker de precio"
│   ├── pages/
│   │   ├── Catalog.jsx      # página principal con filtros
│   │   └── VehicleDetail.jsx
│   ├── styles/global.css    # sistema de diseño completo
│   ├── App.jsx               # rutas
│   └── main.jsx
└── .env.example
```

## 🔌 Cómo está conectado al backend

Todo pasa por `src/api.js`, que llama a estos endpoints de tu backend (públicos,
sin necesitar login):

- `GET /vehicles?search=&brandId=&typeId=&condition=&maxPrice=` — catálogo con filtros
- `GET /vehicles/:id` — detalle de un auto
- `GET /brands` — para el filtro de marca
- `GET /vehicle-types` — para el filtro de tipo

Si cambias algo en el backend (por ejemplo, agregas un campo nuevo al modelo
`Vehicle`), solo necesitas reflejarlo en `VehicleCard.jsx` o `VehicleDetail.jsx`
para que se muestre.

## 🖼️ Sobre las fotos

Ahora mismo, si un vehículo no tiene `images`, la tarjeta muestra un placeholder
con el folio. En cuanto conectes subida de imágenes en el backend (pendiente en
el roadmap), las fotos van a aparecer automáticamente — no hay que tocar nada
del frontend.

## 🔐 Panel de administración

Todo vive bajo `/admin` en el mismo proyecto — no es una app aparte.

- **`/admin/login`** — login para staff (`ADMIN` o `SALES`). Un `CUSTOMER` no puede entrar.
- **`/admin`** — resumen: cuántos autos disponibles/apartados/vendidos, ingresos totales.
- **`/admin/vehiculos`** — tabla de todo el inventario, con un selector para cambiar el
  estado de cada auto (`Disponible` → `Apartado` → `Vendido` → `En servicio`) sin recargar.
- **`/admin/vehiculos/nuevo`** y **`/admin/vehiculos/:id/editar`** — alta y edición, incluye
  gestión de fotos (agregar/quitar URLs de imágenes).
- **`/admin/ventas`** — registrar una venta o reserva (da de alta al comprador si no
  existe, descuenta el auto del catálogo público automáticamente) y avanzar su estado.
- **`/admin/catalogo`** — alta rápida de marcas y tipos de vehículo nuevos.

La sesión se guarda en `localStorage` (token JWT + datos del usuario). Cierra sesión
con el botón en la barra lateral, o el token expira solo según `JWT_EXPIRES_IN` en
el backend.

**Para entrar por primera vez**, usa las cuentas del seed del backend:
- `admin@lotedeautos.com` / `admin123`
- `vendedor@lotedeautos.com` / `vendedor123`

## 🔜 Siguientes pasos sugeridos

- Botón "Contactar sobre este auto" en el catálogo público → conectar a WhatsApp o un formulario
- Paginación visual en el catálogo (el backend ya la soporta, falta el control en la UI)
- Subida real de archivos de imagen (hoy el panel solo acepta URLs ya subidas a algún storage)
- Historial de estado del vehículo visible en el panel (el endpoint `getVehicleHistory` ya existe en `api.js`)
