import { useServerHealth } from "@/hooks/useServerHealth";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ServerStatusIndicator() {
    const status = useServerHealth();

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg transition-all border",
                        status === 'connected' && "bg-success/10 text-success border-success/20",
                        status === 'connecting' && "bg-warning/10 text-warning border-warning/20",
                        status === 'error' && "bg-destructive/10 text-destructive border-destructive/20"
                    )}>
                        {status === 'connected' && (
                            <>
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                Backend Online
                            </>
                        )}
                        {status === 'connecting' && (
                            <>
                                <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                                Conectando...
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <div className="w-2 h-2 rounded-full bg-destructive" />
                                Backend Offline
                            </>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {status === 'connected' && <p>Conexión estable con el servidor</p>}
                    {status === 'connecting' && <p>Intentando establecer conexión...</p>}
                    {status === 'error' && <p>Error al conectar. Verifica que el servidor esté corriendo.</p>}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
