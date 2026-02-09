
import { Home, Calendar, Dumbbell, FileText, Menu, Settings, RotateCcw, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewType, VIEWS } from "./Dashboard";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Separator } from "@/components/ui/separator";
import { YearSelector } from "./YearSelector";

interface MobileNavProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

export function MobileNav({ currentView, onViewChange }: MobileNavProps) {
    const { startEditingWizard, resetAll } = useLifeOSContext();

    const mainItems = [
        { id: "daily", label: "Hoy", icon: Home }, // Changed Target to Home for "Daily/Exec" feel
        { id: "weekly", label: "Semanal", icon: Calendar },
        { id: "fitness", label: "Fitness", icon: Dumbbell },
        { id: "notes", label: "Notas", icon: FileText },
    ];

    const secondaryViewIds = ["identity", "semester", "deviations"];
    const secondaryViews = VIEWS.filter(v => secondaryViewIds.includes(v.id));

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {/* Main Tabs */}
                {mainItems.map((item) => {
                    const isActive = currentView === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id as ViewType)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}

                {/* More Menu Drawer */}
                <Drawer>
                    <DrawerTrigger asChild>
                        <button
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-muted-foreground hover:text-foreground",
                                secondaryViewIds.includes(currentView) && "text-primary"
                            )}
                        >
                            <Menu className="w-5 h-5" />
                            <span className="text-[10px] font-medium">Menú</span>
                        </button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>Menú Principal</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4 space-y-4">
                                {/* Secondary Navigation */}
                                <div className="grid grid-cols-2 gap-3">
                                    {secondaryViews.map((view) => {
                                        const Icon = view.icon;
                                        const isActive = currentView === view.id;
                                        return (
                                            <button
                                                key={view.id}
                                                onClick={() => onViewChange(view.id)}
                                                className={cn(
                                                    "flex flex-col items-center p-4 rounded-xl border transition-all",
                                                    isActive
                                                        ? "bg-primary/10 border-primary text-primary"
                                                        : "bg-card border-border hover:bg-muted"
                                                )}
                                            >
                                                <Icon className="w-6 h-6 mb-2" />
                                                <span className="text-sm font-medium">{view.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>

                                <Separator />

                                {/* Actions */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <span className="text-sm font-medium">Año</span>
                                        <YearSelector />
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <span className="text-sm font-medium">Tema</span>
                                        <ThemeToggle />
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 h-12"
                                        onClick={() => startEditingWizard()}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Configurar Planificación
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        className="w-full justify-start gap-2 h-12"
                                        onClick={() => {
                                            if (confirm("¿Estás seguro de reiniciar todo?")) resetAll();
                                        }}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Reiniciar Todo
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-2 h-12 text-muted-foreground hover:text-foreground"
                                        onClick={() => {
                                            if (confirm("¿Cerrar sesión?")) {
                                                localStorage.removeItem('token');
                                                window.location.reload();
                                            }
                                        }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
}
