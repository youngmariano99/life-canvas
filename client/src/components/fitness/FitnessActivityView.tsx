import { useState, useEffect } from "react";
import { Activity, Dumbbell, Footprints, Trash2, Save, Calendar, Clock, Flame } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { FitnessActivity } from "@/types/lifeOS";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FitnessActivityViewProps {
    activity: FitnessActivity | null;
    onClose: () => void;
}

export function FitnessActivityView({ activity, onClose }: FitnessActivityViewProps) {
    const { updateFitnessActivity, deleteFitnessActivity } = useLifeOSContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedActivity, setEditedActivity] = useState<Partial<FitnessActivity>>({});

    useEffect(() => {
        if (activity) {
            setEditedActivity({
                name: activity.name,
                duration: activity.duration,
                calories: activity.calories,
                distance: activity.distance,
                notes: activity.notes,
            });
            setIsEditing(false);
        }
    }, [activity]);

    if (!activity) return null;

    const handleSave = async () => {
        if (!editedActivity.name?.trim()) return;

        await updateFitnessActivity(activity.id, {
            ...editedActivity,
            // Ensure numbers are numbers
            duration: editedActivity.duration ? Number(editedActivity.duration) : undefined,
            calories: editedActivity.calories ? Number(editedActivity.calories) : undefined,
            distance: editedActivity.distance ? Number(editedActivity.distance) : undefined,
        });
        setIsEditing(false);
        onClose();
    };

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar esta actividad?")) {
            await deleteFitnessActivity(activity.id);
            onClose();
        }
    };

    return (
        <Dialog open={!!activity} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {activity.type === "workout" ? (
                            <Dumbbell className="w-5 h-5 text-role-athlete" />
                        ) : (
                            <Footprints className="w-5 h-5 text-accent" />
                        )}
                        {isEditing ? "Editar Actividad" : activity.name}
                    </DialogTitle>
                    {!isEditing && (
                        <p className="text-sm text-muted-foreground capitalize">
                            {format(new Date(activity.date), "EEEE d 'de' MMMM", { locale: es })}
                        </p>
                    )}
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {isEditing ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre</label>
                                <Input
                                    value={editedActivity.name || ""}
                                    onChange={(e) => setEditedActivity(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Duración (min)</label>
                                    <Input
                                        type="number"
                                        value={editedActivity.duration || ""}
                                        onChange={(e) => setEditedActivity(prev => ({ ...prev, duration: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Calorías (kcal)</label>
                                    <Input
                                        type="number"
                                        value={editedActivity.calories || ""}
                                        onChange={(e) => setEditedActivity(prev => ({ ...prev, calories: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Distancia ({activity.type === 'neat' ? 'pasos' : 'km'})</label>
                                <Input
                                    type="number"
                                    value={editedActivity.distance || ""}
                                    onChange={(e) => setEditedActivity(prev => ({ ...prev, distance: Number(e.target.value) }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notas / Detalles</label>
                                <Textarea
                                    value={editedActivity.notes || ""}
                                    onChange={(e) => setEditedActivity(prev => ({ ...prev, notes: e.target.value }))}
                                    className="h-32"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-muted/30 p-2 rounded-lg">
                                    <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                    <span className="text-lg font-semibold">{activity.duration || 0}</span>
                                    <p className="text-xs text-muted-foreground">min</p>
                                </div>
                                <div className="bg-muted/30 p-2 rounded-lg">
                                    <Flame className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                    <span className="text-lg font-semibold">{activity.calories || 0}</span>
                                    <p className="text-xs text-muted-foreground">kcal</p>
                                </div>
                                <div className="bg-muted/30 p-2 rounded-lg">
                                    {activity.type === 'neat' ? <Footprints className="w-4 h-4 mx-auto mb-1 text-muted-foreground" /> : <Activity className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />}
                                    <span className="text-lg font-semibold">{activity.distance || 0}</span>
                                    <p className="text-xs text-muted-foreground">{activity.type === 'neat' ? 'pasos' : 'km'}</p>
                                </div>
                            </div>

                            {activity.performanceSnapshot && (
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                                        <Dumbbell className="w-4 h-4" />
                                        Rendimiento Detallado
                                    </h4>
                                    <div className="grid gap-3">
                                        {activity.performanceSnapshot.map((ex, i) => (
                                            <div key={i} className="bg-muted/30 rounded-xl p-3 space-y-2">
                                                <p className="text-sm font-bold">{ex.exerciseName}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {ex.setsDone.map((set, si) => (
                                                        <div key={si} className={cn(
                                                            "text-[10px] px-2 py-1 rounded bg-background border",
                                                            set.completed ? "border-primary/50" : "opacity-50"
                                                        )}>
                                                            <span className="font-bold">{set.weight}kg</span> x {set.reps}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activity.notes && !activity.performanceSnapshot && (
                                <div className="bg-muted/20 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono">
                                    {activity.notes}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DialogFooter className="flex gap-2 sm:justify-between">
                    {isEditing ? (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="destructive" size="icon" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => onClose()}>
                                    Cerrar
                                </Button>
                                <Button onClick={() => setIsEditing(true)}>
                                    Editar
                                </Button>
                            </div>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
