# Sprints y Guía de Desarrollo de Ideas

Este documento sirve como registro de las ideas, sprints y tareas pendientes de desarrollo para Life-OS 2026.

---

## 🏃 Sprint 1: Optimización Mobile-First y "Dedo Gordo Friendly"

**Objetivo:** Revisar cada sección del sistema para garantizar que la experiencia en dispositivos móviles sea óptima, cómoda para usar con una mano ("dedo gordo friendly").

### Progreso de Secciones (Checklist)

- [x] **Identidad (Dashboard, Tarjetas, Summary)** 
  - *Hallazgos/Tareas:*
    - **IdentityView.tsx:** El botón de "Volver a roles" (ChevronLeft) tiene un área táctil descentrar pero en mobile podría beneficiarse de un área táctil (`min-h-[44px]`).
    - **RoleCard.tsx:** El botón de upload imagen (el `ImagePlus` dentro de roles) tiene un tamaño de `p-2` lo cual da unos 32x32px. Difícil de atinar sin abrir la tarjeta accidentalmente. Deberíamos ampliar su hit-area a > 40px o moverlo de sitio en mobile.
    - **RoleSummaryView.tsx:** Los checkbox para marcar Actividades / Hábitos en el Modal miden `w-5 h-5` (20x20px). Muy incómodo de apretar sin un padre que capte el click. Requiere aplicar un wrapper o darles un `p-2` `-m-2`.
    - **MobileNav.tsx:** Ya usa la navegación Drawer (BottomSheet), muy aclamada para el enfoque "dedo gordo". Los botones en su interior tienen buen padding (`p-4`). Está excelente.

- [x] **Roadmap** (Semestral, Listas de Objetivos, Gestión de Recursos)
  - *Hallazgos/Tareas:*
    - **SemesterView.tsx:** Ajustados los botones de toggle de las sub-tareas que medían `w-4 h-4` para utilizar el patrón de hit-area de `p-2 -m-2` expandiendo al menos a 36px efectivos y separándolos visualmente de los textos. El botón de borrar meta `X` también amplió su zona ciega con `-m-1`.
    - **ResourceManager.tsx:** Los minicontroles para agregar/quitar recursos (+ y -) están suficientemente espaciados para evitar clicks accidentales aunque sean de `w-6 h-6`. No requerían modificaciones severas.
- [x] **Enfoque** (Piedra del Día, Tracker de Hábitos)
  - *Hallazgos/Tareas:*
    - **DailyView.tsx:** Modificados los botones del carrusel de fechas para tener un touch target ligeramente más ancho (`py-4 px-3 min-w-[70px]`). Los botones de flechas direccionales fueron anclados en `w-10 h-10` y los íconos interiores agrandados a `w-5`. El check de la "Piedra del Día" ya utiliza un `w-12 h-12` muy óptimo.
    - **HabitTracker.tsx:** Las pequeñas casillas de verificación de los hábitos en la tabla semanal eran un problema potencial al tacto midiendo `w-7 h-7`. Se incrementaron a rectangulos `w-10 h-10` con íconos mayores (`w-5 h-5`). Se ajustó además el hitbox del `DropdownMenu` (opción de más opciones de hábito) ampliándolo de 24px a 40px invisibles (`w-10 h-10`).
- [x] **Aprendizajes** (Deviations)
  - *Hallazgos/Tareas:*
    - **DeviationLog.tsx:** Las tarjetas de desvíos contenían los botones de Editar/Eliminar anclados de forma absoluta bajo una clase `group-hover:opacity-100` (invisibles hasta posar el cursor). Múltiples problemas en Mobile al ser texto pequeño de `size="sm"` imposible de aparecer al primer tap. Se modificaron para estar permanentemente visibles con `opacity-60` (subiendo a 100 al tocar), y transformados a `size="icon"` (Pencil y Trash2) forzando un area de `w-[44px] h-[44px]`.
