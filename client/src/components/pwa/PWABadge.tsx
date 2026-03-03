import { useState, useEffect } from "react";
import { CloudOff, RefreshCw, UploadCloud } from "lucide-react";
import { actionQueue } from "@/store/ActionQueue";
import { cn } from "@/lib/utils";
// Si se usa virtual PWA module de vite-plugin-pwa, se puede importar:
// import { useRegisterSW } from 'virtual:pwa-register/react'

export function PWABadge() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [pendingSync, setPendingSync] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    // const {
    //   offlineReady: [offlineReady, setOfflineReady],
    //   needRefresh: [needRefresh, setNeedRefresh],
    //   updateServiceWorker,
    // } = useRegisterSW({
    //   onRegistered(r) {
    //     console.log('SW Registered')
    //   },
    //   onRegisterError(error) {
    //     console.log('SW registration error', error)
    //   }
    // })

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            checkSyncQueue();
        };
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Initial check
        checkSyncQueue();
        // Poll queue size every 5 seconds just in case
        const interval = setInterval(checkSyncQueue, 5000);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            clearInterval(interval);
        };
    }, []);

    const checkSyncQueue = async () => {
        const queue = await actionQueue.getQueue();
        setPendingSync(queue.length);
    };

    const handleManualSync = async () => {
        setIsSyncing(true);
        await actionQueue.sync();
        await checkSyncQueue();
        setIsSyncing(false);
    };

    if (!isOffline && pendingSync === 0 /* && !needRefresh && !offlineReady */) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            {isOffline && (
                <div
                    className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-xs font-medium"
                    title="Estás navegando sin conexión. Los cambios se guardarán localmente."
                >
                    <CloudOff className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sin conexión</span>
                </div>
            )}

            {!isOffline && pendingSync > 0 && (
                <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    title="Sincronizar cambios pendientes con el servidor"
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
                        isSyncing
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20 cursor-pointer"
                    )}
                >
                    {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">
                        {isSyncing ? "Sincronizando..." : `${pendingSync} pendientes`}
                    </span>
                </button>
            )}

            {/* needRefresh && (
        <button
          onClick={() => updateServiceWorker(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-medium cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Actualizar App</span>
        </button>
      ) */}
        </div>
    );
}
