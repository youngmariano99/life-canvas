# Manual Técnico - Life-OS 2026

Este documento unifica toda la información técnica sobre la arquitectura, base de datos, componentes y gestión de estado de **Life-OS 2026**.

## Índice

1.  [Arquitectura General](#1-arquitectura-general)
2.  [Base de Datos y Modelos](#2-base-de-datos-y-modelos)
3.  [Backend (NestJS)](#3-backend-nestjs)
4.  [Frontend (React + Vite)](#4-frontend-react--vite)
5.  [Gestión de Estado](#5-gestión-de-estado)
6.  [Sistema de Estilos](#6-sistema-de-estilos)

---

## 1. Arquitectura General

El sistema sigue una arquitectura **Full-Stack Híbrida** diseñada para ser escalable pero sencilla de desarrollar localmente.

### Diagrama de Comunicación

```
[Usuario] -> [React Frontend (Netlify/Local)] <---> [API Client (Axios)] <---> [NestJS Backend (Render/Local)] <---> [TypeORM] <---> [PostgreSQL (Neon/Local)]
```

### Componentes Principales

*   **Frontend**: SPA construida con React, Vite y TypeScript. Se comunica con el Backend a través de una API RESTful.
*   **Backend**: API REST construida con NestJS. Maneja la lógica de negocio, validaciones y persistencia.
*   **Base de Datos**: PostgreSQL relacional. Usamos **TypeORM** como ORM para definir esquemas y relaciones.

---

## 2. Base de Datos y Modelos

El esquema está diseñado para la metodología "Superhábitos".

### Diagrama Entidad-Relación (Simplificado)

*   **User** 1:1 **YearSettings** (Visión, Misión)
*   **User** 1:N **Roles** (Estudiante, Atleta, etc.)
*   **Role** 1:N **Goals** (Objetivos Trimestrales)
*   **Role** 1:N **Habits** (Hábitos diarios)
*   **Goal** 1:N **Projects** (Proyectos Kanban)
*   **Project** 1:N **Activities** (Tareas)
*   **Habit** 1:N **HabitLogs** (Registro de cumplimiento)
*   **User** 1:N **DailyStones** (La "Piedra" del día)
*   **User** 1:N **Notes** (Sistema de notas y pizarras)

### Tablas Principales (Schema)

| Tabla | Descripción | Relaciones Clave |
| :--- | :--- | :--- |
| `year_settings` | Configuración anual (Visión 5 años, Misión). | `user_id` |
| `roles` | Áreas de vida (máximo 7). | `user_id` |
| `goals` | Objetivos anuales/trimestrales. | `role_id`, `user_id` |
| `habits` | Definición de hábitos y frecuencia. | `role_id`, `user_id` |
| `habit_logs` | Logs diarios de hábitos (completado/fallido). | `habit_id` |
| `projects` | Proyectos para cumplir objetivos. | `goal_id` |
| `project_activities` | Tareas dentro de proyectos (Kanban). | `project_id` |
| `daily_stones` | El objetivo único más importante del día. | `user_id`, `role_id` |
| `deviations` | Registro de aprendizajes y errores. | `goal_id`, `habit_id` |
| `fitness_activities` | Logs de entrenamiento y NEAT. | `user_id` |
| `note_folders` | Estructura de carpetas para notas. | `parent_id` (recursiva) |
| `notes` | Notas de texto, pizarras o documentos. | `folder_id` |

*(Para ver el SQL completo, revisar `server/src/database/schema.sql` si existiera, o los archivos `*.entity.ts` en el backend)*

---

## 3. Backend (NestJS)

Ubicación: `/server`

### Tecnologías
*   **Framework**: NestJS (Modular, Inyección de Dependencias).
*   **Lenguaje**: TypeScript.
*   **ORM**: TypeORM.
*   **Validación**: `class-validator` y `class-transformer` en DTOs.
*   **Carga de Archivos**: Cloudinary (para imágenes de roles/visión).

### Estructura de Módulos
Cada funcionalidad tiene su propio módulo (ej: `goals.module.ts`) que encapsula:
1.  **Controller**: Define endpoints HTTP (GET, POST, etc.).
2.  **Service**: Contiene la lógica de negocio y llamadas a DB.
3.  **Entity**: Define la tabla en BD.
4.  **DTOs**: Define la estructura de datos de entrada/salida.

### Configuración Clave (`AppModule`)
*   Conexión a BD vía `TypeOrmModule`.
*   Soporte SSL dinámico (activo solo en producción/Neon).
*   Servicio de Archivos Estáticos (opcional para despliegues locales unificados).

---

## 4. Frontend (React + Vite)

Ubicación: `/client`

### Tecnologías
*   **Core**: React 18, TypeScript, Vite.
*   **UI Library**: shadcn/ui (basado en Radix UI).
*   **Estilos**: Tailwind CSS.
*   **Iconos**: Lucide React.
*   **Estado**: Context API + Hooks personalizados.
*   **HTTP**: Axios (configurado en `src/lib/api.ts`).
*   **Utiles**: `date-fns` (fechas), `framer-motion` (animaciones).
*   **PWA**: `vite-plugin-pwa` para instalación y offline básico.

### Estructura de Componentes
Seguimos una jerarquía clara:
*   `layout/`: Estructura base (Dashboard, Sidebar).
*   `views/`: Vistas principales (Identity, Semester, Weekly, Daily).
*   `components/`:
    *   `wizard/`: Pasos de configuración inicial.
    *   `ui/`: Componentes base reutilizables (Botones, Inputs).
    *   `notes/`, `fitness/`, `habits/`: Componentes específicos de dominio.

---

## 5. Gestión de Estado

La aplicación utiliza un patrón híbrido:
1.  **Estado Remoto (Server state)**: Es la "fuente de verdad". Se gestiona vía `useEffect` que llama a la API al cargar.
2.  **Estado Local (Client state)**: `useLifeOS` mantiene una copia local para reactividad inmediata (Optimistic UI).

### Hook Principal: `useLifeOS`
*   Centraliza toda la lógica del frontend.
*   Expone funciones como `addGoal`, `completeDailyStone`, etc.
*   **Flujo**:
    1.  Componente llama a `addGoal`.
    2.  `addGoal` actualiza el estado local (UI instantánea).
    3.  `addGoal` llama a la API en segundo plano.
    4.  Si la API falla, se podría revertir (pendiente de implementación robusta).

---

## 6. Sistema de Estilos

### Tailwind CSS + Variables
Usamos variables CSS para soportar temas (Claro/Oscuro) y colores semánticos de roles.

*   `globals.css`: Define las variables root (`--background`, `--primary`, `--role-student`, etc.).
*   `tailwind.config.ts`: Mapea esas variables a clases de utilidad (`bg-background`, `text-primary`).

### Colores de Roles
Cada rol tiene asignado un color semántico configurable en `src/types/lifeOS.ts`:
*   Student (Azul)
*   Athlete (Rojo)
*   Entrepreneur (Naranja)
*   Etc.

Esto permite que toda la UI se adapte visualmente al contexto del rol en cada tarjeta o gráfico.
