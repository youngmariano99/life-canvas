/**
 * Custom hook for Life-OS state management
 * Provides reactive state with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";
import { LifeOSState, Role, Goal, Habit, HabitLog, Deviation, YearSettings } from "@/types/lifeOS";
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

  // Wizard
  const setWizardStep = useCallback((step: number) => {
    setState(s => ({ ...s, wizardStep: step }));
  }, []);

  const completeWizard = useCallback(() => {
    setState(s => ({ ...s, isConfigured: true, wizardStep: 0 }));
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
  const addGoal = useCallback((goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    setState(s => store.addGoal(s, goal));
  }, []);

  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setState(s => store.updateGoal(s, goalId, updates));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setState(s => store.deleteGoal(s, goalId));
  }, []);

  // Habits
  const addHabit = useCallback((habit: Omit<Habit, "id">) => {
    setState(s => store.addHabit(s, habit));
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

  return {
    state,
    // Navigation
    setView,
    setSelectedDate,
    // Wizard
    setWizardStep,
    completeWizard,
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
    // Habits
    addHabit,
    logHabit,
    // Deviations
    addDeviation,
    // Daily Stone
    setDailyStone,
    completeDailyStone,
    // Reset
    resetAll,
    // Helpers
    getRoleById,
    getGoalsByRole,
    getGoalsByQuarter,
    getHabitLogsForDate,
    getDailyStone,
  };
}
