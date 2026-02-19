import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { ActivePauseRoutine } from "@/types/lifeOS";
import { Check, X, RefreshCw, Volume2, Eye, GlassWater, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivePauseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: () => void;
    onSkip: () => void;
}

export function ActivePauseModal({ open, onOpenChange, onComplete, onSkip }: ActivePauseModalProps) {
    const { state, logActivePause } = useLifeOSContext();
    const [currentRoutine, setCurrentRoutine] = useState<ActivePauseRoutine | null>(null);
    const [stepIndex, setStepIndex] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    // Checklist states
    const [waterChecked, setWaterChecked] = useState(false);
    const [eyesChecked, setEyesChecked] = useState(false);
    const [routineCompleted, setRoutineCompleted] = useState(false);

    useEffect(() => {
        if (open && !currentRoutine) {
            selectRandomRoutine();
            setWaterChecked(false);
            setEyesChecked(false);
            setRoutineCompleted(false);
            setIsStarted(false);
        }
    }, [open]);

    const selectRandomRoutine = () => {
        if (state.activePauseRoutines.length === 0) return;

        // Filter routines not recently seen if possible (simple random for now)
        const randomIndex = Math.floor(Math.random() * state.activePauseRoutines.length);
        setCurrentRoutine(state.activePauseRoutines[randomIndex]);
        setStepIndex(0);
    };

    const handleFinish = () => {
        if (currentRoutine) {
            logActivePause({
                date: new Date().toISOString(),
                routineId: currentRoutine.id,
                completed: routineCompleted,
                waterIntake: waterChecked,
                eyeCare: eyesChecked
            });
        }
        onComplete();
    };

    if (!currentRoutine && state.activePauseRoutines.length > 0) {
        return null; // or loading
    }

    if (state.activePauseRoutines.length === 0) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pausa Activa</DialogTitle>
                        <DialogDescription>No hay rutinas configuradas. Agrega algunas en la configuración.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={onSkip}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-primary" />
                        Pausa Activa
                    </DialogTitle>
                    <DialogDescription>
                        Tómate 5 minutos para recargar energía.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Checklist */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setWaterChecked(!waterChecked)}
                            className={cn(
                                "p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                waterChecked ? "border-blue-500 bg-blue-500/10 text-blue-500" : "border-muted hover:border-blue-200"
                            )}
                        >
                            <GlassWater className="w-6 h-6" />
                            <span className="text-sm font-medium">Beber Agua</span>
                            {waterChecked && <Check className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setEyesChecked(!eyesChecked)}
                            className={cn(
                                "p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
                                eyesChecked ? "border-green-500 bg-green-500/10 text-green-500" : "border-muted hover:border-green-200"
                            )}
                        >
                            <Eye className="w-6 h-6" />
                            <span className="text-sm font-medium">Vista 20-20-20</span>
                            {eyesChecked && <Check className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Routine Card */}
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-lg">{currentRoutine?.nombre}</h3>
                                <p className="text-sm text-muted-foreground">{currentRoutine?.duracion} • {currentRoutine?.nivel}</p>
                            </div>
                            <div className="flex gap-1">
                                {currentRoutine?.zona.map(z => (
                                    <span key={z} className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground uppercase">
                                        {z}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {!isStarted ? (
                            <div className="text-center py-4">
                                <Button className="w-full" onClick={() => setIsStarted(true)}>
                                    Comenzar Rutina
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <ul className="space-y-2">
                                    {currentRoutine?.pasos.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                                                {idx + 1}
                                            </div>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={routineCompleted ? "default" : "secondary"}
                                    className={cn("w-full mt-2", routineCompleted && "bg-green-600 hover:bg-green-700")}
                                    onClick={() => setRoutineCompleted(!routineCompleted)}
                                >
                                    {routineCompleted ? "Rutina Completada" : "Marcar como Completada"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="ghost" onClick={onSkip} className="w-full sm:w-auto">
                        Saltar
                    </Button>
                    <Button onClick={handleFinish} className="w-full sm:w-auto">
                        Guardar y Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
