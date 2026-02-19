
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PomodoroSession, Role, Project, PomodoroMode } from "@/types/lifeOS";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SessionLogModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionData: { duration: number, mode: PomodoroMode } | null;
    onSave: (data: Partial<PomodoroSession>) => void;
    roles: Role[];
    projects: Project[];
}

export function SessionLogModal({ open, onOpenChange, sessionData, onSave, roles, projects }: SessionLogModalProps) {
    const [activityName, setActivityName] = useState("");
    const [roleId, setRoleId] = useState<string>("none");
    const [projectId, setProjectId] = useState<string>("none");
    const [notes, setNotes] = useState("");

    const handleSave = () => {
        if (!sessionData) return;

        onSave({
            duration: sessionData.duration,
            type: sessionData.mode,
            activityName,
            notes,
            roleId: roleId !== "none" ? roleId : undefined,
            projectId: projectId !== "none" ? projectId : undefined,
            startTime: new Date().toISOString(), // Should be passed from timer ideally, approximated here
            endTime: new Date().toISOString(),
        });

        // Reset
        setActivityName("");
        setNotes("");
        setRoleId("none");
        setProjectId("none");
        onOpenChange(false);
    };

    if (!sessionData) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>¡Sesión Completada!</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                        <span className="text-3xl font-bold text-primary">{sessionData.duration}</span>
                        <span className="text-sm text-muted-foreground ml-1">minutos de enfoque</span>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="activity">¿Qué hiciste?</Label>
                        <Input
                            id="activity"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            placeholder="Ej: Estudiar Matemáticas, Diseñar Logo..."
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Rol (Opcional)</Label>
                            <Select value={roleId} onValueChange={setRoleId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Ninguno</SelectItem>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Proyecto (Opcional)</Label>
                            <Select value={projectId} onValueChange={setProjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Ninguno</SelectItem>
                                    {projects.map(project => (
                                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Detalles adicionales..."
                            rows={2}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={!activityName.trim()}>
                        Guardar en Historial
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
