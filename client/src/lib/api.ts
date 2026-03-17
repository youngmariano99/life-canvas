/**
 * API Client for interacting with the NestJS Backend
 */
import { Role, Goal, Habit, HabitLog, Project, ProjectActivity, DailyStone, FitnessActivity, Deviation, Resource, NoteFolder, Note, CalendarEvent, FitnessRoutine, User, PomodoroSession, Exercise, TrainingBlock } from "@/types/lifeOS";
import { actionQueue } from "@/store/ActionQueue";

export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";

// Auto-Sync al volver a tener internet
if (typeof window !== "undefined") {
    window.addEventListener("online", () => {
        console.log("Back online! Syncing background queue...");
        actionQueue.sync();
    });
}

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };

    let response: Response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (networkError: any) {
        // Interceptar fallo de red puro (TypeError: Failed to fetch) en mutaciones
        const method = (options.method || "GET").toUpperCase();
        if (method !== "GET") {
            console.warn(`[Offline] Queueing ${method} ${endpoint}`);
            await actionQueue.enqueue({
                endpoint,
                method: method as any,
                payload: options.body ? JSON.parse(options.body as string) : undefined
            });
            // Fake a successful empty response to optimistic UI to continue
            return null;
        }
        throw new Error("Estás fuera de línea y esto no puede ser cacheado.");
    }

    if (!response.ok) {
        if (response.status === 401) {
            // Optional: Handle unauthorized (logout)
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch (e) {
        console.warn("Failed to parse JSON response:", text);
        return null; // Fallback to null if parsing fails
    }
};

export const api = {
    auth: {
        login: async (credentials: { email: string; password: string }): Promise<{ access_token: string, user: User }> => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) throw new Error("Login failed");
            return response.json();
        },
        register: async (data: { email: string; password: string; name: string }): Promise<{ access_token: string, user: User }> => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Registration failed");
            return response.json();
        },
        me: async (token?: string): Promise<User> => {
            // Used for initial load where we might pass the token explicitly
            const options = token ? { headers: { "Authorization": `Bearer ${token}` } } : {};
            const response = await fetch(`${API_URL}/auth/profile`, { // Using /auth/profile or /users/profile depending on backend
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                    ...(token && !options.headers?.["Authorization"] ? { "Authorization": `Bearer ${token}` } : {})
                }
            });
            if (!response.ok) throw new Error("Failed to fetch profile");
            return response.json();
        }
    },
    roles: {
        getAll: async (year?: number): Promise<Role[]> => fetchWithAuth('/roles'),
        create: async (role: Omit<Role, "id">): Promise<Role> => fetchWithAuth('/roles', { method: 'POST', body: JSON.stringify(role) }),
        update: async (id: string, updates: Partial<Role>): Promise<Role> => fetchWithAuth(`/roles/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/roles/${id}`, { method: 'DELETE' }),
    },
    goals: {
        getAll: async (year?: number): Promise<Goal[]> => fetchWithAuth(`/goals${year ? `?year=${year}` : ''}`),
        create: async (goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "resources" | "projects" | "deviations" | "user" | "role">): Promise<Goal> => fetchWithAuth('/goals', { method: 'POST', body: JSON.stringify(goal) }),
        update: async (id: string, updates: Partial<Goal>): Promise<Goal> => fetchWithAuth(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/goals/${id}`, { method: 'DELETE' }),
    },
    habits: {
        getAll: async (year?: number): Promise<Habit[]> => fetchWithAuth(`/habits${year ? `?year=${year}` : ''}`),
        create: async (habit: Omit<Habit, "id" | "createdAt" | "logs" | "deviations" | "user" | "role">): Promise<Habit> => fetchWithAuth('/habits', { method: 'POST', body: JSON.stringify(habit) }),
        update: async (id: string, updates: Partial<Habit>): Promise<Habit> => fetchWithAuth(`/habits/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/habits/${id}`, { method: 'DELETE' }),
    },
    habitLogs: {
        getAll: async (): Promise<HabitLog[]> => fetchWithAuth('/habit-logs'),
        upsert: async (log: { habitId: string; date: string; status: string; note?: string }): Promise<HabitLog> => fetchWithAuth('/habit-logs', { method: 'POST', body: JSON.stringify(log) }),
    },
    projects: {
        getAll: async (year?: number): Promise<Project[]> => fetchWithAuth(`/projects${year ? `?year=${year}` : ''}`),
        create: async (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "activities" | "goal" | "statuses">): Promise<Project> => fetchWithAuth('/projects', { method: 'POST', body: JSON.stringify(project) }),
        update: async (id: string, updates: Partial<Project>): Promise<Project> => fetchWithAuth(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/projects/${id}`, { method: 'DELETE' }),
    },
    projectActivities: {
        getAll: async (): Promise<ProjectActivity[]> => fetchWithAuth('/project-activities'),
        create: async (activity: Omit<ProjectActivity, "id" | "createdAt" | "order">): Promise<ProjectActivity> => fetchWithAuth('/project-activities', { method: 'POST', body: JSON.stringify(activity) }),
        update: async (id: string, updates: Partial<ProjectActivity>): Promise<ProjectActivity> => fetchWithAuth('/project-activities', { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/project-activities/${id}`, { method: 'DELETE' }),
    },
    dailyStones: {
        getAll: async (year?: number): Promise<DailyStone[]> => fetchWithAuth(`/daily-stones${year ? `?year=${year}` : ''}`),
        upsert: async (stone: { date: string; title: string, roleId?: string; completed?: boolean; note?: string }): Promise<DailyStone> => fetchWithAuth('/daily-stones', { method: 'POST', body: JSON.stringify(stone) }),
    },
    fitness: {
        getAll: async (): Promise<FitnessActivity[]> => fetchWithAuth('/fitness'),
        create: async (activity: Omit<FitnessActivity, "id" | "createdAt">): Promise<FitnessActivity> => fetchWithAuth('/fitness', { method: 'POST', body: JSON.stringify(activity) }),
        update: async (id: string, updates: Partial<FitnessActivity>): Promise<FitnessActivity> => fetchWithAuth(`/fitness/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/fitness/${id}`, { method: 'DELETE' }),
        // Routines
        getAllRoutines: async (): Promise<FitnessRoutine[]> => fetchWithAuth('/fitness/routines'),
        createRoutine: async (routine: Omit<FitnessRoutine, "id" | "createdAt">): Promise<FitnessRoutine> => fetchWithAuth('/fitness/routines', { method: 'POST', body: JSON.stringify(routine) }),
        deleteRoutine: async (id: string): Promise<void> => fetchWithAuth(`/fitness/routines/${id}`, { method: 'DELETE' }),
        // Exercises (Catalog)
        getAllExercises: async (): Promise<Exercise[]> => fetchWithAuth('/fitness/exercises'),
        createExercise: async (exercise: Omit<Exercise, "id" | "createdAt">): Promise<Exercise> => fetchWithAuth('/fitness/exercises', { method: 'POST', body: JSON.stringify(exercise) }),
        updateExercise: async (id: string, updates: Partial<Exercise>): Promise<Exercise> => fetchWithAuth(`/fitness/exercises/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        deleteExercise: async (id: string): Promise<void> => fetchWithAuth(`/fitness/exercises/${id}`, { method: 'DELETE' }),
        // Training Blocks
        getAllBlocks: async (): Promise<TrainingBlock[]> => fetchWithAuth('/fitness/blocks'),
        createBlock: async (block: Omit<TrainingBlock, "id" | "createdAt">): Promise<TrainingBlock> => fetchWithAuth('/fitness/blocks', { method: 'POST', body: JSON.stringify(block) }),
        updateBlock: async (id: string, updates: Partial<TrainingBlock>): Promise<TrainingBlock> => fetchWithAuth(`/fitness/blocks/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        deleteBlock: async (id: string): Promise<void> => fetchWithAuth(`/fitness/blocks/${id}`, { method: 'DELETE' }),
    },
    deviations: {
        getAll: async (year?: number): Promise<Deviation[]> => fetchWithAuth(`/deviations${year ? `?year=${year}` : ''}`),
        create: async (deviation: Omit<Deviation, "id" | "createdAt">): Promise<Deviation> => fetchWithAuth('/deviations', { method: 'POST', body: JSON.stringify(deviation) }),
        update: async (id: string, updates: Partial<Deviation>): Promise<Deviation> => fetchWithAuth(`/deviations/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/deviations/${id}`, { method: 'DELETE' }),
    },
    resources: {
        getAll: async (year?: number): Promise<Resource[]> => fetchWithAuth(`/resources${year ? `?year=${year}` : ''}`),
        create: async (resource: Omit<Resource, "id">): Promise<Resource> => fetchWithAuth('/resources', { method: 'POST', body: JSON.stringify(resource) }),
        update: async (id: string, updates: Partial<Resource>): Promise<Resource> => fetchWithAuth(`/resources/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/resources/${id}`, { method: 'DELETE' }),
    },
    noteFolders: {
        getAll: async (): Promise<NoteFolder[]> => fetchWithAuth('/notes/folders'),
        create: async (folder: Omit<NoteFolder, "id" | "createdAt" | "updatedAt">): Promise<NoteFolder> => fetchWithAuth('/notes/folders', { method: 'POST', body: JSON.stringify(folder) }),
        update: async (id: string, updates: Partial<NoteFolder>): Promise<NoteFolder> => fetchWithAuth(`/notes/folders/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/notes/folders/${id}`, { method: 'DELETE' }),
    },
    notes: {
        getAll: async (): Promise<Note[]> => fetchWithAuth('/notes'),
        create: async (note: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> => fetchWithAuth('/notes', { method: 'POST', body: JSON.stringify(note) }),
        update: async (id: string, updates: Partial<Note>): Promise<Note> => fetchWithAuth(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/notes/${id}`, { method: 'DELETE' }),
    },
    calendar: {
        getAll: async (): Promise<CalendarEvent[]> => fetchWithAuth('/calendar'),
        create: async (event: Omit<CalendarEvent, "id" | "createdAt">): Promise<CalendarEvent> => fetchWithAuth('/calendar', { method: 'POST', body: JSON.stringify(event) }),
        update: async (id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> => fetchWithAuth(`/calendar/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/calendar/${id}`, { method: 'DELETE' }),
    },
    years: {
        getSettings: async (year: number): Promise<any> => fetchWithAuth(`/years/settings?year=${year}`),
        updateSettings: async (year: number, settings: any): Promise<any> => fetchWithAuth('/years/settings', { method: 'POST', body: JSON.stringify({ year, settings }) }),
        close: async (year: number): Promise<any> => fetchWithAuth('/years/close', { method: 'POST', body: JSON.stringify({ year }) }),
    },
    pomodoro: {
        getAll: async (): Promise<PomodoroSession[]> => fetchWithAuth('/pomodoros'),
        create: async (session: Omit<PomodoroSession, "id" | "createdAt">): Promise<PomodoroSession> => fetchWithAuth('/pomodoros', { method: 'POST', body: JSON.stringify(session) }),
        delete: async (id: string): Promise<void> => fetchWithAuth(`/pomodoros/${id}`, { method: 'DELETE' }),
    }
};
