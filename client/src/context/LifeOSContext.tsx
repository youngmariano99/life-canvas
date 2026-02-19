/**
 * Life-OS Context Provider
 * Shares state across all components
 */

import React, { createContext, useContext, ReactNode } from "react";
import { useLifeOS } from "@/hooks/useLifeOS";
import { LifeOSState, Role, Goal, Habit, HabitLog, Deviation, YearSettings, Project, ProjectActivity, Resource, FitnessActivity, FitnessRoutine, CalendarEvent, NoteFolder, Note, NoteTag, NoteDocument, PomodoroSession, PomodoroSettings, ActivePauseRoutine, ActivePauseEntry } from "@/types/lifeOS";

type LifeOSContextType = ReturnType<typeof useLifeOS> & {
  // Pomodoro
  addPomodoroSession: (session: Omit<PomodoroSession, "id" | "createdAt">) => Promise<void>;
  deletePomodoroSession: (sessionId: string) => Promise<void>;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;

  // Active Pause
  addActivePauseRoutine: (routine: Omit<ActivePauseRoutine, "id">) => void;
  updateActivePauseRoutine: (id: string, updates: Partial<ActivePauseRoutine>) => void;
  deleteActivePauseRoutine: (id: string) => void;
  logActivePause: (entry: Omit<ActivePauseEntry, "id">) => void;

  // Reset
  resetAll: () => void;
};

const LifeOSContext = createContext<LifeOSContextType | null>(null);

export function LifeOSProvider({ children }: { children: ReactNode }) {
  const lifeOS = useLifeOS();

  return (
    <LifeOSContext.Provider value={lifeOS}>
      {children}
    </LifeOSContext.Provider>
  );
}

export function useLifeOSContext() {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error("useLifeOSContext must be used within LifeOSProvider");
  }
  return context;
}
