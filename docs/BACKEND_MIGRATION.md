# Migración a Backend Propio (NestJS + Prisma + PostgreSQL)

Este documento detalla el proceso de transición de una arquitectura *client-side* (localStorage) a una arquitectura *full-stack* con Backend propio.

## 1. Nueva Arquitectura

El sistema ahora se divide en dos aplicaciones principales que corren simultáneamente:

*   **Frontend**: React (Vite) corriendo en puerto `8080`.
*   **Backend**: NestJS corriendo en puerto `3000`.
*   **Base de Datos**: PostgreSQL local.
*   **ORM**: Prisma.

### Diagrama de Comunicación

```
[React Frontend] <---> [API Client (fetch)] <---> [NestJS Controller] <---> [Service] <---> [Prisma] <---> [PostgreSQL]
```

## 2. Estructura del Proyecto

Se ha reorganizado el proyecto en dos carpetas principales:

*   `/client`: Código del frontend (originalmente en la raíz).
*   `/server`: Código del backend (nuevo proyecto NestJS).

**Comando de Inicio Universal**:
Se ha creado un script `LifeCanvas.bat` en la raíz que:
1.  Levanta el Backend (`npm run start:dev` en `/server`).
2.  Levanta el Frontend (`npm run dev` en `/client`).
3.  Abre el navegador en `http://localhost:8080`.

## 3. Estado de la Migración

| Módulo | Estado | Backend (CRUD) | Frontend Integration | Notas |
| :--- | :---: | :---: | :---: | :--- |
| **Roles** | ✅ Listo | ✅ | ✅ | Carga inicial y gestión completa. |
| **Metas (Goals)** | ✅ Listo | ✅ | ✅ | Relación con Roles establecida. |
| **Hábitos** | ✅ Listo | ✅ | ✅ | Validación de `customDays` como array. |
| **Habit Logs** | ✅ Listo | ✅ | ✅ | Lógica de *upsert* para marcar días. |
| **Proyectos** | ✅ Listo | ✅ | ✅ | Validación de `statuses` en create/update. |
| **Actividades** | ✅ Listo | ✅ | ✅ | Soporte para reordenamiento optimista. |
| **Piedra Diaria** | ✅ Listo | ✅ | ✅ | Lógica de *upsert* reutilizando título si solo se completa. |
| **Desviaciones** | ✅ Listo | ✅ | ✅ | (Deviation) Completado. |
| **Recursos** | ✅ Listo | ✅ | ✅ | (Resources) Completado. Tipado actualizado con `goalId`. |
| **Notas** | ✅ Listo | ✅ | ✅ | Sistema de carpetas y notas. Completado. |
| **Calendario** | ✅ Listo | ✅ | ✅ | Eventos. Completado. |

## 5. Migración de ORM: De Prisma a TypeORM (Enero 2026)

### **Contexto y Decisión**
Originalmente se inició la migración utilizando **Prisma ORM**. Sin embargo, se encontraron problemas críticos de compatibilidad con el entorno de Windows del usuario (error `spawn prisma-client ENOENT`), causados posiblemente por corrupción de binarios o restricciones del sistema operativo que impedían la ejecución del cliente nativo generado.

Para garantizar la **estabilidad, portabilidad y simplicidad** del proyecto (especialmente para uso personal sin dependencias complejas), se decidió migrar a **TypeORM**.

**Ventajas de TypeORM en este contexto:**
*   **Driver Nativo JS**: Utiliza `pg` (librería estándar de Postgres), eliminando la dependencia de binarios `.exe` compilados que suelen fallar en ciertos entornos.
*   **Sin "Generación"**: No requiere un paso intermedio `npx prisma generate` que puede corromperse; las Entidades son clases TypeScript normales.
*   **Integración NestJS**: Es el ORM por defecto del framework.

---

### **Plan de Migración (Paso a Paso)**
El cambio implica reemplazar la capa de acceso a datos preservando la lógica de negocio.

1.  **Limpieza Profunda**:
    *   Eliminación total de librerías `prisma` y `@prisma/client`.
    *   Borrado de carpeta `src/prisma` y archivo `schema.prisma`.

2.  **Infraestructura Base**:
    *   Instalación de `@nestjs/typeorm`, `typeorm` y `pg`.
    *   Configuración de `TypeOrmModule` en `AppModule` con conexión a Postgres.

3.  **Conversión de Modelos a Entidades**:
    *   Cada modelo de `schema.prisma` se convierte manualmente en una Clase Entidad (`*.entity.ts`) usando decoradores `@Entity`, `@Column`, `@OneToMany`.

4.  **Refactorización de Servicios**:
    *   Reemplazo de la inyección `PrismaService` por `@InjectRepository(Entity)`.
    *   Traducción de consultas:
        *   `findMany()` -> `find()`
        *   `findUnique()` -> `findOneBy()`
        *   `create()` -> `create()` + `save()`
        *   `update()` -> `update()`
        *   `delete()` -> `delete()`

5.  **Verificación**:
    *   Compilación exitosa (`npm run build`).
    *   Validación de creación automática de tablas (`synchronize: true`).

## 6. Notas Técnicas y Problemas Conocidos
### A. Error de Prisma Client (Obsoleto)
*(Se mantiene como referencia histórica)*
**Síntoma**: Error `spawn prisma-client ENOENT`.
**Solución**: Se abandonó la herramienta en favor de TypeORM.

