# Gestión de Estado - Life-OS 2026

## Arquitectura de Estado

Life-OS utiliza un patrón de estado centralizado basado en React Context + Hooks, similar a Redux pero más simple.

```
┌─────────────────────────────────────────────────────────┐
│                   LifeOSContext                         │
│                   (React Context)                       │
├─────────────────────────────────────────────────────────┤
│                    useLifeOS Hook                       │
│  ┌─────────────┐  ┌─────────────────────────────────┐  │
│  │   State     │  │         Actions                 │  │
│  │ (useState)  │  │ (useCallback + store functions) │  │
│  └─────────────┘  └─────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    lifeOSStore                          │
│              (Funciones puras + localStorage)           │
└─────────────────────────────────────────────────────────┘
```

---

## Archivos Involucrados

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/types/lifeOS.ts` | Definiciones de tipos |
| `src/store/lifeOSStore.ts` | Funciones puras + persistencia |
| `src/hooks/useLifeOS.ts` | Hook con estado y acciones |
| `src/context/LifeOSContext.tsx` | Provider y hook de consumo |

---

## lifeOSStore.ts

### Funciones de Persistencia

```typescript
const STORAGE_KEY = "life-os-2026";

// Cargar estado desde localStorage
export function loadState(): LifeOSState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return { ...initialState, ...JSON.parse(saved) };
  }
  return initialState;
}

// Guardar estado en localStorage
export function saveState(state: LifeOSState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
```

### Funciones de Transformación

Todas las funciones son **puras** y retornan un nuevo estado:

```typescript
// Ejemplo: Agregar un rol
export function addRole(state: LifeOSState, role: Omit<Role, "id">): LifeOSState {
  if (state.roles.length >= 7) {
    console.warn("Maximum 7 roles allowed");
    return state; // No modifica si excede límite
  }
  const newRole: Role = { ...role, id: generateId() };
  return { ...state, roles: [...state.roles, newRole] };
}

// Ejemplo: Actualizar un objetivo
export function updateGoal(
  state: LifeOSState, 
  goalId: string, 
  updates: Partial<Goal>
): LifeOSState {
  return {
    ...state,
    goals: state.goals.map(g => 
      g.id === goalId 
        ? { ...g, ...updates, updatedAt: new Date().toISOString() } 
        : g
    )
  };
}

// Ejemplo: Eliminar con cascada
export function deleteRole(state: LifeOSState, roleId: string): LifeOSState {
  return {
    ...state,
    roles: state.roles.filter(r => r.id !== roleId),
    goals: state.goals.filter(g => g.roleId !== roleId),
    habits: state.habits.filter(h => h.roleId !== roleId)
  };
}
```

### Categorías de Funciones

| Categoría | Funciones |
|-----------|-----------|
| **Year Settings** | `updateYearSettings` |
| **Roles** | `addRole`, `updateRole`, `deleteRole` |
| **Goals** | `addGoal`, `updateGoal`, `deleteGoal` |
| **Resources** | `addResourceToGoal`, `updateResourceInGoal`, `deleteResourceFromGoal` |
| **Habits** | `addHabit`, `updateHabit`, `deleteHabit`, `logHabit` |
| **Deviations** | `addDeviation` |
| **Daily Stone** | `setDailyStone`, `completeDailyStone` |
| **Projects** | `addProject`, `updateProject`, `deleteProject` |
| **Activities** | `addProjectActivity`, `updateProjectActivity`, `deleteProjectActivity`, `reorderActivities` |
| **Fitness** | `addFitnessActivity`, `updateFitnessActivity`, `deleteFitnessActivity` |
| **Calendar** | `addCalendarEvent`, `updateCalendarEvent`, `deleteCalendarEvent` |
| **Folders** | `addNoteFolder`, `updateNoteFolder`, `deleteNoteFolder` |
| **Notes** | `addNote`, `updateNote`, `deleteNote` |
| **Tags** | `addNoteTag`, `deleteNoteTag` |
| **Documents** | `addNoteDocument`, `deleteNoteDocument` |
| **System** | `resetState`, `toggleFocusMode` |

---

## useLifeOS Hook

### Estructura

```typescript
export function useLifeOS() {
  // Estado inicial desde localStorage
  const [state, setState] = useState<LifeOSState>(() => store.loadState());

  // Auto-persistencia en cada cambio
  useEffect(() => {
    store.saveState(state);
  }, [state]);

  // Acciones (todas con useCallback para estabilidad)
  const addRole = useCallback((role: Omit<Role, "id">) => {
    setState(s => store.addRole(s, role));
  }, []);

  // ... más acciones

  // Helpers de consulta
  const getRoleById = useCallback((roleId: string) => {
    return state.roles.find(r => r.id === roleId);
  }, [state.roles]);

  return {
    state,
    // Todas las acciones...
    addRole,
    updateRole,
    // ... 
    // Todos los helpers...
    getRoleById,
    getGoalsByRole,
    // ...
  };
}
```

### Acciones Disponibles

```typescript
// Navegación
setView(view: CurrentView)
setSelectedDate(date: string)
toggleShowPastItems()
toggleFocusMode()

// Wizard
setWizardStep(step: number)
completeWizard()
startEditingWizard()
cancelEditingWizard()

// CRUD completo para cada entidad...
```

### Helpers de Consulta

```typescript
getRoleById(roleId: string): Role | undefined
getGoalsByRole(roleId: string): Goal[]
getGoalsByQuarter(quarter: 1|2|3|4): Goal[]
getHabitLogsForDate(date: string): HabitLog[]
getDailyStone(date: string): DailyStone | undefined
getHabitsByRole(roleId: string): Habit[]
getProjectsByGoal(goalId: string): Project[]
getActivitiesByProject(projectId: string): ProjectActivity[]
getActivitiesForDate(date: string): ProjectActivity[]
```

---

## LifeOSContext

### Provider

```typescript
const LifeOSContext = createContext<LifeOSContextType | null>(null);

export function LifeOSProvider({ children }: { children: ReactNode }) {
  const lifeOS = useLifeOS();
  
  return (
    <LifeOSContext.Provider value={lifeOS}>
      {children}
    </LifeOSContext.Provider>
  );
}
```

### Hook de Consumo

```typescript
export function useLifeOSContext() {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error("useLifeOSContext must be used within LifeOSProvider");
  }
  return context;
}
```

---

## Uso en Componentes

```typescript
import { useLifeOSContext } from "@/context/LifeOSContext";

