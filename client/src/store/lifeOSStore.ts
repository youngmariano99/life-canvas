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
  DailyStone,
  Project,
  ProjectActivity,
  Resource,
  FitnessActivity,
  CalendarEvent,
  NoteFolder,
  Note,
  NoteTag,
  NoteDocument,
  PomodoroSettings,
  ActivePauseRoutine,
  ActivePauseEntry
} from "@/types/lifeOS";

const STORAGE_KEY = "life-os-2026";

/**
 * Load state from localStorage
 */
export function loadState(): LifeOSState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        isLoading: true, // Force loading state on startup
        projects: parsed.projects || [],
        projectActivities: parsed.projectActivities || [],
        fitnessActivities: parsed.fitnessActivities || [],
        activePauseRoutines: parsed.activePauseRoutines || [],
        activePauseHistory: parsed.activePauseHistory || [],
        calendarEvents: parsed.calendarEvents || [],
        noteFolders: parsed.noteFolders || [],
        notes: parsed.notes || [],
        noteTags: parsed.noteTags || [],
        noteDocuments: parsed.noteDocuments || [],
        showPastItems: parsed.showPastItems ?? false,
        isEditingWizard: parsed.isEditingWizard ?? false,
        focusMode: parsed.focusMode ?? false,
      };
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
    goals: state.goals.filter(g => g.roleId !== roleId),
    habits: state.habits.filter(h => h.roleId !== roleId)
  };
}

/**
 * Add a goal
 */
export function addGoal(state: LifeOSState, goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "resources">): LifeOSState {
  const now = new Date().toISOString();
  const newGoal: Goal = {
    ...goal,
    id: generateId(),
    resources: [],
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
    goals: state.goals.filter(g => g.id !== goalId),
    projects: state.projects.filter(p => p.goalId !== goalId)
  };
}

/**
 * Add resource to goal
 */
export function addResourceToGoal(
  state: LifeOSState,
  goalId: string,
  resource: Omit<Resource, "id">
): LifeOSState {
  const newResource: Resource = { ...resource, id: generateId() };
  return {
    ...state,
    goals: state.goals.map(g =>
      g.id === goalId
        ? { ...g, resources: [...(g.resources || []), newResource], updatedAt: new Date().toISOString() }
        : g
    )
  };
}

/**
 * Update resource in goal
 */
export function updateResourceInGoal(
  state: LifeOSState,
  goalId: string,
  resourceId: string,
  updates: Partial<Resource>
): LifeOSState {
  return {
    ...state,
    goals: state.goals.map(g =>
      g.id === goalId
        ? {
          ...g,
          resources: (g.resources || []).map(r =>
            r.id === resourceId ? { ...r, ...updates } : r
          ),
          updatedAt: new Date().toISOString()
        }
        : g
    )
  };
}

/**
 * Delete resource from goal
 */
