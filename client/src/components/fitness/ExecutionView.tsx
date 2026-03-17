import { useState, useMemo } from "react";
import { Check, Play, Save, X, Dumbbell, ArrowRight } from "lucide-react";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ExecutionViewProps {
    onClose: () => void;
}

export function ExecutionView({ onClose }: ExecutionViewProps) {
    const { state, addFitnessActivity } = useLifeOSContext();
    const activeBlock = useMemo(() => state.trainingBlocks.find(b => b.isActive), [state.trainingBlocks]);

    // Current week logic (simplified: use week 1 or calculate based on date)
    const currentWeek = 1; 

    const [selectedRoutine, setSelectedRoutine] = useState<any>(activeBlock?.routines[0] || null);
    const [performance, setPerformance] = useState<any[]>([]);

    const handleStart = (routine: any) => {
        setSelectedRoutine(routine);
        const initPerf = routine.exercises.map((ex: any) => {
            const target = ex.weeklyTargets.find((t: any) => t.week === currentWeek) || ex.weeklyTargets[0];
            const exerciseInfo = state.exercises.find(e => e.id === ex.exerciseId);
            return {
                exerciseId: ex.exerciseId,
                exerciseName: exerciseInfo?.name || "Desconocido",
                setsDone: Array.from({ length: target.sets }).map(() => ({
                    reps: Number(target.reps) || 0,
                    weight: target.weight || 0,
                    completed: false
                }))
            };
        });
        setPerformance(initPerf);
    };

    const toggleSet = (exIdx: number, setIdx: number) => {
        const newPerf = [...performance];
        newPerf[exIdx].setsDone[setIdx].completed = !newPerf[exIdx].setsDone[setIdx].completed;
        setPerformance(newPerf);
    };

    const updateSet = (exIdx: number, setIdx: number, field: string, value: number) => {
        const newPerf = [...performance];
        newPerf[exIdx].setsDone[setIdx][field] = value;
        setPerformance(newPerf);
    };

    const handleFinish = () => {
        if (!selectedRoutine) return;

        addFitnessActivity({
            type: "workout" as any,
            name: `Entrenamiento: ${selectedRoutine.routineName}`,
            date: format(new Date(), "yyyy-MM-dd"),
            performanceSnapshot: performance,
            notes: `Bloque: ${activeBlock?.name}\nSemana: ${currentWeek}`,
        });
        onClose();
    };

    if (!activeBlock) {
        return (
            <div className="p-8 text-center space-y-4">
                <Dumbbell className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-muted-foreground">No hay un bloque de entrenamiento activo.</p>
                <Button variant="outline" onClick={onClose}>Volver</Button>
            </div>
        );
    }

    if (!selectedRoutine) {
        return (
            <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Seleccionar Rutina de Hoy</h3>
                <div className="grid gap-3">
                    {activeBlock.routines.map((r, i) => (
                        <Button key={i} variant="outline" className="h-16 justify-between text-lg" onClick={() => handleStart(r)}>
                            {r.routineName}
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">{selectedRoutine.routineName}</h3>
                    <p className="text-sm text-muted-foreground">{activeBlock.name} - Semana {currentWeek}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
            </div>

            <div className="space-y-6">
                {performance.map((ex, exIdx) => (
                    <div key={exIdx} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-primary">{ex.exerciseName}</h4>
                            <Badge variant="outline">{ex.setsDone.length} Series</Badge>
                        </div>
                        <div className="grid gap-2">
                            {ex.setsDone.map((set: any, sIdx: number) => (
                                <div key={sIdx} className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                                    set.completed ? "bg-primary/5 border-primary/30" : "bg-muted/30 border-transparent"
                                )}>
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                        {sIdx + 1}
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                className="h-8 w-16 text-center"
                                                value={set.reps}
                                                onChange={e => updateSet(exIdx, sIdx, 'reps', Number(e.target.value))}
                                            />
                                            <span className="text-xs text-muted-foreground">reps</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                className="h-8 w-16 text-center"
                                                value={set.weight}
                                                onChange={e => updateSet(exIdx, sIdx, 'weight', Number(e.target.value))}
                                            />
                                            <span className="text-xs text-muted-foreground">kg</span>
                                        </div>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant={set.completed ? "default" : "outline"}
                                        className="h-8 w-8 rounded-lg"
                                        onClick={() => toggleSet(exIdx, sIdx)}
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Button className="w-full h-12 text-lg font-bold gap-2" onClick={handleFinish}>
                <Save className="w-5 h-5" /> Finalizar Entrenamiento
            </Button>
        </div>
    );
}
