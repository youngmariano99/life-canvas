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

                    <div className="space-y-1 mt-1">
                        {routine.content.slice(0, 3).map((item: any, i: number) => {
                            let text = "";
                            if (typeof item === 'string') text = item;
                            else if (item.name) text = item.name + (item.sets ? ` (${item.sets}x${item.reps})` : '') + (item.target ? ` (${item.target})` : '');
                            else if (item.work) text = `${item.sets}x ${item.work}/${item.rest}`;
                            else if (item.targetTime) text = `Tiempo: ${item.targetTime}`;
                            else if (item.targetDistance) text = `Distancia: ${item.targetDistance}`;

                            return <p key={i} className="text-xs text-muted-foreground truncate">• {text}</p>
                        })}
                        {routine.content.length > 3 && (
                            <p className="text-[10px] text-muted-foreground italic pl-1">
                                +{routine.content.length - 3} más...
                            </p>
                        )}
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
