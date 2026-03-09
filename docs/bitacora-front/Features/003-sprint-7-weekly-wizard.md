# Feature: Asistente Semanal de Planificación (Sprint 7)

**Fecha:** 08 de Marzo de 2026
**Tipo:** Feature / Productividad UI

## Descripción
Creación de un Modal interactivo (`WeeklyWizard.tsx`) que guía al usuario en el hábito fundamental de la revisión semanal propuesto por el sistema GTD (Getting Things Done) y PARA. Consta de 4 pasos continuos que obligan a vaciar la mente para focalizarse en la semana entrante.

## Cambios Realizados
1. **Paso 1 (Inbox):** Interfaz para recorrer elemento por elemento la Bandeja de Entrada (vaciado mental). Permite convertir notas "huérfanas" directamente en `ProjectActivities` hijas de un Proyecto seleccionado.
2. **Paso 2 (Revisión):** Dashboard temporal que lee el log de Hábitos semanales (`habitLogs`) y Sesiones Pomodoro sumando tiempos de foco reales para concientizar al usuario.
3. **Paso 3 (Planificación Kanban):** Lista todas las `ProjectActivities` de los proyectos activos que tienen status "Pendiente". Provee un atajo (Botón "Semana") para cambiarlas optimístamente al status "En progreso", lo que las coloca directamente en el Kanban semanal real.
4. **Paso 4 (La Roca):** Modalidad de enfoque estricto para definir 1 sola meta vital en la semana. Se graba temporalmente usando la entidad `Notes` con un tag especial `weekly-rock`.

## Efectos Colaterales
- Se inyectó en el Dashboard `WeeklyView` el botón de disparo "Planificar Semana", visible solo en modo de Edición.