- [x] **Semanal** (Kanban de Proyectos)
  - *Hallazgos/Tareas:*
    - **WeeklyView.tsx:** La navegación entre semanas en el encabezado usaba botones muy pequeños (`w-8 h-8`). Los incrementamos a `h-10 w-10` y estiramos el padding en el de "Esta semana" para facilitar pulsar desde táctil.
    - **KanbanBoard.tsx:** Dentro de las columnas del proyecto, todas las "X" para eliminar actividades o el pequeño "Lápiz" de editar columnas tenían `w-6 h-6`. Extremadamente difíciles de pulsar en pantallas densas sin arrastrar el panel por accidente. Llevados a botones "icon" de tamaño completo `h-10 w-10` e iconos internos mayores `h-5 w-5`.
    - **EventCalendar.tsx:** Al igual que el encabezado semanal, los botones de navegeación tenian limitación táctil. Se reajustaron a `w-10 h-10`. El botón para agregar evento en cada día particular del modo Semana (`+`) tenía `w-6 h-6`. Se ensanchó a `w-8 h-8` permitiendo interactuar sin hacer zoom en el teléfono.
- [x] **Fitness** (NEAT, Workouts, Rutinas)
  - *Hallazgos/Tareas:*
    - **FitnessArea.tsx:** Arreglados los botones de navegación de mes en el historial de fitness. Agrandado a `w-10 h-10` el área táctil de las flechas. El botón para registrar actividad se expandió a `h-10 px-4`.
    - **FitnessRoutineCreator.tsx:** Al crear rutinas (circuitos/sets-reps), los botones para añadir ítems o eliminar ejercicios específicos (`Trash2`, `GripVertical`) requerían de alta precisión. Se adaptó el botón de "Eliminar" e "Añadir Ítem" a `h-10` y se le dio margen visible de manejo (`p-2`) al control de drag.
- [x] **Hoy** (Daily View, Agenda, Pomodoro)
  - *Hallazgos/Tareas:*
    - **PomodoroTimer.tsx:** Se revisaron los controles de gestión del tiempo de Enfoque. Los botones principales tienen unas dimensiones excelentes (`h-20 w-20` para Start/Pause y `h-12 w-12` secundarios). No hubo necesidad de refactorizar componentes aquí porque ya aplican el estándar Mobile First superior a 44px.
- [x] **Notas** (Segundo Cerebro, Whiteboard)
  - *Hallazgos/Tareas:*
    - **NotesSection.tsx:** La navegación de archivos (árbol de carpetas) y lista de apuntes tenía botones de accionado extremadamente pequeños dificultando su uso en Touch. El botón para desplegar sub-carpetas se llevó a un touch target de `32x32px` añadiendo la clase `min-w-[32px] min-h-[32px] p-1 -ml-1`. Los menús contextuales de cada carpeta/apunte (el ícono de 3 puntos `MoreVertical`) subieron de `h-6 w-6` invisible a `h-10 w-10` con opacidad semitransparente táctil todo el tiempo.

---

## Próximos Sprints (Backlog)
*(Añadir aquí ideas futuras que no entran en el sprint actual)*

### 🚀 Sprint 2: Experiencia Offline-First (Nivel 2) & PWA
**Objetivo:** Permitir que la aplicación funcione eficientemente sin conexión o con conexiones inestables mediante el uso de caché local y una cola de mutaciones, integrándola como una PWA instalable en dispositivos móviles.

**Tareas Propuestas (Completadas):**
- [x] **Configuración PWA:** Añadidos configuración de vite-plugin-pwa instalable.
- [x] **Persistencia de Caché (Lectura Offline):** Migramos a `localforage` (IndexedDB) logrando cargas masivas instantáneas independientemente del límite de 5MB del viejo LocalStorage.
- [x] **Cola de Mutaciones (Escritura Offline):** Desarrollado `ActionQueue.ts` que intercepta fallos de `fetchWithAuth` en `api.ts`.
- [x] **UI/UX de Estado de Red:** Integrado `PWABadge.tsx` al `Dashboard` y `MobileNav` que reacciona a eventos online/offline nativos del Browser, con auto-retry local silenciado.

### 🎯 Sprint 3: Gestión Directa (CRUD) en Tarjetas de Rol
**Objetivo:** Permitir al usuario crear, editar y eliminar Hábitos y Objetivos directamente desde la vista de Resumen de cada Rol en la pestaña "Identidad", sin recargar ni cambiar de pestaña.

