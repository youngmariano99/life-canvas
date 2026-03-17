import { useState } from "react";
import { Plus, Search, Dumbbell, Flame, Sparkles, Trash2, Edit2, Check, X } from "lucide-react";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function ExerciseCatalog() {
    const { state, addExercise, updateExercise, deleteExercise } = useLifeOSContext();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [newExercise, setNewExercise] = useState<{
        name: string;
        category: 'Fuerza' | 'Cardio' | 'Flexibilidad';
    }>({
        name: "",
        category: "Fuerza"
    });

    const filteredExercises = state.exercises.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        if (!newExercise.name.trim()) return;
        addExercise(newExercise);
        setNewExercise({ name: "", category: "Fuerza" });
        setIsAdding(false);
    };

    const handleUpdate = (id: string, updates: any) => {
        updateExercise(id, updates);
        setEditingId(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar ejercicio..."
                        className="pl-9 h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Dialog open={isAdding} onOpenChange={setIsAdding}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 h-10 px-4">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Nuevo Ejercicio</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Agregar al Catálogo</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre</label>
                                <Input
                                    placeholder="Ej: Press de Banca, Dominadas..."
                                    value={newExercise.name}
                                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoría</label>
                                <Select
                                    value={newExercise.category}
                                    onValueChange={(v: any) => setNewExercise(prev => ({ ...prev, category: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fuerza">💪 Fuerza</SelectItem>
                                        <SelectItem value="Cardio">🏃 Cardio</SelectItem>
                                        <SelectItem value="Flexibilidad">🧘 Flexibilidad</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full" onClick={handleAdd} disabled={!newExercise.name.trim()}>
                                Guardar en Catálogo
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredExercises.map(exercise => (
                    <Card key={exercise.id} className="group hover:border-primary/50 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                    exercise.category === 'Fuerza' ? "bg-role-athlete/10 text-role-athlete" :
                                    exercise.category === 'Cardio' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                                )}>
                                    {exercise.category === 'Fuerza' ? <Dumbbell className="w-5 h-5" /> :
                                     exercise.category === 'Cardio' ? <Flame className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{exercise.name}</p>
                                    <p className="text-xs text-muted-foreground">{exercise.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => deleteExercise(exercise.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredExercises.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/30">
                    <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-muted-foreground">No se encontraron ejercicios</p>
                    <Button
                        variant="link"
                        onClick={() => setIsAdding(true)}
                        className="text-primary mt-2"
                    >
                        Agregar el primero
                    </Button>
                </div>
            )}
        </div>
    );
}
