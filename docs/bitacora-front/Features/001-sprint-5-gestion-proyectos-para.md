# Feature: Dashboard de Proyectos y Jerarquía PARA (Sprint 5)

**Fecha:** 08 de Marzo de 2026
**Tipo:** Feature / Arquitectura Frontend

## Descripción
Creación de la vista principal "Proyectos" dentro del sistema, implementando la filosofía del "Segundo Cerebro" guiada por el método PARA y SMART. Los Objetivos (Goals) ahora son padres directos de los Proyectos. Y los Proyectos son la "carpeta" de las Actividades (ProjectActivities).

## Cambios Realizados
1. **Componente `ProjectsView.tsx`:** Dashboard interactivo listando proyectos activos. Agrupa Proyectos basándose en `state.projects`, mapea hacia `state.goals` para traer el padre, y calcula el porcentaje de progreso (`progress`) contando las `state.projectActivities` subyacentes.
2. **Formulario SMART en `SemesterView.tsx`:** Se añadió un `Wizard` para obligar al usuario a redactar la "Definición SMART" (campo descripcion) a la hora de crear objetivos. También se añadieron tags informativos contando cuántos Proyectos están "atados" al objetivo desde el propio roadmap.
3. **Dashboard Principal:** Añadido `Proyectos` al Routing core interactuable desde el menú de iconos principal izquierdo de los modulos.

## Efectos en el Sistema
* Reúso limpio de BBDD: Se conectó sin escribir una sola Entidad extra (Entity backend), valiéndose de lo establecido para lograr algo nuevo y robusto. No hubo breaking changes.
