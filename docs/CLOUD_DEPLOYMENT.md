
# Guía de Despliegue en la Nube (Cloud Deployment)

Esta guía detalla paso a paso cómo desplegar **Life Canvas** en la nube utilizando servicios modernos y gratuitos/económicos.

## 1. Base de Datos: Neon (PostgreSQL)

Neon es una base de datos PostgreSQL serverless, ideal para proyectos modernos.

### Pasos:
1.  Ve a [neon.tech](https://neon.tech) y regístrate (puedes usar GitHub/Google).
2.  Crea un **Nuevo Proyecto**.
    - Dale un nombre (ej: `life-canvas-db`).
    - Selecciona la región más cercana (ej: `US East (N. Virginia)`).
3.  Al crearla, verás un "Connection String" (Cadena de conexión).
    - **Copia la cadena que dice "Pooled connection"** (generalmente empieza con `postgres://...`).
    - Guardala en un bloc de notas seguro, la necesitarás para el Backend.
4.  Ve al apartado **Dashboard** para ver tus tablas y datos una vez conectado.

---

## 2. Backend: Render (NestJS)

Render es una plataforma unificada para hospedar aplicaciones web y APIs. 

### Prerrequisitos:
- Tu código debe estar subido a un repositorio en **GitHub** o **GitLab**.

### Pasos:
1.  Ve a [render.com](https://render.com) y crea una cuenta.
2.  En el Dashboard, haz clic en **New +** y selecciona **Web Service**.
3.  Conecta tu cuenta de GitHub y selecciona el repositorio de `life-canvas`.
4.  Configura el servicio:
    - **Name**: `life-canvas-api`
    - **Region**: La misma que tu base de datos (ej: `US East`).
    - **Branch**: `main` (o la rama que uses).
    - **Root Directory**: `server` (Importante: tu backend está en esta subcarpeta).
    - **Runtime**: `Node`.
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm run start:prod`
    - **Plan**: `Free` (para pruebas) o el más barato para producción.
5.  **Variables de Entorno (Environment Variables)**:
    - Haz clic en "Advanced" o ve a la pestaña "Environment".
    - Agrega las siguientes variables:
        - `DATABASE_URL`: Pega aquí la cadena de conexión de **Neon**.
        - `JWT_SECRET`: Crea una clave secreta larga y segura.
        - `PORT`: `3000` (Render lo usa internamente).
        - `NODE_ENV`: `production`
6.  Haz clic en **Create Web Service**.
    - Render empezará a construir tu app via logs. Si todo sale bien, te dará una URL (ej: `https://life-canvas-api.onrender.com`).
    - **Guarda esta URL**, la necesitarás para el Frontend.

---

## 3. Frontend: Netlify (React + Vite)

Netlify es excelente para hospedar sitios estáticos y SPAs (Single Page Applications) como React.

### Pasos:
1.  Ve a [netlify.com](https://netlify.com) y regístrate.
2.  Haz clic en **Add new site** -> **Import from Git**.
3.  Selecciona **GitHub** y autoriza a Netlify.
4.  Busca y selecciona tu repositorio `life-canvas`.
5.  Configura el despliegue (Build settings):
    - **Base directory**: `client` (Importante: tu frontend está aquí).
    - **Build command**: `npm run build`
    - **Publish directory**: `dist` (Vite genera los archivos aquí).
6.  **Variables de Entorno**:
    - Haz clic en "Show advanced" -> "New Variable".
    - Clave: `VITE_API_URL`
    - Valor: La URL de tu backend en Render (ej: `https://life-canvas-api.onrender.com`).
      *(Nota: Sin la barra `/` al final)*.
7.  Haz clic en **Deploy site**.
8.  Netlify construirá el sitio. En unos minutos tendrás una URL pública (ej: `https://life-canvas.netlify.app`).

---

## 4. Configuración Final (CORS)

Una vez que tengas la URL de Netlify (el frontend), debes volver a Render (el backend) para permitir que se conecten.

1.  Ve a tu proyecto en **Render**.
2.  Ve a Environment Variables.
3.  Agrega (o edita) una variable `CORS_ORIGIN` (o ajusta tu `main.ts` en NestJS para usar esta variable).
    - Valor: La URL de tu sitio en Netlify (ej: `https://life-canvas.netlify.app`).
4.  Si tu `main.ts` no usa variables para CORS, deberás modificar el código en `server/src/main.ts`:
    ```typescript
    app.enableCors({
      origin: [process.env.CORS_ORIGIN, 'http://localhost:5173'], // Permitir Netlify y Local
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    ```
5.  Haz un `git push` con este cambio para que Render se actualice.

## Resumen de URLs
- **Base de Datos**: Neon (invisible, solo conexión).
- **Backend API**: Render (`...onrender.com`).
- **Frontend App**: Netlify (`...netlify.app`).