### B. Manejo de Fechas (Date vs String)
**Problema**: El frontend espera fechas como strings simples (`"YYYY-MM-DD"`) para inputs tipo `date`, pero el Backend/DB devuelve strings ISO (`"2024-01-01T00:00:00.000Z"`).
**Solución**:
*   **En Backend**: Los DTOs usan `@IsDateString()` o transformación manual `new Date(string)` en el servicio.
*   **En Frontend**: Al comparar fechas (ej. para ver si un hábito está completado hoy), normalizar usando `.split('T')[0]` o librerías como `date-fns` para evitar falsos negativos por zona horaria u hora.

### C. Watch Mode de NestJS no detecta nuevos módulos
**Problema**: Creas un nuevo módulo, lo importas en `AppModule`, pero NestJS lanza error de dependencia no encontrada.
**Solución**: Detener el servidor (`Ctrl+C`) y volver a iniciarlo (`npm run start:dev`).

### D. Errores de TypeScript/Linter sobre propiedades de Prisma (ej. `startDate`)
**Síntoma**: El editor marca errores como `Property 'startDate' does not exist in type 'CalendarEventCreateInput'`.
**Causa**: Los tipos generados por Prisma (`node_modules/.prisma/client`) están desactualizados respecto al `schema.prisma` actual.
**Solución**:
1.  Detener el servidor.
2.  Ejecutar `npx prisma generate` dentro de la carpeta `/server`.
3.  Si el error persiste, reiniciar el servidor de TypeScript en el editor (VS Code: `Ctrl+Shift+P` -> `TypeScript: Restart TS Server`).

## 6. Guía de Implementación para Nuevos Módulos

Para migrar el siguiente módulo (ej. Proyectos), seguir este flujo:

1.  **Backend**:
    *   Crear estructura: `mkdir server/src/projects/dto`.
    *   Crear DTOs: `create-project.dto.ts` (validaciones con class-validator).
    *   Crear Módulo: `projects.module.ts`.
    *   Crear Servicio: `projects.service.ts` (lógica CRUD + Prisma).
    *   Crear Controlador: `projects.controller.ts` (endpoints HTTP).
    *   Registrar en `AppModule`.

2.  **Frontend**:
    *   Actualizar `api.ts`: Añadir objeto `projects` con métodos `fetch`.
    *   Actualizar webhook `useLifeOS`:
        *   Añadir llamada a `api.projects.getAll()` en el `useEffect` inicial.
        *   Reemplazar funciones `addProject`, `updateProject`, etc., por versiones `async` que llamen a la API.


## 7. Desafíos y Soluciones en la Implementación de TypeORM (Día 19/01/2026)

Durante el despliegue final de la migración a TypeORM, se encontraron y resolvieron los siguientes obstáculos técnicos críticos:

### A. Resolución de Host de Base de Datos
*   **Problema**: Error `Connection refused` persistente usando `localhost` en Windows con Node.js reciente.
*   **Causa**: Ambigüedad en la resolución DNS (IPv4 vs IPv6).
*   **Solución**: Se forzó el uso de IP explícita `127.0.0.1` tanto en el archivo `.env` como en la configuración de fallback en `app.module.ts`.

### B. Inferencia de Tipos de Columna (DataTypeNotSupportedError)
*   **Problema**: TypeORM fallaba al iniciar con el error `Data type "Object" in "DailyStone.note" is not supported by "postgres" database`.
*   **Causa**: Al definir propiedades como `note: string | null` sin especificar el tipo de columna en el decorador, TypeORM infería incorrectamente el tipo como `Object` en lugar de `text` o `varchar`.
*   **Solución**: Especificar explícitamente el tipo en el decorador: `@Column({ type: 'text', nullable: true })`. Esto se aplicó en `DailyStone`, `FitnessActivity` y `HabitLog`.

### C. Metadatos de Relaciones Incompletos
*   **Problema**: TypeORM no lograba construir el mapa de relaciones, lanzando errores internos de validación de metadatos.
*   **Causa**: En relaciones bidireccionales (ej. Usuario <-> Etiquetas), si un lado de la relación (`@ManyToOne`) no declara explícitamente la propiedad inversa usando una función flecha, TypeORM puede perder el rastro de la conexión al autotcargar entidades.
*   **Solución**: Completar la definición en todas las entidades hijas para referenciar la lista en el padre.
    *   *Antes*: `@ManyToOne('User') user: User;`
    *   *Después*: `@ManyToOne('User', (user: any) => user.noteTags) user: User;`

### D. Integridad de Datos y Sincronización (QueryFailedError)
*   **Problema**: La sincronización de esquema (`synchronize: true`) fallaba repetidamente con `QueryFailedError: la columna "user_id" de la relación "roles" contiene valores null`.
*   **Causa**: La base de datos local contenía registros antiguos (creados en etapas previas sin restricciones estrictas) que tenían campos `user_id` nulos. Al intentar aplicar la nueva restricción `NOT NULL` de las entidades TypeORM, la migración fallaba.
*   **Solución**:
    1.  Se crearon scripts de mantenimiento (`clean-db.js`, `fix-roles.js`) para identificar y limpiar registros huérfanos.
    2.  Debido a dependencias circulares complejas en los datos basura, se optó por una limpieza total del esquema público (`DROP SCHEMA public CASCADE`) para permitir que TypeORM reconstruyera las tablas desde cero de forma limpia y correcta.

