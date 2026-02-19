
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PomodoroSettings } from "@/types/lifeOS";

interface PomodoroSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    settings: PomodoroSettings;
    onSave: (settings: Partial<PomodoroSettings>) => void;
}

export function PomodoroSettingsDialog({ open, onOpenChange, settings, onSave }: PomodoroSettingsDialogProps) {
    const [workDuration, setWorkDuration] = useState(settings.workDuration);
    const [shortBreakDuration, setShortBreakDuration] = useState(settings.shortBreakDuration);
    const [longBreakDuration, setLongBreakDuration] = useState(settings.longBreakDuration);
    const [longBreakInterval, setLongBreakInterval] = useState(settings.longBreakInterval);
    const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
    const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);

    const handleSave = () => {
        onSave({
            workDuration,
            shortBreakDuration,
            longBreakDuration,
            longBreakInterval,
            soundEnabled,
            notificationsEnabled
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Configuración de Enfoque</DialogTitle>
                    <DialogDescription>Personaliza tus tiempos de trabajo y descanso.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="work">Enfoque (min)</Label>
                            <Input
                                id="work"
                                type="number"
                                min="1"
                                value={workDuration}
                                onChange={(e) => setWorkDuration(Number(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="short">Descanso Corto</Label>
                            <Input
                                id="short"
                                type="number"
                                min="1"
                                value={shortBreakDuration}
                                onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="long">Descanso Largo</Label>
                            <Input
                                id="long"
                                type="number"
                                min="1"
                                value={longBreakDuration}
                                onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="interval">Intervalo (ciclos)</Label>
                            <Input
                                id="interval"
                                type="number"
                                min="1"
                                value={longBreakInterval}
                                onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between space-x-2 pt-2">
                        <Label htmlFor="sound">Sonidos</Label>
                        <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="notifications">Notificaciones</Label>
                        <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                    </div>

                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Guardar Cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
