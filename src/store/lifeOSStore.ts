/**
 * Life-OS Store - LocalStorage persistence layer
 * Manages all app state with automatic persistence
 */

import { 
  LifeOSState, 
  initialState, 
  YearSettings, 
  Role, 
  Goal, 
  Habit, 
  HabitLog, 
  Deviation, 
  DailyStone 
} from "@/types/lifeOS";

const STORAGE_KEY = "life-os-2026";

/**
 * Load state from localStorage
 */
export function loadState(): LifeOSState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...initialState, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error("Failed to load Life-OS state:", error);
  }
  return initialState;
}

/**
 * Save state to localStorage
 */
export function saveState(state: LifeOSState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save Life-OS state:", error);
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Update year settings
 */
export function updateYearSettings(
  state: LifeOSState, 
  settings: Partial<YearSettings>
): LifeOSState {
  const now = new Date().toISOString();
  const yearSettings: YearSettings = state.yearSettings 
    ? { ...state.yearSettings, ...settings, updatedAt: now }
    : {
        year: 2026,
        vision5Years: "",
        mission: "",
        h1Priority: "",
        h2Priority: "",
        createdAt: now,
        updatedAt: now,
        ...settings
      };
  
  return { ...state, yearSettings };
}

/**
 * Add a new role
 */
export function addRole(state: LifeOSState, role: Omit<Role, "id">): LifeOSState {
  if (state.roles.length >= 7) {
    console.warn("Maximum 7 roles allowed");
    return state;
  }
  const newRole: Role = { ...role, id: generateId() };
  return { ...state, roles: [...state.roles, newRole] };
}

/**
 * Update a role
 */
export function updateRole(
  state: LifeOSState, 
  roleId: string, 
  updates: Partial<Role>
): LifeOSState {
  return {
    ...state,
    roles: state.roles.map(r => r.id === roleId ? { ...r, ...updates } : r)
  };
}

/**
 * Delete a role
 */
export function deleteRole(state: LifeOSState, roleId: string): LifeOSState {
  return {
    ...state,
    roles: state.roles.filter(r => r.id !== roleId),
    goals: state.goals.filter(g => g.roleId !== roleId)
  };
}

/**
 * Add a goal
 */
export function addGoal(state: LifeOSState, goal: Omit<Goal, "id" | "createdAt" | "updatedAt">): LifeOSState {
  const now = new Date().toISOString();
  const newGoal: Goal = { 
    ...goal, 
    id: generateId(), 
    createdAt: now, 
    updatedAt: now 
  };
  return { ...state, goals: [...state.goals, newGoal] };
}

/**
 * Update a goal
 */
export function updateGoal(
  state: LifeOSState, 
  goalId: string, 
  updates: Partial<Goal>
): LifeOSState {
  const now = new Date().toISOString();
  return {
    ...state,
    goals: state.goals.map(g => 
      g.id === goalId ? { ...g, ...updates, updatedAt: now } : g
    )
  };
}

/**
 * Delete a goal
 */
export function deleteGoal(state: LifeOSState, goalId: string): LifeOSState {
  return {
    ...state,
    goals: state.goals.filter(g => g.id !== goalId)
  };
}

/**
 * Add a habit
 */
export function addHabit(state: LifeOSState, habit: Omit<Habit, "id">): LifeOSState {
  const newHabit: Habit = { ...habit, id: generateId() };
  return { ...state, habits: [...state.habits, newHabit] };
}

/**
 * Log habit completion
 */
export function logHabit(
  state: LifeOSState, 
  habitId: string, 
  date: string, 
  status: HabitLog["status"],
  note?: string
): LifeOSState {
  // Check if log exists for this habit+date
  const existingIndex = state.habitLogs.findIndex(
    l => l.habitId === habitId && l.date === date
  );
  
  if (existingIndex >= 0) {
    const logs = [...state.habitLogs];
    logs[existingIndex] = { ...logs[existingIndex], status, note };
    return { ...state, habitLogs: logs };
  }
  
  const newLog: HabitLog = {
    id: generateId(),
    habitId,
    date,
    status,
    note
  };
  return { ...state, habitLogs: [...state.habitLogs, newLog] };
}

/**
 * Add a deviation (learning point)
 */
export function addDeviation(
  state: LifeOSState, 
  deviation: Omit<Deviation, "id" | "createdAt">
): LifeOSState {
  const newDeviation: Deviation = {
    ...deviation,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  return { ...state, deviations: [...state.deviations, newDeviation] };
}

/**
 * Set daily stone
 */
export function setDailyStone(
  state: LifeOSState, 
  date: string, 
  title: string, 
  roleId?: string
): LifeOSState {
  const existing = state.dailyStones.find(s => s.date === date);
  
  if (existing) {
    return {
      ...state,
      dailyStones: state.dailyStones.map(s => 
        s.date === date ? { ...s, title, roleId } : s
      )
    };
  }
  
  const newStone: DailyStone = {
    id: generateId(),
    date,
    title,
    roleId,
    completed: false
  };
  return { ...state, dailyStones: [...state.dailyStones, newStone] };
}

/**
 * Complete daily stone
 */
export function completeDailyStone(
  state: LifeOSState, 
  date: string, 
  completed: boolean
): LifeOSState {
  return {
    ...state,
    dailyStones: state.dailyStones.map(s => 
      s.date === date ? { ...s, completed } : s
    )
  };
}

/**
 * Reset all data (for testing/restart)
 */
export function resetState(): LifeOSState {
  localStorage.removeItem(STORAGE_KEY);
  return initialState;
}
