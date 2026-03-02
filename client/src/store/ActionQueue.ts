import localforage from "localforage";
import { api } from "@/lib/api";

const QUEUE_KEY = "life-os-action-queue";

export interface QueuedAction {
    id: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    payload?: any;
    timestamp: string;
}

// Configurar store separado para la cola
const queueStore = localforage.createInstance({
    name: "LifeOS",
    storeName: "action_queue"
});

class ActionQueueManager {
    private isSyncing = false;

    async getQueue(): Promise<QueuedAction[]> {
        const queue = await queueStore.getItem<QueuedAction[]>(QUEUE_KEY);
        return queue || [];
    }

    async enqueue(action: Omit<QueuedAction, "id" | "timestamp">) {
        const queue = await this.getQueue();
        const newAction: QueuedAction = {
            ...action,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString()
        };

        queue.push(newAction);
        await queueStore.setItem(QUEUE_KEY, queue);

        // Si estamos online, intentar sincronizar ahora
        if (navigator.onLine) {
            this.sync();
        }
    }

    async sync() {
        if (this.isSyncing || !navigator.onLine) return;

        const queue = await this.getQueue();
        if (queue.length === 0) return;

        this.isSyncing = true;
        const remainingQueue = [...queue];

        try {
            for (const action of queue) {
                try {
                    // Re-intentar la peticion bloqueada
                    try {
                        const token = localStorage.getItem('token');
                        const headers = {
                            "Content-Type": "application/json",
                            ...(token ? { "Authorization": `Bearer ${token}` } : {})
                        };

                        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api"}${action.endpoint}`, {
                            method: action.method,
                            headers,
                            body: action.payload ? JSON.stringify(action.payload) : undefined
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.message || `Request failed with status ${response.status}`);
                        }

                        // Si fue exitosa, la sacamos de la cola
                        remainingQueue.shift();
                    } catch (error: any) {
                        // Si el error sigue siendo de red, frenamos la sincronizacion y mantenemos la cola
                        if (!error.response) {
                            console.warn("Sync paused: Device is offline again.");
                            break;
                        }
                        // Si el error es de negocio (400, 500), debemos decartar la accion para no trabar la cola
                        console.error("Action in queue failed permanently:", action, error);
                        remainingQueue.shift();
                    }
                } catch (error: any) {
                    // Si el error sigue siendo de red, frenamos la sincronizacion y mantenemos la cola
                    if (!error.response) {
                        console.warn("Sync paused: Device is offline again.");
                        break;
                    }
                    // Si el error es de negocio (400, 500), debemos decartar la accion para no trabar la cola
                    console.error("Action in queue failed permanently:", action, error);
                    remainingQueue.shift();
                }
            }
        } finally {
            // Guardar el estado restante de la cola
            await queueStore.setItem(QUEUE_KEY, remainingQueue);
            this.isSyncing = false;
        }
    }

    async clearQueue() {
        await queueStore.removeItem(QUEUE_KEY);
    }
}

export const actionQueue = new ActionQueueManager();
