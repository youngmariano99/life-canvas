# Modelos de Datos - Life-OS 2026

## Ubicación

Todos los tipos están definidos en: `src/types/lifeOS.ts`

---

## Tipos Principales

### YearSettings (Configuración Anual)

```typescript
interface YearSettings {
  year: number;                // Año de planificación (2026)
  vision5Years: string;        // Visión a 5 años
  visionImages?: string[];     // URLs de imágenes de visión
  mission: string;             // Misión del año
  h1Priority: string;          // Prioridad primer semestre
  h2Priority: string;          // Prioridad segundo semestre
  createdAt: string;           // ISO timestamp
  updatedAt: string;           // ISO timestamp
}
```

### Role (Rol de Vida)

```typescript
type RoleColor = 
  | "student" 
  | "athlete" 
  | "entrepreneur" 
  | "creative" 
  | "family" 
  | "spiritual" 
  | "social";

interface Role {
  id: string;
  name: string;               // Ej: "Estudiante", "Atleta"
  icon: string;               // Nombre del ícono de Lucide
  color: RoleColor;           // Color semántico
  description?: string;       // Descripción opcional
  imageUrl?: string;          // Imagen del rol
}
```

**Restricción**: Máximo 7 roles por metodología Superhábitos.

### Goal (Objetivo Anual)

```typescript
interface Goal {
  id: string;
  roleId: string;             // FK a Role
  title: string;
  description?: string;
  quarter: 1 | 2 | 3 | 4;     // Trimestre objetivo
  semester: 1 | 2;            // Semestre
  targetDate?: string;        // Fecha límite opcional
  status: "pending" | "in_progress" | "completed" | "deferred";
  resources: Resource[];       // Recursos necesarios
  createdAt: string;
  updatedAt: string;
}

interface Resource {
  id: string;
  name: string;               // Ej: "Dinero", "Tiempo"
  quantityHave: number;       // Cantidad actual
  quantityNeeded: number;     // Cantidad necesaria
  unit?: string;              // Ej: "USD", "horas"
}
```

### Project (Proyecto)

```typescript
interface Project {
  id: string;
  goalId: string;             // FK a Goal
  name: string;
  description?: string;
  dueDate?: string;
  statuses: string[];         // Columnas del Kanban
  createdAt: string;
  updatedAt: string;
}

interface ProjectActivity {
  id: string;
  projectId: string;          // FK a Project
  title: string;
  status: string;             // Columna actual
  order: number;              // Orden en la columna
  dueDate?: string;
  roleId?: string;
  createdAt: string;
}
```

**Statuses por defecto**: `["Por hacer", "En progreso", "En revisión", "Completada"]`

### Habit (Hábito)

```typescript
interface Habit {
  id: string;
  name: string;
  roleId?: string;            // FK opcional a Role
  frequency: "daily" | "weekdays" | "weekends" | "custom";
  customDays?: number[];      // 0=Domingo, 6=Sábado
}

interface HabitLog {
  id: string;
  habitId: string;
  date: string;               // YYYY-MM-DD
  status: "completed" | "missed" | "day_off" | "other";
  note?: string;
}
```

### DailyStone (Piedra del Día)

```typescript
interface DailyStone {
  id: string;
  date: string;               // YYYY-MM-DD
  title: string;              // Objetivo principal del día
  roleId?: string;
  completed: boolean;
  note?: string;
}
```

### Deviation (Aprendizaje/Desvío)

```typescript
interface Deviation {
  id: string;
  goalId?: string;
  habitId?: string;
  date: string;
  whatHappened: string;       // Qué pasó
  adjustmentAction: string;   // Acción correctiva
  lesson?: string;            // Lección aprendida
  createdAt: string;
}
```

### FitnessActivity (Actividad Física)

```typescript
type FitnessActivityType = "neat" | "workout";

interface FitnessActivity {
  id: string;
  type: FitnessActivityType;  // NEAT o Entrenamiento
  name: string;
  duration?: number;          // Minutos
  notes?: string;
  date: string;
  createdAt: string;
}
```

