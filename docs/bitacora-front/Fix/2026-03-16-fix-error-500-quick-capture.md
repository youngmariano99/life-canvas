# Fix: Error 500 en Captura Rápida e Implementación de Procesamiento de Inbox

**Fecha:** 16 de marzo de 2024
**Estado:** Resuelto e Implementado

## 1. Problema: Error 500 en Quick Capture (FAB)

### Descripción
Al intentar guardar una idea desde el botón flotante (QuickCaptureFAB), el servidor respondía con un `500 Internal Server Error`.

### Análisis Técnico
El sistema de etiquetas (`NoteTag`) en el Backend estaba configurado para usar estrictamente `UUID` como clave primaria. Al guardar capturas rápidas, el Frontend enviaba un slug personalizado `custom-inbox` para clasificar automáticamente estas notas en la Bandeja de Entrada. TypeORM/PostgreSQL fallaba al intentar convertir la cadena "custom-inbox" en un formato UUID válido.

### Solución Aplicada
- **Backend (Entidad):** Se modificó `NoteTag` para usar `@PrimaryColumn({ length: 50 })` en lugar de `@PrimaryGeneratedColumn('uuid')`. Esto permite identificadores alfanuméricos personalizados.
- **Backend (Servicio):** Se actualizó `NotesService` para utilizar el método `findBy({ id: In(...) })` reemplazando el obsoleto `findByIds`, mejorando la compatibilidad con versiones recientes de TypeORM.

## 2. Mejora: Procesamiento de Inbox (GTD Workflow)

### Descripción
La sección de Inbox era puramente visual y solo permitía ver o borrar notas. No existía un flujo directo para convertir esas ideas en tareas ejecutables fuera del asistente semanal.

### Cambios Realizados
- **InboxView.tsx:**
    - Se implementó un estado de procesamiento (`processingItem`).
    - Se añadió un modal (`Dialog`) que permite editar el título de la idea y seleccionar un proyecto destino.
    - Se integró la función `handleConvert` que crea una `ProjectActivity` y elimina la nota original del Inbox en una sola acción atómica desde la perspectiva del usuario.
- **UI/UX:**
    - Se añadieron botones claros de "Procesar" en cada tarjeta del Inbox.
    - Se mejoró el estado vacío del Inbox para incentivar la captura rápida.

## 3. Unificación de Vistas de Proyecto

### Resumen
Se consolidó la gestión de actividades y recursos de proyectos para evitar duplicidad entre la vista "Semanal" y "Proyectos".

### Cambios clave:
- Integración de `KanbanBoard` en el modal de detalle de proyectos.
- Implementación de sistema de pestañas (Tabs) para separar "Plan de Acción" de "Recursos".
- Simplificación de `WeeklyView` eliminando el Kanban redundante y centrando la vista en el calendario de eventos.

## Archivos Afectados
- `server/src/notes/entities/note-tag.entity.ts`
- `server/src/notes/notes.service.ts`
- `client/src/components/views/InboxView.tsx`
- `client/src/components/views/ProjectsView.tsx`
- `client/src/components/views/WeeklyView.tsx`
- `client/src/components/weekly/KanbanBoard.tsx`
