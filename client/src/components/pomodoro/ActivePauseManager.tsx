import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { ActivePauseRoutine } from "@/types/lifeOS";
import { Plus, Trash2, Edit2, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivePauseManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ActivePauseManager({ open, onOpenChange }: ActivePauseManagerProps) {
    const { state, addActivePauseRoutine, updateActivePauseRoutine, deleteActivePauseRoutine } = useLifeOSContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [nombre, setNombre] = useState("");
    const [duracion, setDuracion] = useState("");
    const [pasos, setPasos] = useState("");
    const [nivel, setNivel] = useState<"principiante" | "intermedio" | "avanzado">("principiante");
    const [zona, setZona] = useState("");

    const resetForm = () => {
        setNombre("");
        setDuracion("");
        setPasos("");
        setNivel("principiante");
        setZona("");
        setIsEditing(false);
        setEditingId(null);
    };

    const handleEdit = (routine: ActivePauseRoutine) => {
        setNombre(routine.nombre);
        setDuracion(routine.duracion);
        setPasos(routine.pasos.join("\n"));
        setNivel(routine.nivel);
        setZona(routine.zona.join(", "));
        setEditingId(routine.id);
        setIsEditing(true);
    };

    const handleSave = () => {
        const routineData = {
            nombre,
            duracion,
            pasos: pasos.split("\n").filter(p => p.trim() !== ""),
            nivel,
            zona: zona.split(",").map(z => z.trim()).filter(z => z !== "")
        };

        if (editingId) {
            updateActivePauseRoutine(editingId, routineData);
        } else {
            addActivePauseRoutine(routineData);
        }
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Eliminar esta rutina?")) {
            deleteActivePauseRoutine(id);
        }
    };

    // Add default routines if empty (One time action potentially, or managed by a separate 'Restore Defaults' button)
    const loadDefaults = () => {
        const defaults = [
            {
                nombre: "Cuello básico",
                duracion: "45s",
                pasos: ["Oreja a hombro derecho 20s", "Oreja a hombro izquierdo 20s", "Mentón al pecho suave 5s"],
                nivel: "principiante" as const,
                zona: ["cuello"]
            },
            {
                nombre: "Hombros y piernas",
                duracion: "50s",
                pasos: ["Círculos hombros 10x adelante", "Círculos hombros 10x atrás", "Eleva pierna derecha 10s", "Eleva pierna izquierda 10s"],
                nivel: "principiante" as const,
                zona: ["hombros", "piernas"]
            },
            {
                nombre: "Piernas y core",
                duracion: "60s",
                pasos: ["Caminata en sitio rápido 30s", "Puntillas (sube/baja talones) 15 rep", "Eleva rodillas alternas 15s"],
                nivel: "principiante" as const,
                zona: ["piernas", "core"]
            },
            {
                nombre: "Espalda superior",
                duracion: "45s",
                pasos: ["Apertura pecho (manos atrás) 20s", "Torsión tronco derecha 10s", "Torsión tronco izquierda 10s"],
                nivel: "principiante" as const,
                zona: ["espalda"]
            },
            {
                nombre: "Mixto completo",
                duracion: "55s",
                pasos: ["Rotaciones brazos grandes 10x", "Eleva rodillas 20s", "Amasa trapecios con manos 15s"],
                nivel: "intermedio" as const,
                zona: ["brazos", "piernas", "cuello"]
            },
            {
                nombre: "Relajación cervical",
                duracion: "50s",
                pasos: ["Respiración profunda 10s", "Cabeza atrás suave 15s", "Amasa trapecios 25s cada lado"],
                nivel: "principiante" as const,
                zona: ["cuello", "respiracion"]
            },
            {
                nombre: "Activación glúteos",
                duracion: "50s",
                pasos: ["Puente glúteos sentado 15 rep", "Sentadillas parciales 10 rep", "Contracción glúteos 20s"],
                nivel: "intermedio" as const,
                zona: ["gluteos", "piernas"]
            },
            {
                nombre: "Brazos y postura",
                duracion: "45s",
                pasos: ["Brazos en cruz pecho 20s", "Elevación brazos arriba 10 rep", "Hombros arriba/abajo 15 rep"],
                nivel: "principiante" as const,
                zona: ["brazos", "hombros"]
            }
        ];

        defaults.forEach(d => {
            // Check for existence by name to avoid duplicates
            if (!state.activePauseRoutines.some(r => r.nombre === d.nombre)) {
                addActivePauseRoutine(d);
            }
        });
    };


    return (
        <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if (!val) resetForm(); }}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Gestor de Rutinas de Pausa Activa</DialogTitle>
                    <DialogDescription>Crea y gestiona tus micro-rutinas para los descansos.</DialogDescription>
                </DialogHeader>

                <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
                    {/* List */}
                    <div className="w-1/2 flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-sm text-muted-foreground">Mis Rutinas ({state.activePauseRoutines.length})</h3>
                            {state.activePauseRoutines.length === 0 && (
                                <Button variant="outline" size="sm" onClick={loadDefaults}>Cargar Defaults</Button>
                            )}
                        </div>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-3">
                                {state.activePauseRoutines.map(routine => (
                                    <Card key={routine.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleEdit(routine)}>
                                        <CardHeader className="p-3 pb-0">
                                            <div className="flex justify-between">
                                                <CardTitle className="text-base">{routine.nombre}</CardTitle>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(routine.id); }}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
                                            <p>{routine.duracion} • {routine.nivel}</p>
                                            <p className="mt-1 line-clamp-2">{routine.pasos.join(", ")}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Form */}
                    <div className="w-1/2 border-l pl-6 overflow-y-auto">
                        <h3 className="font-medium mb-4">{isEditing ? "Editar Rutina" : "Nueva Rutina"}</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nombre</Label>
                                <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Estiramiento cuello" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Duración</Label>
                                    <Input value={duracion} onChange={e => setDuracion(e.target.value)} placeholder="Ej: 5 min" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nivel</Label>
                                    <Select value={nivel} onValueChange={(v: any) => setNivel(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="principiante">Principiante</SelectItem>
                                            <SelectItem value="intermedio">Intermedio</SelectItem>
                                            <SelectItem value="avanzado">Avanzado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Zona (separada por comas)</Label>
                                <Input value={zona} onChange={e => setZona(e.target.value)} placeholder="Ej: Cuello, Espalda" />
                            </div>

                            <div className="space-y-2">
                                <Label>Pasos (uno por línea)</Label>
                                <Textarea
                                    value={pasos}
                                    onChange={e => setPasos(e.target.value)}
                                    placeholder="1. Girar cabeza..."
                                    className="min-h-[150px]"
                                />
                            </div>

                            <div className="pt-2 flex gap-2 justify-end">
                                {isEditing && <Button variant="ghost" onClick={resetForm}>Cancelar</Button>}
                                <Button onClick={handleSave} disabled={!nombre}>Guardar</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