### CalendarEvent (Evento de Calendario)

```typescript
type CalendarEventTag = 
  | "birthday" 
  | "reminder" 
  | "appointment" 
  | "exam" 
  | "deadline" 
  | "personal"
  | "custom";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  endDate?: string;
  tag: CalendarEventTag;
  customTagLabel?: string;
  customColor?: string;
  description?: string;
  createdAt: string;
}
```

---

## Sistema de Notas

### NoteFolder (Carpeta)

```typescript
interface NoteFolder {
  id: string;
  name: string;
  parentId: string | null;    // Permite carpetas anidadas
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Note (Nota)

```typescript
type NoteType = "note" | "whiteboard" | "document";

interface Note {
  id: string;
  folderId: string;           // FK a NoteFolder
  type: NoteType;
  title: string;
  content: string;            // HTML (notas) o JSON (pizarras)
  tags: string[];             // Array de tag IDs
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### NoteTag (Etiqueta)

```typescript
interface NoteTag {
  id: string;
  name: string;
  color: string;              // Color hex
  type: "role" | "goal" | "project" | "custom";
  referenceId?: string;       // FK al elemento vinculado
}
```

### NoteDocument (Documento Adjunto)

```typescript
interface NoteDocument {
  id: string;
  noteId: string;
  fileName: string;
  fileType: string;           // MIME type
  fileSize: number;           // Bytes
  dataUrl: string;            // Base64 o URL
  createdAt: string;
}
```

---

## Estado Global (LifeOSState)

```typescript
interface LifeOSState {
  // Configuración
  isConfigured: boolean;
  wizardStep: number;
  isEditingWizard: boolean;
  
  // Datos principales
  yearSettings: YearSettings | null;
  roles: Role[];
  goals: Goal[];
  habits: Habit[];
  habitLogs: HabitLog[];
  deviations: Deviation[];
  dailyStones: DailyStone[];
  projects: Project[];
  projectActivities: ProjectActivity[];
  fitnessActivities: FitnessActivity[];
  calendarEvents: CalendarEvent[];
  
  // Sistema de notas
  noteFolders: NoteFolder[];
  notes: Note[];
  noteTags: NoteTag[];
  noteDocuments: NoteDocument[];
  
  // UI State
  currentView: "identity" | "semester" | "daily" | "weekly" | "fitness" | "notes";
  selectedDate: string;
  showPastItems: boolean;
  focusMode: boolean;
}
```

---

## Colores de Roles (Constantes)

```typescript
const ROLE_COLORS: Record<RoleColor, { bg: string; text: string; border: string }> = {
  student: { bg: "bg-role-student", text: "text-role-student", border: "border-role-student" },
  athlete: { bg: "bg-role-athlete", text: "text-role-athlete", border: "border-role-athlete" },
  entrepreneur: { bg: "bg-role-entrepreneur", text: "text-role-entrepreneur", border: "border-role-entrepreneur" },
  creative: { bg: "bg-role-creative", text: "text-role-creative", border: "border-role-creative" },
  family: { bg: "bg-role-family", text: "text-role-family", border: "border-role-family" },
  spiritual: { bg: "bg-role-spiritual", text: "text-role-spiritual", border: "border-role-spiritual" },
  social: { bg: "bg-role-social", text: "text-role-social", border: "border-role-social" },
};
```

---

## Colores de Eventos (Constantes)

```typescript
const EVENT_TAG_COLORS: Record<CalendarEventTag, { bg: string; text: string }> = {
  birthday: { bg: "bg-pink-500", text: "text-pink-500" },
  reminder: { bg: "bg-amber-500", text: "text-amber-500" },
  appointment: { bg: "bg-blue-500", text: "text-blue-500" },
  exam: { bg: "bg-red-500", text: "text-red-500" },
  deadline: { bg: "bg-orange-500", text: "text-orange-500" },
  personal: { bg: "bg-purple-500", text: "text-purple-500" },
  custom: { bg: "bg-gray-500", text: "text-gray-500" },
};
```