**Tareas Propuestas (Completadas):**
- [x] **Hábitos In-Site:** Modificados los modales de `RoleSummaryView.tsx` incorporando un botón `+` para añadir Hábitos de forma veloz. Añadido DropdownMenu en cada Hábito con opciones de `Editar` (Inline Input) y `Eliminar` (Trash).
- [x] **Objetivos In-Site:** Añadida similar lógica a los Objetivos (Goals). Se puede añadir título y elegir el Quarter (Q1-Q4) in situ, y modificarlos o destruirlos en el aire logrando consistencia Optimista.

### 🧠 Reestructuración: Segundo Cerebro + Asistente Virtual (Métodos GTD / PARA)

El sistema evolucionará para ser un ente proactivo guiado y medible.

#### 🏗️ Sprint 5: Jerarquía de Datos (Proyectos e Inbox) -> COMPLETADO
**Objetivo:** Revivir y potenciar la estructura core subyacente. Explotar las entidades Backend existentes (`Projects` y `ProjectActivities`) e inyectarlas al Frontend formando el pipeline Objetivo -> Proyecto -> Actividad.
- [x] Mapear las entidades Frontend faltantes para consumir `Projects` desde la API.
- [x] Crear vista/Dashboard exclusivo de Proyectos.
- [x] Refactorizar creación de Objetivos a formato SMART (Wizard).
- [x] Crear tabla conceptual de `Inbox` o adaptar el modelo para volcado rápido de ideas sin categorizar.

#### 📥 Sprint 6: Captura Rápida y Bandeja de Entrada (Inbox) -> COMPLETADO
**Objetivo:** Centralizar el vaciado mental para no perder ideas y liberar carga cognitiva temporal.
- [x] Implementar un botón "FAB" Global (Floating Action Button) o atajo de teclado para "Captura Rápida".
- [x] Crear vista de Entrada/Inbox para acumular ideas, recordatorios y tareas crudas sin fecha.

#### 🧙‍♂️ Sprint 7: Asistente de Planificación Semanal (Weekly Wizard) -> COMPLETADO
**Objetivo:** Reemplazar el Kanban suelto por un flujo guiado paso a paso para organizar la semana.
- [x] UI Paso 1: Vaciar el Inbox (Procesar, Eliminar o Asignar Notas a Proyectos).
- [x] UI Paso 2: Revisión de Métricas (Hábitos y Pomodoros pasados).
- [x] UI Paso 3: Asignar la Semana (Bajar Actividades desde Proyectos al Kanban).
- [x] UI Paso 4: Definición de la "Roca de la Semana".

#### 🎯 Sprint 8: Tablero de Ejecución (Modo Hoy)
**Objetivo:** El bloqueo de distracciones. Vista 100% enfocada al láser del "hacer".
- Reestructurar el `DailyView` para mostrar la "Roca del Día" liderando la pantalla.
- Ocultar planificaciones futuras. Mostrar solo las tareas agendadas al día.
- Integración directa: Clickeando la actividad levanta el Pomodoro vinculado.
- Incorporar mini-checklists de Hábitos rápidos a los laterales.

#### 🗂️ Sprint 9: Segundo Cerebro (Método PARA) -> COMPLETADO
**Objetivo:** Ordenar la sección actual de "Notas" para atarlas a Proyectos, Áreas (Roles) y Recursos.
- [x] Refactorizar las jerarquías de Storage/Notas para acoplarlas a P.A.R.A.
- [x] Crear vista de carpeta automática dentro del visor de Proyecto (todo centralizado).

#### 🛠️ Refactorización: Unificación de Proyectos y Mejora de Inbox -> COMPLETADO
**Objetivo:** Eliminar redundancia visual y potenciar el flujo de captura GTD.
- [x] Unificar Kanban y Gestión de Proyectos en una sola vista centralizada (`ProjectsView`).
- [x] Simplificar `WeeklyView` para evitar duplicidad de funcionalidades.
- [x] Corregir persistencia de etiquetas personalizadas (`custom-inbox`) en el Backend.
- [x] Implementar flujo de procesamiento de ideas directamente desde la vista de Inbox.

#### 📈 Sprint 10: Métricas y Retroalimentación Automática
**Objetivo:** Dashboards de incentivo visual y reporte de tiempos para calibrar prioridades.
- Crear componente de "Progress Bar" dinámico para Objetivos basado en avance de Proyectos.
- Desarrollar "Heatmap" de Hábitos (estilo aportes de GitHub verde).
- "Focus Report": Gráficos de horas Pomodoro agrupadas por Roles.
