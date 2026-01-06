/**
 * Life-OS 2026 Core Types
 * Based on Superhábitos methodology
 */

import { LucideIcon } from "lucide-react";

// Available role icons and colors
export type RoleColor = 
  | "student" 
  | "athlete" 
  | "entrepreneur" 
  | "creative" 
  | "family" 
  | "spiritual" 
  | "social";

export const ROLE_COLORS: Record<RoleColor, { bg: string; text: string; border: string }> = {
  student: { bg: "bg-role-student", text: "text-role-student", border: "border-role-student" },
  athlete: { bg: "bg-role-athlete", text: "text-role-athlete", border: "border-role-athlete" },
  entrepreneur: { bg: "bg-role-entrepreneur", text: "text-role-entrepreneur", border: "border-role-entrepreneur" },
  creative: { bg: "bg-role-creative", text: "text-role-creative", border: "border-role-creative" },
  family: { bg: "bg-role-family", text: "text-role-family", border: "border-role-family" },
  spiritual: { bg: "bg-role-spiritual", text: "text-role-spiritual", border: "border-role-spiritual" },
  social: { bg: "bg-role-social", text: "text-role-social", border: "border-role-social" },
};

// Role (max 7 per methodology)
export interface Role {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: RoleColor;
  description?: string;
}

// Annual goal linked to a role
export interface Goal {
  id: string;
  roleId: string;
  title: string;
  description?: string;
  quarter: 1 | 2 | 3 | 4;
  semester: 1 | 2;
  status: "pending" | "in_progress" | "completed" | "deferred";
  createdAt: string;
  updatedAt: string;
}

// Daily habit tracking
export interface Habit {
  id: string;
  name: string;
  roleId?: string;
  frequency: "daily" | "weekdays" | "weekends" | "custom";
  customDays?: number[]; // 0-6, Sunday-Saturday
}

// Daily habit log entry
export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: "completed" | "missed" | "day_off" | "other";
  note?: string;
}

// Deviation/Learning point
export interface Deviation {
  id: string;
  goalId?: string;
  habitId?: string;
  date: string;
  whatHappened: string;
  adjustmentAction: string;
  lesson?: string;
  createdAt: string;
}

// Daily stone (main daily objective)
export interface DailyStone {
  id: string;
  date: string;
  title: string;
  roleId?: string;
  completed: boolean;
  note?: string;
}

// Year settings (Vision, Mission)
export interface YearSettings {
  year: number;
  vision5Years: string;
  visionImages?: string[]; // URLs or base64
  mission: string;
  h1Priority: string; // First half priority
  h2Priority: string; // Second half priority
  createdAt: string;
  updatedAt: string;
}

// Complete app state
export interface LifeOSState {
  isConfigured: boolean;
  wizardStep: number;
  yearSettings: YearSettings | null;
  roles: Role[];
  goals: Goal[];
  habits: Habit[];
  habitLogs: HabitLog[];
  deviations: Deviation[];
  dailyStones: DailyStone[];
  currentView: "identity" | "semester" | "daily";
  selectedDate: string;
}

// Default initial state
export const initialState: LifeOSState = {
  isConfigured: false,
  wizardStep: 1,
  yearSettings: null,
  roles: [],
  goals: [],
  habits: [],
  habitLogs: [],
  deviations: [],
  dailyStones: [],
  currentView: "identity",
  selectedDate: new Date().toISOString().split('T')[0],
};
