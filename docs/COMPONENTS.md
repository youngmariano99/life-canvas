# Componentes - Life-OS 2026

## Jerarquía de Componentes

```
App
└── LifeOSProvider
    └── Index
        ├── YearWizard (si !isConfigured || isEditingWizard)
        │   ├── WizardProgress
        │   ├── WizardStep1Vision
        │   ├── WizardStep2Mission
        │   ├── WizardStep3Roles
        │   ├── WizardStep4Goals
        │   └── WizardStep5Habits
        │
        └── Dashboard (si isConfigured && !isEditingWizard)
            ├── Header
            │   ├── Logo
            │   ├── Navigation (desktop)
            │   ├── ThemeToggle
            │   └── Actions (settings, reset)
            │
            └── Views (según currentView)
                ├── IdentityView
                │   └── RoleSummaryView
                │       └── RoleCard
                │
                ├── SemesterView
                │   ├── GoalCard
                │   └── ResourceManager
                │
                ├── WeeklyView
                │   ├── ProjectSelector
                │   └── KanbanBoard
                │       └── ActivityCard
                │
                ├── DailyView
                │   ├── DailyStoneCard
                │   ├── HabitTracker
                │   └── EventCalendar
                │
                ├── FitnessArea
                │   ├── NEATTracker
                │   └── WorkoutLog
                │
                ├── NotesSection
                │   ├── FolderTree
                │   ├── NotesList
                │   ├── NoteEditor (TipTap)
                │   ├── Whiteboard (Excalidraw)
                │   └── DocumentManager
                │
                └── DeviationLog
```

---

## Componentes de Layout

### Dashboard (`src/components/layout/Dashboard.tsx`)

Layout principal de la aplicación.

**Props**: Ninguna (usa contexto)

**Estado local**:
- `currentView`: Vista activa
- `mobileMenuOpen`: Estado del menú móvil

**Responsabilidades**:
- Renderizar header con navegación
- Cambiar entre vistas
- Proporcionar acciones globales (tema, reset, editar wizard)

---

## Componentes de Vistas

### IdentityView (`src/components/views/IdentityView.tsx`)

Muestra la visión a 5 años, misión y roles del usuario.

**Contenido**:
- Tarjeta de Visión con imágenes
- Tarjeta de Misión
- Grid de roles con RoleSummaryView

### SemesterView (`src/components/views/SemesterView.tsx`)

Roadmap de objetivos organizado por trimestres.

**Funcionalidades**:
- Selector de semestre (H1/H2)
- Vista por trimestres o por roles
- Gestión de recursos por objetivo
- Estados de progreso de objetivos

### WeeklyView (`src/components/views/WeeklyView.tsx`)

Vista de proyectos con tablero Kanban.

**Componentes internos**:
- Selector de proyecto
- KanbanBoard con drag & drop (simplificado)
- Creación de actividades

### DailyView (`src/components/views/DailyView.tsx`)

Vista de ejecución diaria.

**Componentes**:
- Selector de fecha
- Piedra del día (DailyStone)
- HabitTracker con grid semanal
- EventCalendar con eventos del día

---

## Componentes de Features

### HabitTracker (`src/components/habits/HabitTracker.tsx`)

Grid de seguimiento de hábitos semanal.

**Props**:
```typescript
interface HabitTrackerProps {
  selectedDate: string;
}
```

**Funcionalidades**:
- Mostrar semana actual
- Agrupar hábitos por rol
- Toggle de estado (completado, fallido, día libre)
- Crear nuevos hábitos

### NotesSection (`src/components/notes/NotesSection.tsx`)

Sistema completo de notas.

**Componentes internos**:
- Árbol de carpetas
- Lista de notas con filtros
- NoteEditor para notas de texto
- Whiteboard para pizarras
- DocumentManager para archivos

### NoteEditor (`src/components/notes/NoteEditor.tsx`)

Editor de texto enriquecido basado en TipTap.

**Props**:
```typescript
interface NoteEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  onClose: () => void;
}
```

**Extensiones TipTap**:
- StarterKit (básicos)
- Placeholder
- TaskList / TaskItem (checkboxes)
- Typography (atajos tipográficos)

**Atajos de teclado**:
| Atajo | Acción |
|-------|--------|
| `# ` | Título H1 |
| `## ` | Título H2 |
| `### ` | Título H3 |
| `- ` o `* ` | Lista |
| `1. ` | Lista numerada |
| `[] ` o `[ ] ` | Checkbox |
| `> ` | Cita |
| `---` | Línea horizontal |

### Whiteboard (`src/components/notes/Whiteboard.tsx`)

Pizarra interactiva con Excalidraw.

**Props**:
```typescript
interface WhiteboardProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  onClose: () => void;
}
```

**Funcionalidades**:
- Dibujo libre
- Formas geométricas
- Texto
- Exportar a PNG
- Guardado automático con debounce

### EventCalendar (`src/components/calendar/EventCalendar.tsx`)

Calendario con eventos.

**Funcionalidades**:
- Selector de fecha
- Crear eventos con tags
- Tags predefinidos (cumpleaños, examen, etc.)
- Tags personalizados con color

### DeviationLog (`src/components/deviations/DeviationLog.tsx`)

Registro de aprendizajes y desvíos.

**Campos**:
- Qué pasó
- Acción de ajuste
- Lección aprendida (opcional)

---

## Componentes del Wizard

### YearWizard (`src/components/wizard/YearWizard.tsx`)

Wizard de configuración inicial.

**Pasos**:
1. **Vision**: Definir visión a 5 años + imágenes
2. **Mission**: Misión del año + prioridades semestrales
3. **Roles**: Crear hasta 7 roles de vida
4. **Goals**: Definir objetivos por rol y trimestre
5. **Habits**: Crear hábitos asociados a roles

### WizardProgress (`src/components/wizard/WizardProgress.tsx`)

Indicador de progreso del wizard.

**Props**:
```typescript
interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}
```

---

## Componentes UI (shadcn/ui)

Componentes base en `src/components/ui/`:

| Componente | Uso |
|------------|-----|
| `Button` | Botones con variantes |
| `Card` | Contenedores con sombra |
| `Dialog` | Modales |
| `Input` | Campos de texto |
| `Select` | Dropdowns |
| `Tabs` | Pestañas |
| `Tooltip` | Tooltips |
| `Badge` | Etiquetas |
| `Calendar` | Selector de fecha |
| `Progress` | Barras de progreso |
| `ScrollArea` | Áreas con scroll |
| `AlertDialog` | Confirmaciones |

---

## Componentes Utilitarios

### ThemeToggle (`src/components/ThemeToggle.tsx`)

Toggle para modo claro/oscuro.

**Hook utilizado**: `useTheme`

**Funcionamiento**:
- Detecta preferencia del sistema
- Persiste en localStorage
- Aplica clase `dark` al `<html>`

### NavLink (`src/components/NavLink.tsx`)

Link de navegación con estilos activos (si existe routing).