export function deleteResourceFromGoal(
  state: LifeOSState,
  goalId: string,
  resourceId: string
): LifeOSState {
  return {
    ...state,
    goals: state.goals.map(g =>
      g.id === goalId
        ? {
          ...g,
          resources: (g.resources || []).filter(r => r.id !== resourceId),
          updatedAt: new Date().toISOString()
        }
        : g
    )
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
 * Update a habit
 */
export function updateHabit(
  state: LifeOSState,
  habitId: string,
  updates: Partial<Habit>
): LifeOSState {
  return {
    ...state,
    habits: state.habits.map(h => h.id === habitId ? { ...h, ...updates } : h)
  };
}

/**
 * Delete a habit
 */
export function deleteHabit(state: LifeOSState, habitId: string): LifeOSState {
  return {
    ...state,
    habits: state.habits.filter(h => h.id !== habitId),
    habitLogs: state.habitLogs.filter(l => l.habitId !== habitId)
  };
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

// ==================== PROJECT FUNCTIONS ====================

/**
 * Add a project
 */
export function addProject(
  state: LifeOSState,
  project: Omit<Project, "id" | "createdAt" | "updatedAt" | "statuses">
): LifeOSState {
  const now = new Date().toISOString();
  const newProject: Project = {
    ...project,
    id: generateId(),
    statuses: ["Por hacer", "En progreso", "En revisión", "Completada"],
    createdAt: now,
    updatedAt: now
  };
  return { ...state, projects: [...state.projects, newProject] };
}

/**
 * Update a project
 */
export function updateProject(
  state: LifeOSState,
  projectId: string,
  updates: Partial<Project>
): LifeOSState {
  return {
    ...state,
    projects: state.projects.map(p =>
      p.id === projectId
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    )
  };
}

/**
 * Delete a project
 */
export function deleteProject(state: LifeOSState, projectId: string): LifeOSState {
  return {
    ...state,
    projects: state.projects.filter(p => p.id !== projectId),
    projectActivities: state.projectActivities.filter(a => a.projectId !== projectId)
  };
}

/**
 * Add activity to project
 */
export function addProjectActivity(
  state: LifeOSState,
  activity: Omit<ProjectActivity, "id" | "createdAt" | "order">
): LifeOSState {
  const projectActivities = state.projectActivities.filter(a => a.projectId === activity.projectId);
  const maxOrder = projectActivities.length > 0
    ? Math.max(...projectActivities.map(a => a.order))
    : 0;

  const newActivity: ProjectActivity = {
    ...activity,
    id: generateId(),
    order: maxOrder + 1,
    createdAt: new Date().toISOString()
  };
  return { ...state, projectActivities: [...state.projectActivities, newActivity] };
}

/**
 * Update activity
 */
export function updateProjectActivity(
  state: LifeOSState,
  activityId: string,
  updates: Partial<ProjectActivity>
): LifeOSState {
  return {
    ...state,
    projectActivities: state.projectActivities.map(a =>
      a.id === activityId ? { ...a, ...updates } : a
    )
  };
}

/**
 * Delete activity
 */
export function deleteProjectActivity(state: LifeOSState, activityId: string): LifeOSState {
  return {
    ...state,
    projectActivities: state.projectActivities.filter(a => a.id !== activityId)
  };
}

/**
 * Reorder activities in kanban
 */
export function reorderActivities(
  state: LifeOSState,
  projectId: string,
  activityId: string,
  newStatus: string,
  newOrder: number
): LifeOSState {
  const activities = state.projectActivities.map(a => {
    if (a.id === activityId) {
      return { ...a, status: newStatus, order: newOrder };
    }
    return a;
  });

  return { ...state, projectActivities: activities };
}

// ==================== FITNESS FUNCTIONS ====================

/**
 * Add fitness activity
 */
export function addFitnessActivity(
  state: LifeOSState,
  activity: Omit<FitnessActivity, "id" | "createdAt">
): LifeOSState {
  const newActivity: FitnessActivity = {
    ...activity,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  return { ...state, fitnessActivities: [...state.fitnessActivities, newActivity] };
}

/**
 * Update fitness activity
 */
export function updateFitnessActivity(
  state: LifeOSState,
  activityId: string,
  updates: Partial<FitnessActivity>
): LifeOSState {
  return {
    ...state,
    fitnessActivities: state.fitnessActivities.map(a =>
      a.id === activityId ? { ...a, ...updates } : a
    )
  };
}

/**
 * Delete fitness activity
 */
export function deleteFitnessActivity(state: LifeOSState, activityId: string): LifeOSState {
  return {
    ...state,
    fitnessActivities: state.fitnessActivities.filter(a => a.id !== activityId)
  };
}

// ==================== CALENDAR EVENT FUNCTIONS ====================

/**
 * Add calendar event
 */
export function addCalendarEvent(
  state: LifeOSState,
  event: Omit<CalendarEvent, "id" | "createdAt">
): LifeOSState {
  const newEvent: CalendarEvent = {
    ...event,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  return { ...state, calendarEvents: [...state.calendarEvents, newEvent] };
}

/**
 * Update calendar event
 */
export function updateCalendarEvent(
  state: LifeOSState,
  eventId: string,
  updates: Partial<CalendarEvent>
): LifeOSState {
  return {
    ...state,
    calendarEvents: state.calendarEvents.map(e =>
      e.id === eventId ? { ...e, ...updates } : e
    )
  };
}

/**
 * Delete calendar event
 */
export function deleteCalendarEvent(state: LifeOSState, eventId: string): LifeOSState {
  return {
    ...state,
    calendarEvents: state.calendarEvents.filter(e => e.id !== eventId)
  };
}

// ==================== FOCUS MODE ====================

/**
 * Toggle focus mode
 */
export function toggleFocusMode(state: LifeOSState): LifeOSState {
  return { ...state, focusMode: !state.focusMode };
}

/**
 * Reset all data (for testing/restart)
 */
export function resetState(): LifeOSState {
  localStorage.removeItem(STORAGE_KEY);
  return initialState;
}

// ==================== NOTES FUNCTIONS ====================

export function addNoteFolder(
  state: LifeOSState,
  folder: Omit<NoteFolder, "id" | "createdAt" | "updatedAt">
): LifeOSState {
  const now = new Date().toISOString();
  const newFolder: NoteFolder = {
    ...folder,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  };
  return { ...state, noteFolders: [...state.noteFolders, newFolder] };
}

export function updateNoteFolder(
  state: LifeOSState,
  folderId: string,
  updates: Partial<NoteFolder>
): LifeOSState {
  return {
    ...state,
    noteFolders: state.noteFolders.map(f =>
      f.id === folderId ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
    )
  };
}

export function deleteNoteFolder(state: LifeOSState, folderId: string): LifeOSState {
  return {
    ...state,
    noteFolders: state.noteFolders.filter(f => f.id !== folderId),
    notes: state.notes.filter(n => n.folderId !== folderId)
  };
}

export function addNote(
  state: LifeOSState,
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): LifeOSState {
  const now = new Date().toISOString();
  const newNote: Note = {
    ...note,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  };
  return { ...state, notes: [...state.notes, newNote] };
}

export function updateNote(
  state: LifeOSState,
  noteId: string,
  updates: Partial<Note>
): LifeOSState {
  return {
    ...state,
    notes: state.notes.map(n =>
      n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    )
  };
}

export function deleteNote(state: LifeOSState, noteId: string): LifeOSState {
  return {
    ...state,
    notes: state.notes.filter(n => n.id !== noteId),
    noteDocuments: state.noteDocuments.filter(d => d.noteId !== noteId)
  };
}

export function addNoteTag(
  state: LifeOSState,
  tag: Omit<NoteTag, "id">
): LifeOSState {
  const newTag: NoteTag = { ...tag, id: generateId() };
  return { ...state, noteTags: [...state.noteTags, newTag] };
}

export function deleteNoteTag(state: LifeOSState, tagId: string): LifeOSState {
  return { ...state, noteTags: state.noteTags.filter(t => t.id !== tagId) };
}

export function addNoteDocument(
  state: LifeOSState,
  doc: Omit<NoteDocument, "id" | "createdAt">
): LifeOSState {
  const newDoc: NoteDocument = {
    ...doc,
    id: generateId(),
    createdAt: new Date().toISOString()
  };
  return { ...state, noteDocuments: [...state.noteDocuments, newDoc] };
}

export function deleteNoteDocument(state: LifeOSState, docId: string): LifeOSState {
  return { ...state, noteDocuments: state.noteDocuments.filter(d => d.id !== docId) };
}

// ==================== POMODORO FUNCTIONS ====================

export function updatePomodoroSettings(
  state: LifeOSState,
  settings: Partial<PomodoroSettings>
): LifeOSState {
  return {
    ...state,
    pomodoroSettings: { ...state.pomodoroSettings, ...settings }
  };
}

// ==================== ACTIVE PAUSE FUNCTIONS ====================

export function addActivePauseRoutine(
  state: LifeOSState,
  routine: Omit<ActivePauseRoutine, "id">
): LifeOSState {
  const newRoutine: ActivePauseRoutine = {
    ...routine,
    id: generateId()
  };
  return { ...state, activePauseRoutines: [...state.activePauseRoutines, newRoutine] };
}

export function updateActivePauseRoutine(
  state: LifeOSState,
  id: string,
  updates: Partial<ActivePauseRoutine>
): LifeOSState {
  return {
    ...state,
    activePauseRoutines: state.activePauseRoutines.map(r =>
      r.id === id ? { ...r, ...updates } : r
    )
  };
}

export function deleteActivePauseRoutine(
  state: LifeOSState,
  id: string
): LifeOSState {
  return {
    ...state,
    activePauseRoutines: state.activePauseRoutines.filter(r => r.id !== id)
  };
}

export function logActivePause(
  state: LifeOSState,
  entry: Omit<ActivePauseEntry, "id">
): LifeOSState {
  const newEntry: ActivePauseEntry = {
    ...entry,
    id: generateId()
  };
  return { ...state, activePauseHistory: [...state.activePauseHistory, newEntry] };
}
