# Arquitectura de Life-OS 2026

## Visión General de la Arquitectura

Life-OS sigue una arquitectura basada en componentes con gestión de estado centralizada y persistencia en localStorage.

---

## Diagrama de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE PRESENTACIÓN                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Componentes React                    ││
│  │  Views | Layout | UI Components | Wizard | Features    ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                     CAPA DE ESTADO                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ LifeOSContext ──► useLifeOS Hook ──► lifeOSStore       ││
│  │    (Provider)      (State + Actions)   (Pure Functions) ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│                     CAPA DE PERSISTENCIA                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              localStorage (life-os-2026)                ││
│  │         (Preparado para migrar a Supabase)              ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Componentes Principales

### 1. Entry Point (`App.tsx`)

```tsx
function App() {
  return (
    <LifeOSProvider>
      <Toaster />
      <Index />
    </LifeOSProvider>
  );
}
```

- Envuelve la app en `LifeOSProvider`
- Proporciona el sistema de notificaciones (Toaster)

### 2. Página Principal (`Index.tsx`)

Controla qué mostrar basándose en el estado:

```tsx
// Si no está configurado → Wizard
// Si está editando → Wizard (modo edición)
// Si está configurado → Dashboard
```

### 3. Dashboard (`Dashboard.tsx`)

Layout principal con:
- **Header**: Logo, navegación desktop, acciones (tema, reset, settings)
- **Navegación móvil**: Menú hamburguesa con grid de opciones
- **Área de contenido**: Renderiza la vista actual según `currentView`

#### Vistas Disponibles:

| ID | Componente | Descripción |
|----|------------|-------------|
| `identity` | `IdentityView` | Visión a 5 años, misión, roles |
| `semester` | `SemesterView` | Roadmap de objetivos por trimestre |
| `weekly` | `WeeklyView` | Kanban de proyectos y actividades |
| `daily` | `DailyView` | Ejecución diaria, hábitos, piedra del día |
| `fitness` | `FitnessArea` | Tracking de actividad física |
| `notes` | `NotesSection` | Sistema de notas y pizarras |
| `deviations` | `DeviationLog` | Registro de aprendizajes |

---

## Flujo de Datos

```
Usuario interactúa con UI
         │
         ▼
Componente llama acción del contexto
(ej: addGoal, updateHabit)
         │
         ▼
useLifeOS ejecuta función del store
(ej: store.addGoal(state, goal))
         │
         ▼
Store retorna nuevo estado inmutable
         │
         ▼
useState actualiza el estado
         │
         ▼
useEffect persiste en localStorage
         │
         ▼
React re-renderiza componentes afectados
```

---

## Patrones Utilizados

### 1. Context + Hook Pattern

```tsx
// Context solo para distribución
const LifeOSContext = createContext<LifeOSContextType | null>(null);

// Hook con toda la lógica
export function useLifeOS() {
  const [state, setState] = useState(() => store.loadState());
  // ... acciones
  return { state, ...actions };
}

// Provider limpio
export function LifeOSProvider({ children }) {
  const lifeOS = useLifeOS();
  return (
    <LifeOSContext.Provider value={lifeOS}>
      {children}
    </LifeOSContext.Provider>
  );
}
```

### 2. Immutable State Updates

Todas las funciones del store son puras y retornan un nuevo objeto:

```tsx
export function addGoal(state: LifeOSState, goal: ...): LifeOSState {
  return { 
    ...state, 
    goals: [...state.goals, newGoal] 
  };
}
```

### 3. Componentes Controlados

Los formularios usan estado local que se sincroniza con el contexto:

```tsx
const [title, setTitle] = useState(goal.title);

const handleSave = () => {
  updateGoal(goal.id, { title });
};
```

### 4. Lazy Loading de Componentes Pesados

Excalidraw se carga de forma diferida dentro de `Whiteboard.tsx`:

```tsx
const [initialData, setInitialData] = useState<ExcalidrawInitialData | null>(null);

// Solo renderiza cuando tiene datos
if (!initialData) return <LoadingState />;
```

---

## Consideraciones de Rendimiento

1. **useCallback para acciones**: Evita recrear funciones en cada render
2. **Memoización selectiva**: Componentes pesados usan React.memo
3. **Debouncing**: Guardado de notas y pizarras con debounce de 500ms
4. **Carga diferida**: Excalidraw se renderiza solo cuando es necesario

---

## Preparación para Backend (Supabase)

El código está diseñado para una migración sencilla:

1. **Schema SQL listo**: `docs/schema.sql` con todas las tablas
2. **Store desacoplado**: Solo cambiar `loadState`/`saveState` por llamadas a Supabase
3. **IDs compatibles**: Generados con timestamp + random, fácil migrar a UUIDs
4. **Tipos centralizados**: `lifeOS.ts` sirve como source of truth

### Pasos para Migrar

1. Habilitar Lovable Cloud
2. Ejecutar migraciones de `schema.sql`
3. Reemplazar localStorage por Supabase client
4. Añadir autenticación
5. Configurar RLS policies
