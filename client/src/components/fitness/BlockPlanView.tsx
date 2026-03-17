import { useState, useMemo } from "react";
import { Plus, Save, Calendar, Trash2, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function BlockPlanView() {
    const { state, addTrainingBlock, updateTrainingBlock, deleteTrainingBlock } = useLifeOSContext();
    const [isCreating, setIsCreating] = useState(false);

    const activeBlock = useMemo(() => state.trainingBlocks.find(b => b.isActive), [state.trainingBlocks]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Mesociclos (Bloques de Entrenamiento)
                </h3>
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nuevo Bloque
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <BlockBuilder onClose={() => setIsCreating(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* List of Blocks */}
            <div className="grid gap-4">
                {state.trainingBlocks.map(block => (
                    <Card key={block.id} className={cn(
                        "transition-all",
                        block.isActive ? "border-primary shadow-sm bg-primary/5" : "hover:border-primary/30"
                    )}>
                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-3">
                                <div>
                                    <CardTitle className="text-base truncate max-w-[200px]">{block.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{block.durationWeeks} semanas</p>
                                </div>
                                {block.isActive ? (
                                    <Badge className="bg-primary hover:bg-primary font-normal">Activo</Badge>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 text-xs"
                                        onClick={() => updateTrainingBlock(block.id, { isActive: true })}
                                    >
                                        Activar
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteTrainingBlock(block.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0">
                            <div className="flex gap-2 h-2 rounded-full bg-muted overflow-hidden">
                                {Array.from({ length: block.durationWeeks }).map((_, i) => (
                                    <div key={i} className="flex-1 bg-primary/20" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {state.trainingBlocks.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/30">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-muted-foreground">No hay bloques planificados</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function BlockBuilder({ onClose }: { onClose: () => void }) {
    const { state, addTrainingBlock } = useLifeOSContext();
    const [name, setName] = useState("");
    const [weeks, setWeeks] = useState(4);
    const [routines, setRoutines] = useState<any[]>([]);

    const handleAddRoutine = () => {
        setRoutines([...routines, { routineName: "Nueva Rutina", exercises: [] }]);
    };

    const handleAddExercise = (routineIndex: number) => {
        const newRoutines = [...routines];
        newRoutines[routineIndex].exercises.push({
            exerciseId: state.exercises[0]?.id || "",
            weeklyTargets: Array.from({ length: weeks }).map((_, i) => ({
                week: i + 1,
                sets: 3,
                reps: 10,
                weight: 0
            }))
        });
        setRoutines(newRoutines);
    };

    const handleSave = () => {
        if (!name.trim()) return;
        addTrainingBlock({
            name,
            durationWeeks: weeks,
            isActive: false,
            routines
        });
        onClose();
    };

    return (
        <div className="space-y-6 py-4">
            <DialogHeader>
                <DialogTitle>Planificador de Mesociclo</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre del Bloque</label>
                    <Input 
                        placeholder="Ej: Fuerza Base V1" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Duración (Semanas)</label>
                    <Select value={String(weeks)} onValueChange={v => setWeeks(Number(v))}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[2, 3, 4, 5, 6, 8].map(w => (
                                <SelectItem key={w} value={String(w)}>{w} semanas</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Rutinas del Bloque</h4>
                    <Button variant="outline" size="sm" onClick={handleAddRoutine}>
                        <Plus className="w-4 h-4 mr-2" /> Agregar Rutina
                    </Button>
                </div>

                {routines.map((routine, rIdx) => (
                    <div key={rIdx} className="border rounded-xl p-4 bg-muted/20 space-y-4">
                        <div className="flex items-center gap-4">
                            <Input 
                                className="font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                                value={routine.routineName}
                                onChange={e => {
                                    const newRoutines = [...routines];
                                    newRoutines[rIdx].routineName = e.target.value;
                                    setRoutines(newRoutines);
                                }}
                            />
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary h-8"
                                onClick={() => handleAddExercise(rIdx)}
                            >
                                <Plus className="w-4 h-4 mr-1" /> Ejercicio
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {routine.exercises.map((ex: any, exIdx: number) => (
                                <Card key={exIdx} className="border-muted bg-card">
                                    <div className="p-3 space-y-2">
                                        <Select 
                                            value={ex.exerciseId}
                                            onValueChange={v => {
                                                const newRoutines = [...routines];
                                                newRoutines[rIdx].exercises[exIdx].exerciseId = v;
                                                setRoutines(newRoutines);
                                            }}
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue placeholder="Seleccionar ejercicio..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {state.exercises.map(e => (
                                                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="grid grid-cols-4 gap-2">
                                            {ex.weeklyTargets.map((target: any, wIdx: number) => (
                                                <div key={wIdx} className="space-y-1 bg-muted/40 p-2 rounded-lg text-center">
                                                    <p className="text-[10px] font-bold text-muted-foreground">S{target.week}</p>
                                                    <div className="flex items-baseline justify-center gap-1">
                                                        <input 
                                                            className="w-full bg-transparent text-center focus:outline-none text-xs"
                                                            value={target.reps}
                                                            onChange={e => {
                                                                const newRoutines = [...routines];
                                                                newRoutines[rIdx].exercises[exIdx].weeklyTargets[wIdx].reps = e.target.value;
                                                                setRoutines(newRoutines);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Button className="w-full" onClick={handleSave} disabled={!name.trim() || routines.length === 0}>
                <Save className="w-4 h-4 mr-2" /> Crear Mesociclo
            </Button>
        </div>
    );
}
