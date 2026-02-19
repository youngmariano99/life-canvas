/**
 * Custom hook for Life-OS state management
 * Provides reactive state with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import { LifeOSState, Role, Goal, Habit, HabitLog, Deviation, YearSettings, Project, ProjectActivity, Resource, FitnessActivity, FitnessRoutine, CalendarEvent, NoteFolder, Note, NoteTag, NoteDocument, PomodoroSession, PomodoroSettings, ActivePauseRoutine, ActivePauseEntry } from "@/types/lifeOS";
import * as store from "@/store/lifeOSStore";

import { api } from "@/lib/api";

export function useLifeOS() {
  const [state, setState] = useState<LifeOSState>(() => store.loadState());

  // Initial Load from API
  useEffect(() => {
    async function loadData() {
      try {
        const year = state.selectedYear;
        const [roles, goals, habits, habitLogs, projects, projectActivities, dailyStones, fitnessActivities, deviations, noteFolders, notes, calendarEvents, fitnessRoutines, pomodoroSessions, yearSettings] = await Promise.all([
          api.roles.getAll(),
          api.goals.getAll(year),
          api.habits.getAll(year),
          api.habitLogs.getAll(),
          api.projects.getAll(year),
          api.projectActivities.getAll(),
          api.dailyStones.getAll(year),
          api.fitness.getAll(),
          api.deviations.getAll(year),
          api.noteFolders.getAll(),
          api.notes.getAll(),
          api.calendar.getAll(),
          api.fitness.getAllRoutines(),
          api.pomodoro.getAll(),
          api.years.getSettings(year),
        ]);

        // Fetch Resources separately
        const resources = await api.resources.getAll(year);
        const goalsWithResources = goals.map(g => ({
          ...g,
          resources: resources.filter(r => r.goalId === g.id)
        }));

        setState(s => ({
          ...s,
          roles,
          goals: goalsWithResources,
          habits,
          habitLogs,
          projects,
          projectActivities,
          dailyStones,
          fitnessActivities,
          deviations,
          noteFolders,
          notes,
          calendarEvents,
          fitnessRoutines,
          pomodoroSessions,
          yearSettings,
          // If year settings exist OR if user has significant data (goals or roles), consider configured.
          // This handles migration for existing users who haven't set up YearSettings yet.
          isConfigured: !!yearSettings || (roles.length > 0 || goals.length > 0) || s.isConfigured,
          // If configured, ensure not in wizard mode unless explicitly editing
          wizardStep: (!!yearSettings || (roles.length > 0 || goals.length > 0)) && !s.isEditingWizard ? 0 : s.wizardStep,
          isLoading: false
        }));
      } catch (error) {
        console.error("Failed to load data from API", error);
        setState(s => ({ ...s, isLoading: false }));
      }
    }
    loadData();
  }, [state.selectedYear]);

  // Persist to localStorage on every state change (Keeping this as backup for now, but usually we would remove it for connected parts)
  useEffect(() => {
    store.saveState(state);
  }, [state]);

  // Navigation
  const setView = useCallback((view: LifeOSState["currentView"]) => {
    setState(s => ({ ...s, currentView: view }));
  }, []);

  const setSelectedDate = useCallback((date: string) => {
    setState(s => ({ ...s, selectedDate: date }));
  }, []);

  const setSelectedYear = useCallback((year: number) => {
    setState(s => ({ ...s, selectedYear: year }));
  }, []);

  const toggleShowPastItems = useCallback(() => {
    setState(s => ({ ...s, showPastItems: !s.showPastItems }));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setState(s => store.toggleFocusMode(s));
  }, []);

  // Wizard
  const setWizardStep = useCallback((step: number) => {
    setState(s => ({ ...s, wizardStep: step }));
  }, []);

  const completeWizard = useCallback(() => {
    setState(s => ({ ...s, isConfigured: true, wizardStep: 0, isEditingWizard: false }));
  }, []);

  const startEditingWizard = useCallback(() => {
    setState(s => ({ ...s, isEditingWizard: true, wizardStep: 1 }));
  }, []);

  const cancelEditingWizard = useCallback(() => {
    setState(s => ({ ...s, isEditingWizard: false, wizardStep: 0 }));
  }, []);

  // Year Settings
  const updateYearSettings = useCallback(async (settings: Partial<YearSettings>) => {
    try {
      // Optimistic update
      setState(s => store.updateYearSettings(s, settings));

      // API Call
      await api.years.updateSettings(state.selectedYear, settings);
    } catch (error) {
      console.error("Failed to update year settings", error);
    }
  }, [state.selectedYear]);

  // Roles (Connected to API)
  const addRole = useCallback(async (role: Omit<Role, "id">) => {
    try {
      const newRole = await api.roles.create(role);
      // We use the ID returned by the DB
      setState(s => ({ ...s, roles: [...s.roles, newRole] }));
    } catch (error) {
      console.error("Failed to create role", error);
    }
  }, []);

  const updateRole = useCallback(async (roleId: string, updates: Partial<Role>) => {
    try {
      const updatedRole = await api.roles.update(roleId, updates);
      setState(s => ({
        ...s,
        roles: s.roles.map(r => r.id === roleId ? updatedRole : r)
      }));
    } catch (error) {
      console.error("Failed to update role", error);
    }
  }, []);

  const deleteRole = useCallback(async (roleId: string) => {
    try {
      await api.roles.delete(roleId);
      setState(s => ({
        ...s,
        roles: s.roles.filter(r => r.id !== roleId)
      }));
    } catch (error) {
      console.error("Failed to delete role", error);
    }
  }, []);

  // Goals (Connected to API)
  const addGoal = useCallback(async (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "resources">) => {
    try {
      const newGoal = await api.goals.create(goal);
      setState(s => ({ ...s, goals: [...s.goals, newGoal] }));
    } catch (error) {
      console.error("Failed to create goal", error);
    }
  }, []);

  const updateGoal = useCallback(async (goalId: string, updates: Partial<Goal>) => {
    try {
      const updatedGoal = await api.goals.update(goalId, updates);
      setState(s => ({
        ...s,
        goals: s.goals.map(g => g.id === goalId ? updatedGoal : g)
      }));
    } catch (error) {
      console.error("Failed to update goal", error);
    }
  }, []);

  const deleteGoal = useCallback(async (goalId: string) => {
    try {
      await api.goals.delete(goalId);
      setState(s => ({
        ...s,
        goals: s.goals.filter(g => g.id !== goalId)
      }));
    } catch (error) {
      console.error("Failed to delete goal", error);
    }
  }, []);

  // Resources
  const addResourceToGoal = useCallback(async (goalId: string, resource: Omit<Resource, "id">) => {
    try {
      // Enforce goalId in resource payload if not present
      const payload = { ...resource, goalId };
      const newResource = await api.resources.create(payload);

      setState(s => ({
        ...s,
        goals: s.goals.map(g => g.id === goalId ? { ...g, resources: [...(g.resources || []), newResource] } : g)
      }));
    } catch (error) {
      console.error("Failed to add resource", error);
    }
  }, []);

  const updateResourceInGoal = useCallback(async (goalId: string, resourceId: string, updates: Partial<Resource>) => {
    try {
      const updatedResource = await api.resources.update(resourceId, updates);

      setState(s => ({
        ...s,
        goals: s.goals.map(g => g.id === goalId ? {
          ...g,
          resources: g.resources.map(r => r.id === resourceId ? updatedResource : r)
        } : g)
      }));
    } catch (error) {
      console.error("Failed to update resource", error);
    }
  }, []);

  const deleteResourceFromGoal = useCallback(async (goalId: string, resourceId: string) => {
    try {
      await api.resources.delete(resourceId);

      setState(s => ({
        ...s,
        goals: s.goals.map(g => g.id === goalId ? {
          ...g,
          resources: g.resources.filter(r => r.id !== resourceId)
        } : g)
      }));
    } catch (error) {
      console.error("Failed to delete resource", error);
    }
  }, []);

  // Habits
  const addHabit = useCallback(async (habit: Omit<Habit, "id">) => {
    try {
      const newHabit = await api.habits.create(habit);
      setState(s => ({ ...s, habits: [...s.habits, newHabit] }));
    } catch (error) {
      console.error("Failed to create habit", error);
    }
  }, []);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    try {
      const updatedHabit = await api.habits.update(habitId, updates);
      setState(s => ({
        ...s,
        habits: s.habits.map(h => h.id === habitId ? updatedHabit : h)
      }));
    } catch (error) {
      console.error("Failed to update habit", error);
    }
  }, []);

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      await api.habits.delete(habitId);
      setState(s => ({
        ...s,
        habits: s.habits.filter(h => h.id !== habitId)
      }));
    } catch (error) {
      console.error("Failed to delete habit", error);
    }
  }, []);

  const logHabit = useCallback(async (habitId: string, date: string, status: HabitLog["status"], note?: string) => {
    try {
      const updatedLog = await api.habitLogs.upsert({ habitId, date, status, note });

      setState(s => {
        // Remove existing log for that date if any
        const filteredLogs = s.habitLogs.filter(l => !(l.habitId === habitId && l.date === updatedLog.date)); // Watch out for date string comparison!
        // In the state we keep date as string usually, but API returns string (ISO). 
        // We might need to normalize. For simplicity let's assume direct usage or ensure store handles it.
        // Actually, the store usually expects simple Date strings e.g. "2024-01-01" or ISO.
        // Let's use the returned log directly but ensure we match the ID/Date unique constraint logic.

        // Better approach: Find index
        const index = s.habitLogs.findIndex(l => l.habitId === habitId && l.date.split('T')[0] === date.split('T')[0]);

        // Normalize date from API to match local state format (YYYY-MM-DD usually preferred for UI)
        // But if we use full ISO strings, we must be consistent.
        // The Backend returns full ISO string probably.

        const newLogs = [...s.habitLogs];
        if (index >= 0) {
          newLogs[index] = updatedLog;
        } else {
          newLogs.push(updatedLog);
        }
        return { ...s, habitLogs: newLogs };
      });
    } catch (error) {
      console.error("Failed to log habit", error);
    }
  }, []);

  // Deviations
  const addDeviation = useCallback(async (deviation: Omit<Deviation, "id" | "createdAt">) => {
    try {
      const newDeviation = await api.deviations.create(deviation);
      setState(s => ({ ...s, deviations: [...s.deviations, newDeviation] }));
    } catch (error) {
      console.error("Failed to add deviation", error);
    }
  }, []);

  const updateDeviation = useCallback(async (id: string, updates: Partial<Deviation>) => {
    try {
      const updatedDeviation = await api.deviations.update(id, updates);
      setState(s => ({
        ...s,
        deviations: s.deviations.map(d => d.id === id ? updatedDeviation : d)
      }));
    } catch (error) {
      console.error("Failed to update deviation", error);
    }
  }, []);

  const deleteDeviation = useCallback(async (id: string) => {
    try {
      await api.deviations.delete(id);
      setState(s => ({
        ...s,
        deviations: s.deviations.filter(d => d.id !== id)
      }));
    } catch (error) {
      console.error("Failed to delete deviation", error);
    }
  }, []);

  // Daily Stone
  const setDailyStone = useCallback(async (date: string, title: string, roleId?: string) => {
    try {
      const stone = await api.dailyStones.upsert({ date, title, roleId });

      setState(s => {
        // Optimistic / Clean update
        const index = s.dailyStones.findIndex(ds => ds.date.split('T')[0] === date.split('T')[0]);
        const newStones = [...s.dailyStones];
        if (index >= 0) {
          newStones[index] = { ...newStones[index], title, roleId, date: stone.date }; // Ensure we use canonical date
        } else {
          newStones.push(stone);
        }
        return { ...s, dailyStones: newStones };
      });
    } catch (error) {
      console.error("Failed to set daily stone", error);
    }
  }, []);

  const completeDailyStone = useCallback(async (date: string, completed: boolean) => {
    // Find current stone to get required fields for upsert (title is required)
    // This is tricky because completeDailyStone usually just toggles.
    // We need to fetch current state.

    // In a perfect world, we pass the ID. But here we identify by date.

    // Let's look up in state
    // BEWARE: This `state` variable in closure might be stale if not careful, but `setState` callback is safe.
    // However, inside the async function, we need access to the current stone to send the full object or just patch.
    // Our API upsert expects title. If we only update completion, we should probably have a PATCH endpoint or ensure we have title.
    // For now, let's assume we can find it in the list.

    // FIX: We need to use "s" from setState or keep state Ref?
    // Actually, we can just use the "state" from closure, but we should be careful.
    // Let's try to find it in the current state (state variable of the hook)

    const currentStone = state.dailyStones.find(ds => ds.date.split('T')[0] === date.split('T')[0]);
    if (!currentStone) return; // Can't complete a non-existent stone

    try {
      const updatedStone = await api.dailyStones.upsert({
        date,
        title: currentStone.title,
        roleId: currentStone.roleId,
        completed,
        note: currentStone.note
      });

      setState(s => ({
        ...s,
        dailyStones: s.dailyStones.map(ds => ds.date === currentStone.date ? updatedStone : ds)
      }));
    } catch (error) {
      console.error("Failed to complete daily stone", error);
    }
  }, [state.dailyStones]); // Dependency on state.dailyStones is needed here

  // Projects
  const addProject = useCallback(async (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "statuses">) => {
    try {
      const newProject = await api.projects.create(project);
      setState(s => ({ ...s, projects: [...s.projects, newProject] }));
    } catch (error) {
      console.error("Failed to create project", error);
    }
  }, []);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await api.projects.update(projectId, updates);
      setState(s => ({
        ...s,
        projects: s.projects.map(p => p.id === projectId ? updatedProject : p)
      }));
    } catch (error) {
      console.error("Failed to update project", error);
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string) => {
    try {
      await api.projects.delete(projectId);
      setState(s => ({
        ...s,
        projects: s.projects.filter(p => p.id !== projectId)
      }));
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  }, []);

  // Project Activities
  const addProjectActivity = useCallback(async (activity: Omit<ProjectActivity, "id" | "createdAt" | "order">) => {
    try {
      const newActivity = await api.projectActivities.create(activity);
      setState(s => ({ ...s, projectActivities: [...s.projectActivities, newActivity] }));
    } catch (error) {
      console.error("Failed to create project activity", error);
    }
  }, []);

  const updateProjectActivity = useCallback(async (activityId: string, updates: Partial<ProjectActivity>) => {
    try {
      const updatedActivity = await api.projectActivities.update(activityId, updates);
      setState(s => ({
        ...s,
        projectActivities: s.projectActivities.map(a => a.id === activityId ? updatedActivity : a)
      }));
    } catch (error) {
      console.error("Failed to update project activity", error);
    }
  }, []);

  const deleteProjectActivity = useCallback(async (activityId: string) => {
    try {
      await api.projectActivities.delete(activityId);
      setState(s => ({
        ...s,
        projectActivities: s.projectActivities.filter(a => a.id !== activityId)
      }));
    } catch (error) {
      console.error("Failed to delete project activity", error);
    }
  }, []);

  const reorderActivities = useCallback((projectId: string, activityId: string, newStatus: string, newOrder: number) => {
    // Reordering is complex with API because we might need to update multiple items or just one field.
    // For now, let's just update the status and simple order field of the moved item.
    // Full reordering logic (updating all siblings) can be expensive if not handled by backend.

    // Optimistic update
    setState(s => store.reorderActivities(s, projectId, activityId, newStatus, newOrder));

    // API Call (Background)
    api.projectActivities.update(activityId, { status: newStatus, order: newOrder }).catch(err => {
      console.error("Failed to persist reorder", err);
      // Could revert state here if needed
    });
  }, []);

  // Fitness Activities
  const addFitnessActivity = useCallback(async (activity: Omit<FitnessActivity, "id" | "createdAt">) => {
    try {
      const newActivity = await api.fitness.create(activity);
      setState(s => ({ ...s, fitnessActivities: [...s.fitnessActivities, newActivity] }));
    } catch (error) {
      console.error("Failed to create fitness activity", error);
    }
  }, []);

  const updateFitnessActivity = useCallback(async (activityId: string, updates: Partial<FitnessActivity>) => {
    try {
      const updatedActivity = await api.fitness.update(activityId, updates);
      setState(s => ({
        ...s,
        fitnessActivities: s.fitnessActivities.map(a => a.id === activityId ? updatedActivity : a)
      }));
    } catch (error) {
      console.error("Failed to update fitness activity", error);
    }
  }, []);

  const deleteFitnessActivity = useCallback(async (activityId: string) => {
    try {
      await api.fitness.delete(activityId);
      setState(s => ({
        ...s,
        fitnessActivities: s.fitnessActivities.filter(a => a.id !== activityId)
      }));
    } catch (error) {
      console.error("Failed to delete fitness activity", error);
    }
  }, []);

  // Fitness Routines
  const addFitnessRoutine = useCallback(async (routine: Omit<FitnessRoutine, "id" | "createdAt">) => {
    try {
      const newRoutine = await api.fitness.createRoutine(routine); // Ensure createRoutine is typed correctly in api.ts
      setState(s => ({ ...s, fitnessRoutines: [...s.fitnessRoutines, newRoutine] }));
    } catch (error) {
      console.error("Failed to create fitness routine", error);
    }
  }, []);

  const deleteFitnessRoutine = useCallback(async (routineId: string) => {
    try {
      await api.fitness.deleteRoutine(routineId);
      setState(s => ({
        ...s,
        fitnessRoutines: s.fitnessRoutines.filter(r => r.id !== routineId)
      }));
    } catch (error) {
      console.error("Failed to delete fitness routine", error);
    }
  }, []);

  // Calendar Events
  const addCalendarEvent = useCallback(async (event: Omit<CalendarEvent, "id" | "createdAt">) => {
    try {
      const newEvent = await api.calendar.create(event);
      setState(s => ({ ...s, calendarEvents: [...s.calendarEvents, newEvent] }));
    } catch (error) {
      console.error("Failed to create calendar event", error);
    }
  }, []);

  const updateCalendarEvent = useCallback(async (eventId: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = await api.calendar.update(eventId, updates);
      setState(s => ({
        ...s,
        calendarEvents: s.calendarEvents.map(e => e.id === eventId ? updatedEvent : e)
      }));
    } catch (error) {
      console.error("Failed to update calendar event", error);
    }
  }, []);

  const deleteCalendarEvent = useCallback(async (eventId: string) => {
    try {
      await api.calendar.delete(eventId);
      setState(s => ({
        ...s,
        calendarEvents: s.calendarEvents.filter(e => e.id !== eventId)
      }));
    } catch (error) {
      console.error("Failed to delete calendar event", error);
    }
  }, []);

  // Note Folders
  const addNoteFolder = useCallback(async (folder: Omit<NoteFolder, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newFolder = await api.noteFolders.create(folder);
      setState(s => ({ ...s, noteFolders: [...s.noteFolders, newFolder] }));
    } catch (error) {
      console.error("Failed to create folder", error);
    }
  }, []);

  const updateNoteFolder = useCallback(async (folderId: string, updates: Partial<NoteFolder>) => {
    try {
      const updatedFolder = await api.noteFolders.update(folderId, updates);
      setState(s => ({
        ...s,
        noteFolders: s.noteFolders.map(f => f.id === folderId ? updatedFolder : f)
      }));
    } catch (error) {
      console.error("Failed to update folder", error);
    }
  }, []);

  const deleteNoteFolder = useCallback(async (folderId: string) => {
    try {
      await api.noteFolders.delete(folderId);
      setState(s => ({
        ...s,
        noteFolders: s.noteFolders.filter(f => f.id !== folderId)
      }));
    } catch (error) {
      console.error("Failed to delete folder", error);
    }
  }, []);

  // Notes
  const addNote = useCallback(async (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newNote = await api.notes.create(note);
      setState(s => ({ ...s, notes: [...s.notes, newNote] }));
    } catch (error) {
      console.error("Failed to create note", error);
    }
  }, []);

  const updateNote = useCallback(async (noteId: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await api.notes.update(noteId, updates);
      setState(s => ({
        ...s,
        notes: s.notes.map(n => n.id === noteId ? updatedNote : n)
      }));
    } catch (error) {
      console.error("Failed to update note", error);
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    try {
      await api.notes.delete(noteId);
      setState(s => ({
        ...s,
        notes: s.notes.filter(n => n.id !== noteId)
      }));
    } catch (error) {
      console.error("Failed to delete note", error);
    }
  }, []);

  // Note Tags
  const addNoteTag = useCallback((tag: Omit<NoteTag, "id">) => {
    setState(s => store.addNoteTag(s, tag));
  }, []);

  const deleteNoteTag = useCallback((tagId: string) => {
    setState(s => store.deleteNoteTag(s, tagId));
  }, []);

  // Note Documents
  const addNoteDocument = useCallback((doc: Omit<NoteDocument, "id" | "createdAt">) => {
    setState(s => store.addNoteDocument(s, doc));
  }, []);

  const deleteNoteDocument = useCallback((docId: string) => {
    setState(s => store.deleteNoteDocument(s, docId));
  }, []);

  // Reset
  const resetAll = useCallback(() => {
    setState(store.resetState());
  }, []);

  // Helpers
  const getRoleById = useCallback((roleId: string) => {
    return state.roles.find(r => r.id === roleId);
  }, [state.roles]);

  const getGoalsByRole = useCallback((roleId: string) => {
    return state.goals.filter(g => g.roleId === roleId);
  }, [state.goals]);

  const getGoalsByQuarter = useCallback((quarter: 1 | 2 | 3 | 4) => {
    return state.goals.filter(g => g.quarter === quarter);
  }, [state.goals]);

  const getHabitLogsForDate = useCallback((date: string) => {
    return state.habitLogs.filter(l => l.date === date);
  }, [state.habitLogs]);

  const getDailyStone = useCallback((date: string) => {
    return state.dailyStones.find(s => s.date === date);
  }, [state.dailyStones]);

  const getHabitsByRole = useCallback((roleId: string) => {
    return state.habits.filter(h => h.roleId === roleId);
  }, [state.habits]);

  const getProjectsByGoal = useCallback((goalId: string) => {
    return state.projects.filter(p => p.goalId === goalId);
  }, [state.projects]);

  const getActivitiesByProject = useCallback((projectId: string) => {
    return state.projectActivities.filter(a => a.projectId === projectId);
  }, [state.projectActivities]);

  const getActivitiesForDate = useCallback((date: string) => {
    return state.projectActivities.filter(a => a.dueDate === date);
  }, [state.projectActivities]);

  return {
    state,
    // Navigation
    isReadOnly: state.selectedYear < new Date().getFullYear(),
    setView,
    setSelectedDate,
    setSelectedYear,
    toggleShowPastItems,
    toggleFocusMode,
    // Wizard
    setWizardStep,
    completeWizard,
    startEditingWizard,
    cancelEditingWizard,
    // Year Settings
    updateYearSettings,
    // Roles
    addRole,
    updateRole,
    deleteRole,
    // Goals
    addGoal,
    updateGoal,
    deleteGoal,
    // Resources
    addResourceToGoal,
    updateResourceInGoal,
    deleteResourceFromGoal,
    // Habits
    addHabit,
    updateHabit,
    deleteHabit,
    logHabit,
    // Deviations
    // Deviations
    addDeviation,
    updateDeviation,
    deleteDeviation,
    // Daily Stone
    setDailyStone,
    completeDailyStone,
    // Projects
    addProject,
    updateProject,
    deleteProject,
    // Project Activities
    addProjectActivity,
    updateProjectActivity,
    deleteProjectActivity,
    reorderActivities,
    // Fitness
    addFitnessActivity,
    updateFitnessActivity,
    deleteFitnessActivity,
    addFitnessRoutine,
    deleteFitnessRoutine,
    // Calendar Events
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    // Notes
    addNoteFolder,
    updateNoteFolder,
    deleteNoteFolder,
    addNote,
    updateNote,
    deleteNote,
    addNoteTag,
    deleteNoteTag,
    addNoteDocument,
    deleteNoteDocument,
    // Pomodoro
    addPomodoroSession: useCallback(async (session: Omit<PomodoroSession, "id" | "createdAt">) => {
      try {
        const newSession = await api.pomodoro.create(session);
        setState(s => ({ ...s, pomodoroSessions: [newSession, ...s.pomodoroSessions] }));
      } catch (error) {
        console.error("Failed to create pomodoro session", error);
      }
    }, []),

    deletePomodoroSession: useCallback(async (sessionId: string) => {
      try {
        await api.pomodoro.delete(sessionId);
        setState(s => ({
          ...s,
          pomodoroSessions: s.pomodoroSessions.filter(s => s.id !== sessionId)
        }));
      } catch (error) {
        console.error("Failed to delete pomodoro session", error);
      }
    }, [state.pomodoroSessions]),

    // Active Pause
    addActivePauseRoutine: useCallback((routine: Omit<ActivePauseRoutine, "id">) => {
      setState(s => store.addActivePauseRoutine(s, routine));
    }, []),

    updateActivePauseRoutine: useCallback((id: string, updates: Partial<ActivePauseRoutine>) => {
      setState(s => store.updateActivePauseRoutine(s, id, updates));
    }, []),

    deleteActivePauseRoutine: useCallback((id: string) => {
      setState(s => store.deleteActivePauseRoutine(s, id));
    }, []),

    logActivePause: useCallback((entry: Omit<ActivePauseEntry, "id">) => {
      setState(s => store.logActivePause(s, entry));
    }, []),

    updatePomodoroSettings: useCallback((settings: Partial<PomodoroSettings>) => {
      setState(s => store.updatePomodoroSettings(s, settings));
    }, []),

    // Reset
    resetAll,
    // Helpers
    getRoleById,
    getGoalsByRole,
    getGoalsByQuarter,
    getHabitLogsForDate,
    getDailyStone,
    getHabitsByRole,
    getProjectsByGoal,
    getActivitiesByProject,
    getActivitiesForDate,
  };
}
