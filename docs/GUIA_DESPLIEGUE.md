# Guía de Despliegue - Life-OS 2026

Esta guía unifica las instrucciones para configurar el entorno local, desplegar en la nube (Neon/Render/Netlify) y trabajar con el flujo híbrido.

## Índice

1.  [Requisitos Previos](#1-requisitos-previos)
2.  [Entorno Local (Desarrollo)](#2-entorno-local-desarrollo)
3.  [Despliegue en la Nube (Producción)](#3-despliegue-en-la-nube-producción)
4.  [Flujo de Trabajo Híbrido](#4-flujo-de-trabajo-híbrido)
5.  [Migración de Datos (Local -> Nube)](#5-migración-de-datos-local---nube)

---

## 1. Requisitos Previos

*   Node.js v18+ instalado.
*   PostgreSQL v15+ instalado localmente.
*   Git instalado.
*   Cuenta en GitHub.
*   Cuentas gratuitas en Neon.tech, Render.com y Netlify.com para producción.

---

## 2. Entorno Local (Desarrollo)

Para trabajar en tu máquina:

### Backend
1.  Navega a la carpeta: `cd server`
2.  Instala dependencias: `npm install`
3.  Crea un archivo `.env` basado en `.env.example`:
    ```env
    DATABASE_URL="postgresql://postgres:password@127.0.0.1:5432/life-canvas"
    PORT=3000
    ```
4.  Inicia el servidor: `npm run start:dev`

### Frontend
1.  Navega a la carpeta: `cd client`
2.  Instala dependencias: `npm install`
3.  Crea un archivo `.env`:
    ```env
    VITE_API_URL="http://localhost:3000"
    ```
4.  Inicia el servidor: `npm run dev`

---

## 3. Despliegue en la Nube (Producción)

### Base de Datos: Neon (PostgreSQL)
1.  Crea un proyecto en **Neon.tech**.
2.  Copia la "Connection String" (pooled).
3.  Esta será tu `DATABASE_URL` en el backend de producción.

### Backend: Render (NestJS)
1.  Crea un **Web Service** en Render conectado a tu repo GitHub.
2.  **Root Directory**: `server`
3.  **Build Command**: `npm install && npm run build`
4.  **Start Command**: `npm run start:prod`
5.  **Variables de Entorno**:
    *   `DATABASE_URL`: (La string de Neon)
    *   `PORT`: `3000`
    *   `NODE_ENV`: `production`

### Frontend: Netlify (React)
1.  Crea un "New site from Git" en Netlify.
2.  **Base directory**: `client`
3.  **Build command**: `npm run build`
4.  **Publish directory**: `dist`
5.  **Variables de Entorno**:
    *   `VITE_API_URL`: (La URL de tu backend en Render, ej: `https://api.onrender.com`)

---

## 4. Flujo de Trabajo Híbrido

Puedes desarrollar localmente conectándote a la base de datos de producción (Neon) para verificar datos reales, o viceversa (aunque no recomendado por latencia).

### Conectar Backend Local a Neon
1.  Modifica tu `.env` local en `/server`.
2.  Cambia `DATABASE_URL` por la string de Neon.
3.  El backend detectará automáticamente que es una URL remota y activará SSL (`ssl: { rejectUnauthorized: false }`) gracias a la configuración en `app.module.ts`.

---

## 5. Migración de Datos (Local -> Nube)

Para llevar tus datos locales a producción:

### Paso A: Dump Local
Exporta solo los datos (y esquema si es necesario) de tu DB local.
```bash
# Desde la terminal (asegúrate de tener pg_dump en el PATH)
pg_dump -h 127.0.0.1 -U postgres -d life-canvas --no-owner --no-acl --clean --if-exists > backup_local.sql
```

### Paso B: Restaurar en Neon
Importa el archivo SQL a la nube.
```bash
# Necesitas la string de conexión de Neon
psql "postgres://[user]:[password]@[host]/[dbname]?sslmode=require" < backup_local.sql
```
*Nota: Si tienes errores de llaves foráneas, asegúrate de usar `--clean` para borrar tablas existentes antes de recrearlas.*
