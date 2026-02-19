# Historia y Evolución - Life-OS 2026

Este documento registra la transformación del proyecto, las decisiones arquitectónicas clave y los problemas técnicos superados.

## 1. De Local a Cloud PWA (Transformación Principal)

El proyecto comenzó como una aplicación monolítica simple y evolucionó hacia una PWA (Progressive Web App) totalmente distribuida.

### Hitos Logrados
1.  **PWA**: Implementación de `vite-plugin-pwa` para instalación en móviles y soporte offline básico.
2.  **Cloud Native**: Migración de BD local a **Neon** y almacenamiento de archivos a **Cloudinary**.
3.  **Deploy Distribuido**: Frontend en Netlify (Vite) y Backend en Render (NestJS), comunicándose vía API.

---

## 2. La Gran Migración de Base de Datos (Enero 2026)

### El Problema con Prisma
Inicialmente se usó Prisma ORM. Sin embargo, surgieron problemas graves en el entorno de producción (Render) y en Windows local:
*   Error `spawn prisma-client ENOENT`: Corrupción de binarios al desplegar.
*   Dependencia de ejecutables `.exe` que fallaban en entornos containerizados limitados.

### La Solución: TypeORM
Se migró todo el backend a **TypeORM** por:
*   **Driver Nativo JS**: Usa `pg` (puro JavaScript) sin binarios ocultos.
*   **Portabilidad**: Funciona idéntico en Windows, Linux y Mac.
*   **Integración**: Es el ORM nativo de NestJS.

### Proceso de Migración
1.  Conversión manual de `schema.prisma` a Entidades de TypeORM (`.entity.ts`).
2.  Refactorización completa de Servicios (de `prisma.findMany` a `repo.find`).
3.  Limpieza de toda referencia a Prisma.

---

## 3. Plan de Reparación (Febrero 2026)

Durante el desarrollo surgieron bugs críticos que fueron sistemáticamente resueltos:

### A. Problemas de Zona Horaria (UTC vs Local)
*   **Síntoma**: Eventos creados "hoy" desaparecían o se movían al día anterior.
*   **Causa**: La DB guardaba en UTC (`TPZ`), y el frontend enviaba fechas locales convertidas, creando un desfase de -3 horas.
*   **Solución**: Estandarización de fechas como strings `YYYY-MM-DD` puros para lógica de negocio, ignorando la hora salvo para ordenamiento visual.

### B. Ciclos de Dependencia en Módulos
*   **Síntoma**: Error `Nest can't resolve dependencies`.
*   **Causa**: Módulos importándose mutuamente (ej: `UsersModule` <-> `AuthModule`).
*   **Solución**: Uso de `forwardRef()` en NestJS y refactorización para extraer lógica común a módulos compartidos.

### C. TypeORM Relaciones Circulares
*   **Síntoma**: Error al guardar entidades anidadas.
*   **Solución**: Definición explícita de ambos lados de la relación en los decoradores (`@OneToMany`, `@ManyToOne`) usando funciones flecha `model => model.relation` para evitar evaluación prematura.

---

## 4. Estado Actual (Febrero 2026)

El sistema ahora es **estable**.
*   **Frontend**: React 18 + Vite (Rápido, PWA).
*   **Backend**: NestJS + TypeORM (Robusto, Tipado).
*   **DB**: PostgreSQL (Neon para Prod, Local para Dev).
*   **Despliegue**: Flujo Híbrido (ver `GUIA_DESPLIEGUE.md`).

### D. Autenticación y Truncamiento de Hashes (Febrero 2026)
*   **Síntoma**: Error `Invalid credentials` (401) persistente, incluso con la contraseña correcta.
*   **Diagnóstico**: La contraseña en base de datos (`users.password`) tenía el formato correcto de bcrypt pero una longitud de **57 caracteres**. Un hash válido de bcrypt siempre tiene **60 caracteres**. Esto indicaba que el hash se cortó al ser copiado o generado manualmente en algún punto previo.
*   **Solución**: Se generó un nuevo hash válido mediante un script de Node.js (`bcrypt.hash`) y se actualizó directamente en la base de datos, resolviendo el acceso.
*   **Lección**: Nunca confiar en hashes copiados manualmente; siempre generarlos programáticamente para asegurar integridad.
