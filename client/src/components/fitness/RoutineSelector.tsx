import { useState } from "react";
import { Dumbbell, PlayCircle, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { cn } from "@/lib/utils";
import { FitnessRoutine } from "@/types/lifeOS";

interface RoutineSelectorProps {
    onSelect: (routine: FitnessRoutine) => void;
}

export function RoutineSelector({ onSelect }: RoutineSelectorProps) {
    const { state, deleteFitnessRoutine } = useLifeOSContext();

    if (state.fitnessRoutines.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20">
                <Dumbbell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                    No tienes rutinas guardadas. Crea una para empezar.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1">
            {state.fitnessRoutines.map(routine => (
                <div
                    key={routine.id}
                    className="relative group flex flex-col bg-card hover:bg-accent/5 border border-border rounded-lg p-3 cursor-pointer transition-colors"
                    onClick={() => onSelect(routine)}
                >
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h4 className="font-medium text-foreground">{routine.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase",
                                    routine.type === "strength" ? "bg-indigo-500/10 text-indigo-500" :
                                        routine.type === "cardio" ? "bg-rose-500/10 text-rose-500" :
                                            "bg-purple-500/10 text-purple-500"
                                )}>
                                    {routine.type === "strength" ? "Fuerza" : routine.type === "cardio" ? "Cardio" : "Híbrido"}
                                </span>
                                <span className="text-[10px] text-muted-foreground capitalize">
                                    {routine.structureType.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                        <PlayCircle className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="space-y-1 mt-3 pt-3 border-t border-border/50">
                        {routine.content.map((item: any, i: number) => {
                            let title = "";
                            let details = "";

                            if (typeof item === 'string') {
                                title = item;
                            } else if (item.name) {
                                title = item.name;
                                details = [
                                    item.sets && item.reps ? `${item.sets}x${item.reps}` : null,
                                    item.weight ? `${item.weight}` : null,
                                    item.target ? `Obj: ${item.target}` : null
                                ].filter(Boolean).join(" • ");
                            } else if (item.work) {
                                title = "Intervalo";
                                details = `${item.sets || 1}x ${item.work}s / ${item.rest}s`;
                            } else if (item.targetTime || item.targetDistance) {
                                title = "Cardio";
                                details = [
                                    item.targetTime ? `⏱ ${item.targetTime}` : null,
                                    item.targetDistance ? `📍 ${item.targetDistance}` : null
                                ].filter(Boolean).join(" • ");
                            }

                            return (
                                <div key={i} className="flex justify-between items-center text-xs py-0.5">
                                    <span className="text-foreground/90 font-medium truncate pr-2 flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                                        {title}
                                    </span>
                                    {details && <span className="text-muted-foreground whitespace-nowrap text-[10px] font-mono bg-muted/50 px-1.5 py-0.5 rounded">{details}</span>}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('¿Eliminar esta rutina?')) deleteFitnessRoutine(routine.id);
                        }}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
