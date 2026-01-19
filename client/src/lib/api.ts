/**
 * API Client for interacting with the NestJS Backend
 */
import { Role, Goal, Habit, HabitLog, Project, ProjectActivity, DailyStone, FitnessActivity, Deviation, Resource, NoteFolder, Note, CalendarEvent, FitnessRoutine } from "@/types/lifeOS";

const API_URL = "http://127.0.0.1:3000/api";

export const api = {
    roles: {
        getAll: async (): Promise<Role[]> => {
            const response = await fetch(`${API_URL}/roles`);
            if (!response.ok) throw new Error("Failed to fetch roles");
            return response.json();
        },
        create: async (role: Omit<Role, "id">): Promise<Role> => {
            const response = await fetch(`${API_URL}/roles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(role),
            });
            if (!response.ok) throw new Error("Failed to create role");
            return response.json();
        },
        update: async (id: string, updates: Partial<Role>): Promise<Role> => {
            const response = await fetch(`${API_URL}/roles/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update role");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/roles/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete role");
        },
    },
    goals: {
        getAll: async (): Promise<Goal[]> => {
            const response = await fetch(`${API_URL}/goals`);
            if (!response.ok) throw new Error("Failed to fetch goals");
            return response.json();
        },
        create: async (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "resources" | "projects" | "deviations" | "user" | "role">): Promise<Goal> => {
            const response = await fetch(`${API_URL}/goals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(goal),
            });
            if (!response.ok) throw new Error("Failed to create goal");
            return response.json();
        },
        update: async (id: string, updates: Partial<Goal>): Promise<Goal> => {
            const response = await fetch(`${API_URL}/goals/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update goal");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/goals/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete goal");
        },
    },
    habits: {
        getAll: async (): Promise<Habit[]> => {
            const response = await fetch(`${API_URL}/habits`);
            if (!response.ok) throw new Error("Failed to fetch habits");
            return response.json();
        },
        create: async (habit: Omit<Habit, "id" | "createdAt" | "logs" | "deviations" | "user" | "role">): Promise<Habit> => {
            const response = await fetch(`${API_URL}/habits`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(habit),
            });
            if (!response.ok) throw new Error("Failed to create habit");
            return response.json();
        },
        update: async (id: string, updates: Partial<Habit>): Promise<Habit> => {
            const response = await fetch(`${API_URL}/habits/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update habit");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/habits/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete habit");
        },
    },
    habitLogs: {
        getAll: async (): Promise<HabitLog[]> => {
            const response = await fetch(`${API_URL}/habit-logs`);
            if (!response.ok) throw new Error("Failed to fetch habit logs");
            return response.json();
        },
        upsert: async (log: { habitId: string; date: string; status: string; note?: string }): Promise<HabitLog> => {
            const response = await fetch(`${API_URL}/habit-logs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(log),
            });
            if (!response.ok) throw new Error("Failed to upsert habit log");
            return response.json();
        },
    },
    projects: {
        getAll: async (): Promise<Project[]> => {
            const response = await fetch(`${API_URL}/projects`);
            if (!response.ok) throw new Error("Failed to fetch projects");
            return response.json();
        },
        create: async (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "activities" | "goal" | "statuses">): Promise<Project> => {
            const response = await fetch(`${API_URL}/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(project),
            });
            if (!response.ok) throw new Error("Failed to create project");
            return response.json();
        },
        update: async (id: string, updates: Partial<Project>): Promise<Project> => {
            const response = await fetch(`${API_URL}/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update project");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/projects/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete project");
        },
    },
    projectActivities: {
        getAll: async (): Promise<ProjectActivity[]> => {
            const response = await fetch(`${API_URL}/project-activities`);
            if (!response.ok) throw new Error("Failed to fetch project activities");
            return response.json();
        },
        create: async (activity: Omit<ProjectActivity, "id" | "createdAt" | "order">): Promise<ProjectActivity> => {
            const response = await fetch(`${API_URL}/project-activities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(activity),
            });
            if (!response.ok) throw new Error("Failed to create project activity");
            return response.json();
        },
        update: async (id: string, updates: Partial<ProjectActivity>): Promise<ProjectActivity> => {
            const response = await fetch(`${API_URL}/project-activities/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update project activity");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/project-activities/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete project activity");
        },
    },
    dailyStones: {
        getAll: async (): Promise<DailyStone[]> => {
            const response = await fetch(`${API_URL}/daily-stones`);
            if (!response.ok) throw new Error("Failed to fetch daily stones");
            return response.json();
        },
        upsert: async (stone: { date: string; title: string, roleId?: string; completed?: boolean; note?: string }): Promise<DailyStone> => {
            const response = await fetch(`${API_URL}/daily-stones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(stone),
            });
            if (!response.ok) throw new Error("Failed to upsert daily stone");
            return response.json();
        },
    },
    fitness: {
        getAll: async (): Promise<FitnessActivity[]> => {
            const response = await fetch(`${API_URL}/fitness`);
            if (!response.ok) throw new Error("Failed to fetch fitness activities");
            return response.json();
        },
        create: async (activity: Omit<FitnessActivity, "id" | "createdAt">): Promise<FitnessActivity> => {
            const response = await fetch(`${API_URL}/fitness`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(activity),
            });
            if (!response.ok) throw new Error("Failed to create fitness activity");
            return response.json();
        },
        update: async (id: string, updates: Partial<FitnessActivity>): Promise<FitnessActivity> => {
            const response = await fetch(`${API_URL}/fitness/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update fitness activity");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/fitness/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete fitness activity");
        },
        // Routines
        getAllRoutines: async (): Promise<FitnessRoutine[]> => {
            const response = await fetch(`${API_URL}/fitness/routines`);
            if (!response.ok) throw new Error("Failed to fetch fitness routines");
            return response.json();
        },
        createRoutine: async (routine: Omit<FitnessRoutine, "id" | "createdAt">): Promise<FitnessRoutine> => {
            const response = await fetch(`${API_URL}/fitness/routines`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(routine),
            });
            if (!response.ok) throw new Error("Failed to create fitness routine");
            return response.json();
        },
        deleteRoutine: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/fitness/routines/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete fitness routine");
        },
    },
    deviations: {
        getAll: async (): Promise<Deviation[]> => {
            const response = await fetch(`${API_URL}/deviations`);
            if (!response.ok) throw new Error("Failed to fetch deviations");
            return response.json();
        },
        create: async (deviation: Omit<Deviation, "id" | "createdAt">): Promise<Deviation> => {
            const response = await fetch(`${API_URL}/deviations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deviation),
            });
            if (!response.ok) throw new Error("Failed to create deviation");
            return response.json();
        },
        update: async (id: string, updates: Partial<Deviation>): Promise<Deviation> => {
            const response = await fetch(`${API_URL}/deviations/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update deviation");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/deviations/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete deviation");
        },
    },
    resources: {
        getAll: async (): Promise<Resource[]> => {
            const response = await fetch(`${API_URL}/resources`);
            if (!response.ok) throw new Error("Failed to fetch resources");
            return response.json();
        },
        create: async (resource: Omit<Resource, "id">): Promise<Resource> => {
            const response = await fetch(`${API_URL}/resources`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resource),
            });
            if (!response.ok) throw new Error("Failed to create resource");
            return response.json();
        },
        update: async (id: string, updates: Partial<Resource>): Promise<Resource> => {
            const response = await fetch(`${API_URL}/resources/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update resource");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/resources/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete resource");
        },
    },
    noteFolders: {
        getAll: async (): Promise<NoteFolder[]> => {
            const response = await fetch(`${API_URL}/notes/folders`);
            if (!response.ok) throw new Error("Failed to fetch folders");
            return response.json();
        },
        create: async (folder: Omit<NoteFolder, "id" | "createdAt" | "updatedAt">): Promise<NoteFolder> => {
            const response = await fetch(`${API_URL}/notes/folders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(folder),
            });
            if (!response.ok) throw new Error("Failed to create folder");
            return response.json();
        },
        update: async (id: string, updates: Partial<NoteFolder>): Promise<NoteFolder> => {
            const response = await fetch(`${API_URL}/notes/folders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update folder");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/notes/folders/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete folder");
        },
    },
    notes: {
        getAll: async (): Promise<Note[]> => {
            const response = await fetch(`${API_URL}/notes`);
            if (!response.ok) throw new Error("Failed to fetch notes");
            return response.json();
        },
        create: async (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> => {
            const response = await fetch(`${API_URL}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note),
            });
            if (!response.ok) throw new Error("Failed to create note");
            return response.json();
        },
        update: async (id: string, updates: Partial<Note>): Promise<Note> => {
            const response = await fetch(`${API_URL}/notes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update note");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/notes/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete note");
        },
    },
    calendar: {
        getAll: async (): Promise<CalendarEvent[]> => {
            const response = await fetch(`${API_URL}/calendar`);
            if (!response.ok) throw new Error("Failed to fetch calendar events");
            return response.json();
        },
        create: async (event: Omit<CalendarEvent, "id" | "createdAt">): Promise<CalendarEvent> => {
            const response = await fetch(`${API_URL}/calendar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(event),
            });
            if (!response.ok) throw new Error("Failed to create calendar event");
            return response.json();
        },
        update: async (id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> => {
            const response = await fetch(`${API_URL}/calendar/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error("Failed to update calendar event");
            return response.json();
        },
        delete: async (id: string): Promise<void> => {
            const response = await fetch(`${API_URL}/calendar/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete calendar event");
        },
    }
};
