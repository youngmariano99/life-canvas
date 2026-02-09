/**
 * Life-OS 2026 Core Types
 * Based on Superhábitos methodology
 */

import { LucideIcon } from "lucide-react";

// Available role icons and colors
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

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

// Resource for goals
export interface Resource {
  id: string;
  goalId?: string;
  name: string;
  quantityHave: number;
  quantityNeeded: number;
  unit?: string;
}

// Role (max 7 per methodology)
export interface Role {
  id: string;
  name: string;
  icon: string;
  color: RoleColor;
  description?: string;
  imageUrl?: string;
}

// Annual goal linked to a role
export interface Goal {
  id: string;
  roleId: string;
  title: string;
  description?: string;
  quarter: 1 | 2 | 3 | 4;
  semester: 1 | 2;
  targetDate?: string;
  status: "pending" | "in_progress" | "completed" | "deferred";
  resources: Resource[];
  subGoals?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
  updatedAt: string;
}

// Daily habit tracking
export interface Habit {
  id: string;
  name: string;
  roleId?: string;
  frequency: "daily" | "weekdays" | "weekends" | "custom";
  customDays?: number[];
}

// Daily habit log entry
export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  status: "completed" | "missed" | "day_off" | "other";
  note?: string;
}

// Deviation/Learning point
export interface Deviation {
  id: string;
  goalId?: string;
  habitId?: string;
  date: string;
  title: string;       // was whatHappened
  correction: string;  // was adjustmentAction
  reason?: string;     // was lesson
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
  visionImages?: string[];
  mission: string;
  h1Priority: string;
  h2Priority: string;
  createdAt: string;
  updatedAt: string;
}

// Project activity for weekly planning
export interface ProjectActivity {
  id: string;
  projectId: string;
  title: string;
  status: string;
  order: number;
  dueDate?: string;
  roleId?: string;
  createdAt: string;
}

// Project linked to a goal
export interface Project {
  id: string;
  goalId: string;
  name: string;
  description?: string;
  dueDate?: string;
  statuses: string[];
  createdAt: string;
  updatedAt: string;
}

// ==================== FITNESS TRACKING ====================

export type FitnessActivityType = "neat" | "workout";

export interface FitnessActivity {
  id: string;
  type: FitnessActivityType;
  name: string;
  duration?: number;
  calories?: number;
  distance?: number;
  notes?: string;
  date: string;
  createdAt: string;
}

export type FitnessRoutineStructureType = "sets_reps" | "intervals" | "rounds" | "time" | "distance" | "custom";
export type FitnessRoutineType = "strength" | "cardio" | "hybrid";

// Fitness Content Types
export interface RoutineItemSetsReps {
  name: string;
  sets: string;
  reps: string;
  weight?: string;
}

export interface RoutineItemRounds {
  name: string;
  target: string; // e.g., "15 reps" or "30s"
}

export interface RoutineItemIntervals {
  exercise: string;
  sets: string;
  work: string;
  rest: string;
}

export interface RoutineItemTarget {
  targetTime?: string;
  targetDistance?: string;
  notes?: string;
}

export interface FitnessRoutine {
  id: string;
  name: string;
  type: FitnessRoutineType;
  structureType: FitnessRoutineStructureType; // "sets_reps" | "intervals" | "rounds" | "time" | "distance"
  rounds?: string; // Global rounds for 'rounds' type
  content: (RoutineItemSetsReps | RoutineItemRounds | RoutineItemIntervals | RoutineItemTarget)[];
  createdAt: string;
}

// ... existing code ...



// ==================== CALENDAR EVENTS ====================

export type CalendarEventTag =
  | "birthday"
  | "reminder"
  | "appointment"
  | "exam"
  | "deadline"
  | "personal"
  | "custom";

export const EVENT_TAG_COLORS: Record<CalendarEventTag, { bg: string; text: string }> = {
  birthday: { bg: "bg-pink-500", text: "text-pink-500" },
  reminder: { bg: "bg-amber-500", text: "text-amber-500" },
  appointment: { bg: "bg-blue-500", text: "text-blue-500" },
  exam: { bg: "bg-red-500", text: "text-red-500" },
  deadline: { bg: "bg-orange-500", text: "text-orange-500" },
  personal: { bg: "bg-purple-500", text: "text-purple-500" },
  custom: { bg: "bg-gray-500", text: "text-gray-500" },
};

export interface CalendarEvent {
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

// ==================== NOTES SYSTEM ====================

export type NoteType = "note" | "whiteboard" | "document";

export interface NoteTag {
  id: string;
  name: string;
  color: string;
  type: "role" | "goal" | "project" | "custom";
  referenceId?: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  folderId: string;
  type: NoteType;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteDocument {
  id: string;
  noteId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl: string;
  createdAt: string;
}

// Complete app state
export interface LifeOSState {
  isConfigured: boolean;
  wizardStep: number;
  isEditingWizard: boolean;
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
  fitnessRoutines: FitnessRoutine[];
  calendarEvents: CalendarEvent[];
  noteFolders: NoteFolder[];
  notes: Note[];
  noteTags: NoteTag[];
  noteDocuments: NoteDocument[];
  currentView: "identity" | "semester" | "daily" | "weekly" | "fitness" | "notes";
  selectedDate: string;
  showPastItems: boolean;
  focusMode: boolean;
  selectedYear: number;
  isReadOnly: boolean;
  isLoading: boolean;
}

// Default initial state
export const initialState: LifeOSState = {
  isConfigured: false,
  wizardStep: 1,

  isLoading: true, // Start in loading state
  isEditingWizard: false,
  yearSettings: null,
  roles: [],
  goals: [],
  habits: [],
  habitLogs: [],
  deviations: [],
  dailyStones: [],
  projects: [],
  projectActivities: [],
  fitnessActivities: [],
  fitnessRoutines: [],
  calendarEvents: [],
  noteFolders: [],
  notes: [],
  noteTags: [],
  noteDocuments: [],
  currentView: "identity",
  selectedDate: new Date().toISOString().split('T')[0],
  showPastItems: false,
  focusMode: false,
  selectedYear: new Date().getFullYear(),
  isReadOnly: false,
};