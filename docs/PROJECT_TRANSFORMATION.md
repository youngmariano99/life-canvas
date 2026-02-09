# Transformación de Life-OS: De Local a Cloud PWA & Mobile

Este documento detalla el proceso de transformación de **Life-OS** desde una aplicación monolítica local a una **Progressive Web App (PWA)** totalmente desplegada en la nube y optimizada para móviles.

## 1. Objetivos Logrados

### A. Progressive Web App (PWA) 📱
Transformamos la web en una aplicación instalable.
- **Tecnología**: `vite-plugin-pwa`.
- **Características**:
    - Manifest (`manifest.json`) configurado con nombre, colores e iconos.
    - Iconos generados (192x192, 512x512).
    - Meta tags para iOS (status bar, apple-touch-icon).
    - Service Worker para funcionamiento offline/cache.

### B. Migración a la Nube (Cloud Native) ☁️
Desacoplamos servicios para escalabilidad y persistencia.
- **Base de Datos**: Migración de PostgreSQL Local a **Neon** (Serverless Postgres).
- **Almacenamiento de Archivos**: Migración de disco local (`uploads/`) a **Cloudinary** (CDN de imágenes).
- **Backend**: Despliegue en **Render** (Node.js/NestJS).
- **Frontend**: Despliegue en **Netlify** (Static hosting + CDN).

### C. Optimización Móvil (UX) 👆
Mejora de la experiencia de usuario en dispositivos móviles.
- **Navegación**: Reemplazo del menú hamburguesa superior por una **Bottom Navigation Bar** (estilo app nativa).
- **Layout**: Ajustes de padding y espaciado para evitar superposiciones.
- **Acceso Rápido**: Priorización de vistas "Hoy", "Fitness" y "Notas".

---

## 2. Bitácora de Desafíos y Soluciones 🛠️

Durante el despliegue enfrentamos varios obstáculos técnicos. Aquí el registro de cada uno y su solución definitiva.

### 🔴 Error 1: Netlify Build Failed (PWA Cache)
**Síntoma**: El build de Netlify fallaba.
**Causa**: El archivo principal de JS (`index-....js`) pesaba **3.54 MB**. La configuración por defecto de Workbox (PWA) tiene un límite de caché de **2 MB**.
**Solución**:
Se aumentó el límite en `vite.config.ts`:
```typescript
workbox: {
  maximumFileSizeToCacheInBytes: 5000000, // 5 MB
}
```

### 🔴 Error 2: Render Build Failed (Missing CLI)
**Síntoma**: `sh: 1: nest: not found` durante el despliegue.
**Causa**: Render detecta `NODE_ENV=production` y por defecto **no instala** `devDependencies`. NestJS necesita `@nestjs/cli` (que estaba en devDependencies) para compilar el proyecto (`nest build`).
**Solución**:
Se movieron las siguientes librerías de `devDependencies` a `dependencies` en `package.json`:
- `@nestjs/cli`
- `typescript`
- `ts-loader`, `ts-node`, `tsconfig-paths`

### 🔴 Error 3: Render Build Failed (Missing Types)
**Síntoma**: `Error: Cannot find namespace 'Express'` durante la compilación.
**Causa**: Similar al anterior. Los tipos `@types/express`, `@types/multer` y `@types/node` estaban en `devDependencies`, por lo que no existían al momento de compilar en Render.
**Solución**:
Se movieron esos paquetes `@types/*` a `dependencies`.

### 🔴 Error 4: Render Runtime Error (Port Binding)
**Síntoma**: El despliegue era exitoso, pero Render mataba el proceso después de un tiempo por "Timeout" (no detectaba puerto abierto).
**Causa**: La aplicación escuchaba en `127.0.0.1` (localhost), lo cual en un contenedor Docker impide conexiones desde fuera.
**Solución**:
Se cambió el host en `main.ts` para escuchar en todas las interfaces:
```typescript
// Antes: await app.listen(port, '127.0.0.1');
await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
```

### 🔴 Error 5: "Backend Offline" (Frontend Connection)
**Síntoma**: El Frontend cargaba, pero no mostraba datos y decía "Backend Offline".
**Causa**: La URL de la API estaba "quemada" (hardcoded) en el código del cliente como `http://127.0.0.1:3000/api`.
**Solución**:
Se actualizó `client/src/lib/api.ts` para usar variables de entorno:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";
```
*Nota: Se configuró `VITE_API_URL` en el panel de Netlify apuntando a Render.*

### 🔴 Error 6: Netlify 404 / MIME Type Error
**Síntoma**: Pantalla blanca al cargar la web. Consola: `MIME type ('application/octet-stream') is not executable`.
**Causa**: Netlify no sabía que era una SPA (Single Page Application) y servía archivos incorrectos o no redirigía al `index.html`.
**Solución**:
1. Se creó `netlify.toml` especificando `base = "client"` y `publish = "dist"`.
2. Se configuró `base: '/'` en `vite.config.ts`.
3. Se agregó regla de redirección SPA en `netlify.toml`: `/*  /index.html  200`.

---

## 3. Estado Final
El sistema es ahora robusto, escalable y accesible desde cualquier lugar.
- **Frontend**: https://segundo-cerebro.netlify.app/
- **Backend**: https://life-canvas.onrender.com
- **Base de Datos**: Neon (PostgreSQL)
- **Archivos**: Cloudinary
