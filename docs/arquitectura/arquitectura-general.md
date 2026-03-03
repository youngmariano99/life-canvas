# Arquitectura General de Life-OS 2026

Este documento detalla la arquitectura completa de extremo a extremo del proyecto **Life-OS 2026**. Proporciona una visión profunda de cómo está estructurado el sistema, las tecnologías que emplea y las decisiones de diseño arquitectónico tomadas a lo largo de su evolución.

## 1. Visión Holística del Sistema

Life-OS 2026 es una aplicación **Full-Stack Híbrida** (PWA en el Frontend + API RESTful en el Backend) diseñada para la gestión integral de la productividad personal bajo la metodología de "Superhábitos".

El repositorio sigue una estructura de directorios dividida en monorepo:
- `/client`: Frontend de la aplicación (SPA).
- `/server`: Backend de la aplicación (API).
- `/docs`: Documentación técnica y de procesos organizativos.

## 2. Stack Tecnológico Principal

### Frontend (User Interface)
- **Core:** React 18, TypeScript, Vite.
- **PWA:** `vite-plugin-pwa` (soporte offline básico e instalabilidad en móvil y desktop).
- **Estilos:** Tailwind CSS con variables CSS nativas para soportar temáticas (Modo Claro/Oscuro) y colores semánticos por Rol (Custom Theming).
- **Componentes Base:** shadcn/ui (basado en Radix UI para máxima accesibilidad y flexibilidad).
- **Iconografía:** Lucide React.
- **Animaciones:** Framer Motion.
- **Estado Global:** Context API (`LifeOSContext`) + Custom Hooks (`useLifeOS`).
- **Peticiones HTTP:** Cliente Axios configurado con el baseUrl dinámico.
- **Herramientas de Módulos Específicos:** TipTap (Editor de texto enriquecido para notas/registro), Excalidraw (Pizarras interactivas empotradas), date-fns (Manipulación pura de fechas).

### Backend (API REST)
- **Framework:** NestJS.
- **Lenguaje:** TypeScript.
- **ORM:** TypeORM (Migrado exitosamente desde Prisma para evitar problemas con binarios precompilados y asegurar una portabilidad robusta en renders limitados de memoria).
- **Validación de Datos:** Enfoque declarativo con `class-validator` y `class-transformer` centralizados a través de DTOs (Data Transfer Objects).
- **Gestión Multimedia:** Cloudinary (para manejar de manera descentralizada el contenido estático como vision boards y portadas).

### Base de Datos
- **Motor:** PostgreSQL (v15+).
- **Infraestructura Prod:** Neon.tech (Serverless Postgres).

---

## 3. Arquitectura del Frontend (`/client`)

El Frontend se rige por un diseño modular, con una fuerte arquitectura orientada a la experiencia de usuario (**UI Optimista**).

### 3.1. Gestión del Estado (Optimistic UI)
El sistema emplea un patrón de sincronización híbrida continuo y **Offline-First (Nivel 2)**:
- **Estado Remoto (Server State):** El backend y su BD son la única fuente de la verdad para el ciclo de vida largo.
- **Estado Local Inmediato (Client State):** A través del hook orquestador `useLifeOS`, cada vez que el usuario realiza un cambio (ej., marcar la Piedra del Día, crear un Objetivo), el estado en React se muta sincrónicamente. La interfaz de usuario refleja la acción al instante. 
- **Persistencia Masiva (Caché):** El estado se respalda de forma asíncrona e ininterrumpida en **IndexedDB** a través de `localforage` (`lifeOSStore.ts`). Esto permite a la app cargar miles de registros instantáneamente al abrirse sin conexión, saltando las limitantes de 5MB y el bloqueo de hilo del viejo localStorage.
- **Cola de Mutaciones (Action Queue):** Si un cambio es realizado sin internet (Offline), la red en segundo plano emitirá un *Network Error*. El interceptor general de red de la UI alojará la petición HTTP cruda en una cola persistente dentro de la base de datos local y avisará visualmente con un Badge en cabecera. Al recuperar conexión, la PWA despachará cada petición atrapada de forma silenciosa para empatar los datos hacia la Nube.

### 3.2. Estructura de Componentes
El diseño modular segmenta en jerarquía:
- `src/layout/`: Contenedores estructurales (Dashboard view pane, Sidebars, toolbars funcionales).
- `src/views/`: Vistas de alto nivel que representan tiempos y perspectivas (`IdentityView`, `SemesterView`, `WeeklyView`, `DailyView`).
- `src/components/`: Módulos agnósticos al tiempo organizados por dominio (`habits`, `notes`, `fitness`, `weekly`, `deviations`).

---

## 4. Arquitectura del Backend (`/server`)

El servidor aprovecha los patrones de Inyección de Dependencias impulsados por NestJS, construyendo un sistema tipo Domain-Driven Design (DDD) simplificado.

### 4.1. Módulos Orientados a Funcionalidad (Feature Modules)
Cada funcionalidad macro (ej., Hábitos, Metas, Notas) cuenta con una triada de capas herméticamente selladas:
1. **Controller (Endpoints y DTOs):** Valida la petición de entrada y delega al servicio aplicable.
2. **Service (Lógica de Negocio):** Agrupa las directrices de Superhábitos (ej., crear la jerarquía de dependencias temporales cuando se genera un Goal trimestral). Interroga a la BD a través de Repositories.
3. **Entity (Modelo de Datos):** Mapeo relacional estructurado como clase TypeScript para TypeORM.

### 4.2. Modelado de Datos
Todo el sistema transcurre a través de relaciones altamente entrelazadas con el pilar de **Resolución de Zona Horaria Crítica**.
- Un `User` posee **1** a **N** `Roles` (máximo 7 áreas de enfoque).
- Cada `Role` contiene `Habits` continuos y `Goals` enmarcados por trimestres.
- A nivel operativo, un `Goal` muta ejecutivamente en `Projects` y sus hijas de tipo `Activities` (para formato Kanban).
- Los elementos espaciales como el Segundo Cerebro (`Notes`), utilizan bases de datos recursivas con auto-referencias formales tipo (`parent_folder_id -> folder_id`).

*(Para resolver choques de zona horaria generados por bases UTC-0 vs PWA Local, la arquitectura de base de datos formatea fechas estrictamente como strings de tipo `YYYY-MM-DD` desestimando las resoluciones milisegundo).*

---

## 5. Arquitectura de Despliegue (Topología Híbrida Distribuida)

Para solventar su naturaleza "always online" pero libre de costos base de inicio, se emplea un arreglo de infraestructura distribuida.

1. **Gestión de Datos (Neon):** Servidor Serverless de postgreSQL consumido mediante encriptación SSL nativa.
2. **REST API (Render):** Web Service encargado de arrancar de manera estática y exponer los puntos finales en un runtime Node optimizado de red y alojado con despliegues sobre commit a `main`.
3. **PWA (Netlify / Vercel):** Empaquetado puro a nivel CDN.

### Flujo Dev-Ops Cíclico
La estructura híbrida de SSL inyectado mediante `TypeOrmModule` autoriza al desarrollador a correr ambos lados en local, o lanzar la PWA de Netlify apuntando tanto al servidor en la Nube como al local de manera dinámica apoyándose ciegamente en las variables de entorno sin romper CORS.
