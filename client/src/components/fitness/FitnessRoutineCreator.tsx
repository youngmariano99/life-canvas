import { useState } from "react";
import { Plus, Save, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLifeOSContext } from "@/context/LifeOSContext";

export function FitnessRoutineCreator() {
    const { addFitnessRoutine } = useLifeOSContext();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState<"strength" | "cardio" | "hybrid">("strength");
    const [structureType, setStructureType] = useState<string>("sets_reps");

    // Dynamic Content State
    const [rounds, setRounds] = useState("");
    const [items, setItems] = useState<any[]>([{ id: Date.now() }]);

    const addItem = () => {
        setItems([...items, { id: Date.now() }]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: number, field: string, value: string) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const handleSave = () => {
        if (!name.trim()) return;

        // Filter empty items based on structure type
        const cleanContent = items.map(({ id, ...rest }) => rest).filter(item => {
            if (structureType === 'sets_reps') return item.name;
            if (structureType === 'rounds') return item.name;
            if (structureType === 'intervals') return item.sets && item.work; // Minimal requirement
            if (structureType === 'time' || structureType === 'distance') return item.targetTime || item.targetDistance;
            return true;
        });

        addFitnessRoutine({
            name: name.trim(),
            type,
            structureType: structureType as any,
            rounds: structureType === 'rounds' ? rounds : undefined,
            content: cleanContent
        });

        setIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setRounds("");
        setItems([{ id: Date.now() }]);
    };

    // Render different inputs based on structure type
    const renderInputs = (item: any, index: number) => {
        switch (structureType) {
            case "sets_reps":
                return (
                    <>
                        <Input
                            placeholder="Ejercicio (ej: Press Banca)"
                            className="flex-[2]"
                            value={item.name || ""}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        />
                        <Input
                            placeholder="Series"
                            className="w-20"
                            value={item.sets || ""}
                            onChange={(e) => updateItem(item.id, "sets", e.target.value)}
                        />
                        <Input
                            placeholder="Reps"
                            className="w-20"
                            value={item.reps || ""}
                            onChange={(e) => updateItem(item.id, "reps", e.target.value)}
                        />
                    </>
                );
            case "rounds":
                return (
                    <>
                        <Input
                            placeholder="Ejercicio (ej: Burpees)"
                            className="flex-[2]"
                            value={item.name || ""}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        />
                        <Input
                            placeholder="Meta (ej: 15 reps o 30s)"
                            className="flex-1"
                            value={item.target || ""}
                            onChange={(e) => updateItem(item.id, "target", e.target.value)}
                        />
                    </>
                );
            case "intervals":
                return (
                    <div className="grid grid-cols-4 gap-2 w-full">
                        <Input
                            placeholder="Ejercicio (opc)"
                            value={item.exercise || ""}
                            onChange={(e) => updateItem(item.id, "exercise", e.target.value)}
                        />
                        <Input
                            placeholder="Intervalos"
                            value={item.sets || ""}
                            onChange={(e) => updateItem(item.id, "sets", e.target.value)}
                        />
                        <Input
                            placeholder="Work (ej: 30s)"
                            value={item.work || ""}
                            onChange={(e) => updateItem(item.id, "work", e.target.value)}
                        />
                        <Input
                            placeholder="Rest (ej: 15s)"
                            value={item.rest || ""}
                            onChange={(e) => updateItem(item.id, "rest", e.target.value)}
                        />
                    </div>
                );
            case "time":
            case "distance":
                return (
                    <div className="grid grid-cols-2 gap-2 w-full">
                        <Input
                            placeholder="Tiempo Objetivo (ej: 45m)"
                            value={item.targetTime || ""}
                            onChange={(e) => updateItem(item.id, "targetTime", e.target.value)}
                        />
                        <Input
                            placeholder="Distancia Objetivo (ej: 5km, N/A)"
                            value={item.targetDistance || ""}
                            onChange={(e) => updateItem(item.id, "targetDistance", e.target.value)}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const isOneLiner = ["time", "distance"].includes(structureType);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Rutina
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear Rutina de Entrenamiento</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                        <div className="space-y-2">
                            <Label>Nombre de la Rutina</Label>
                            <Input
                                placeholder="Ej: Full Body A, Running 5k..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={type} onValueChange={(v: any) => setType(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="strength">Fuerza</SelectItem>
                                        <SelectItem value="cardio">Cardio</SelectItem>
                                        <SelectItem value="hybrid">Híbrido</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Estructura</Label>
                                <Select value={structureType} onValueChange={(v) => {
                                    setStructureType(v);
                                    setItems([{ id: Date.now() }]); // Reset items on structure change
                                }}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sets_reps">Series y Reps</SelectItem>
                                        <SelectItem value="rounds">Rondas / Circuito</SelectItem>
                                        <SelectItem value="intervals">Intervalos</SelectItem>
                                        <SelectItem value="time">Tiempo Fijo</SelectItem>
                                        <SelectItem value="distance">Distancia Fija</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {structureType === "rounds" && (
                            <div className="space-y-2">
                                <Label>Cantidad de Rondas (Global)</Label>
                                <Input
                                    placeholder="Ej: 4 rondas"
                                    value={rounds}
                                    onChange={(e) => setRounds(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">
                                {isOneLiner ? "Objetivos" : "Ejercicios / Bloques"}
                            </Label>
                            {!isOneLiner && (
                                <Button size="sm" variant="ghost" onClick={addItem} className="h-10 px-3 gap-1">
                                    <Plus className="w-4 h-4" /> Agregar Ítem
                                </Button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={item.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2">
                                    <div className="p-2 -ml-2 cursor-move flex-shrink-0 touch-none">
                                        <GripVertical className="w-5 h-5 text-muted-foreground/50" />
                                    </div>
                                    {renderInputs(item, index)}
                                    {!isOneLiner && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-10 w-10 text-muted-foreground hover:text-destructive flex-shrink-0"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button className="w-full" onClick={handleSave} disabled={!name.trim()}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Rutina
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