function MyComponent() {
  const { 
    state, 
    addGoal, 
    updateGoal,
    getRoleById 
  } = useLifeOSContext();

  const handleAddGoal = () => {
    addGoal({
      roleId: "123",
      title: "Mi objetivo",
      quarter: 1,
      semester: 1,
      status: "pending"
    });
  };

  return (
    <div>
      {state.goals.map(goal => (
        <div key={goal.id}>{goal.title}</div>
      ))}
    </div>
  );
}
```

---

## Flujo de Actualización

```
1. Usuario hace clic en "Agregar objetivo"
           │
           ▼
2. Componente llama addGoal({ roleId, title, ... })
           │
           ▼
3. useLifeOS ejecuta setState(s => store.addGoal(s, goal))
           │
           ▼
4. store.addGoal() retorna nuevo estado inmutable
           │
           ▼
5. React actualiza el estado con setState
           │
           ▼
6. useEffect detecta cambio y ejecuta saveState()
           │
           ▼
7. localStorage se actualiza con el nuevo estado
           │
           ▼
8. React re-renderiza componentes que consumen state.goals
```

---

## Preparación para Supabase

Para migrar a Supabase, solo necesitas:

1. **Cambiar loadState/saveState**:
```typescript
export async function loadState(userId: string): Promise<LifeOSState> {
  const { data } = await supabase
    .from('life_os_state')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data || initialState;
}

export async function saveState(userId: string, state: LifeOSState): Promise<void> {
  await supabase
    .from('life_os_state')
    .upsert({ user_id: userId, ...state });
}
```

2. **Hacer el hook async**:
```typescript
const [state, setState] = useState<LifeOSState>(initialState);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadState(userId).then(s => {
    setState(s);
    setLoading(false);
  });
}, [userId]);
```

3. **Debounce el guardado** para evitar writes excesivos
