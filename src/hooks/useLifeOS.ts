/**
 * Custom hook for Life-OS state management
 * Provides reactive state with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import { LifeOSState, Role, Goal, Habit, HabitLog, Deviation, YearSettings, Project, ProjectActivity, Resource } from "@/types/lifeOS";
import * as store from "@/store/lifeOSStore";

export function useLifeOS() {
  const [state, setState] = useState<LifeOSState>(() => store.loadState());

  // Persist to localStorage on every state change
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

  const toggleShowPastItems = useCallback(() => {
    setState(s => ({ ...s, showPastItems: !s.showPastItems }));
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
  const updateYearSettings = useCallback((settings: Partial<YearSettings>) => {
    setState(s => store.updateYearSettings(s, settings));
  }, []);

  // Roles
  const addRole = useCallback((role: Omit<Role, "id">) => {
    setState(s => store.addRole(s, role));
  }, []);

  const updateRole = useCallback((roleId: string, updates: Partial<Role>) => {
    setState(s => store.updateRole(s, roleId, updates));
  }, []);

  const deleteRole = useCallback((roleId: string) => {
    setState(s => store.deleteRole(s, roleId));
  }, []);

  // Goals
  const addGoal = useCallback((goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "resources">) => {
    setState(s => store.addGoal(s, goal));
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setState(s => store.updateGoal(s, goalId, updates));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setState(s => store.deleteGoal(s, goalId));
  }, []);

  // Resources
  const addResourceToGoal = useCallback((goalId: string, resource: Omit<Resource, "id">) => {
    setState(s => store.addResourceToGoal(s, goalId, resource));
  }, []);

  const updateResourceInGoal = useCallback((goalId: string, resourceId: string, updates: Partial<Resource>) => {
    setState(s => store.updateResourceInGoal(s, goalId, resourceId, updates));
  }, []);

  const deleteResourceFromGoal = useCallback((goalId: string, resourceId: string) => {
    setState(s => store.deleteResourceFromGoal(s, goalId, resourceId));
  }, []);

  // Habits
  const addHabit = useCallback((habit: Omit<Habit, "id">) => {
    setState(s => store.addHabit(s, habit));
  }, []);

  const updateHabit = useCallback((habitId: string, updates: Partial<Habit>) => {
    setState(s => store.updateHabit(s, habitId, updates));
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setState(s => store.deleteHabit(s, habitId));
  }, []);

  const logHabit = useCallback((
    habitId: string, 
    date: string, 
    status: HabitLog["status"],
    note?: string
  ) => {
    setState(s => store.logHabit(s, habitId, date, status, note));
  }, []);

  // Deviations
  const addDeviation = useCallback((deviation: Omit<Deviation, "id" | "createdAt">) => {
    setState(s => store.addDeviation(s, deviation));
  }, []);

  // Daily Stone
  const setDailyStone = useCallback((date: string, title: string, roleId?: string) => {
    setState(s => store.setDailyStone(s, date, title, roleId));
  }, []);

  const completeDailyStone = useCallback((date: string, completed: boolean) => {
    setState(s => store.completeDailyStone(s, date, completed));
  }, []);

  // Projects
  const addProject = useCallback((project: Omit<Project, "id" | "createdAt" | "updatedAt" | "statuses">) => {
    setState(s => store.addProject(s, project));
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setState(s => store.updateProject(s, projectId, updates));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setState(s => store.deleteProject(s, projectId));
  }, []);

  // Project Activities
  const addProjectActivity = useCallback((activity: Omit<ProjectActivity, "id" | "createdAt" | "order">) => {
    setState(s => store.addProjectActivity(s, activity));
  }, []);

  const updateProjectActivity = useCallback((activityId: string, updates: Partial<ProjectActivity>) => {
    setState(s => store.updateProjectActivity(s, activityId, updates));
  }, []);

  const deleteProjectActivity = useCallback((activityId: string) => {
    setState(s => store.deleteProjectActivity(s, activityId));
  }, []);

  const reorderActivities = useCallback((projectId: string, activityId: string, newStatus: string, newOrder: number) => {
    setState(s => store.reorderActivities(s, projectId, activityId, newStatus, newOrder));
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
    setView,
    setSelectedDate,
    toggleShowPastItems,
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
    addDeviation,
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
