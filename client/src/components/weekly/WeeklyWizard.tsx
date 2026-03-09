import { useState, useMemo } from "react";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, ListTodo, BrainCircuit, Flag, Check, CalendarDays, Inbox, Star, Flame, Clock, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval, parseISO } from "date-fns";

interface WeeklyWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const WIZARD_STEPS = [
    { id: 1, title: "Procesar Inbox", icon: Inbox, description: "Vacía tu mente" },
    { id: 2, title: "Revisión Pasada", icon: BrainCircuit, description: "Métricas y reflexión" },
    { id: 3, title: "Planificación", icon: CalendarDays, description: "Asignar tareas al Kanban" },
    { id: 4, title: "La Roca", icon: Star, description: "Foco principal de la semana" }
];

export function WeeklyWizard({ open, onOpenChange }: WeeklyWizardProps) {
    const { state, deleteNote, addProjectActivity, updateProjectActivity } = useLifeOSContext();
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(1);

    // Step 1: Inbox Processing State
    const inboxNotes = useMemo(() => state.notes.filter(n => n.tags.includes("custom-inbox")), [state.notes]);
    const [processingIndex, setProcessingIndex] = useState(0);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [activityTitle, setActivityTitle] = useState("");

    // Step 2: Metrics State
    const lastWeekStats = useMemo(() => {
        const today = new Date();
        const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });

        const habitsDone = state.habitLogs.filter(log =>
            log.status === "completed" && isWithinInterval(parseISO(log.date), { start: lastWeekStart, end: lastWeekEnd })
        ).length;

        const pomodorosDone = state.pomodoroSessions.filter(session =>
            isWithinInterval(parseISO(session.startTime), { start: lastWeekStart, end: lastWeekEnd })
        ).length;

        const timeSpent = pomodorosDone * state.pomodoroSettings.workDuration;

        return { habitsDone, pomodorosDone, timeSpent };
    }, [state.habitLogs, state.pomodoroSessions, state.pomodoroSettings]);

    // Step 3: Planning State
    const pendingActivities = useMemo(() => {
        return state.projectActivities.filter(a => a.status === "Pendiente");
    }, [state.projectActivities]);

    const handleMoveToWeek = (activityId: string) => {
        updateProjectActivity(activityId, { status: "En progreso" });
    };

    // Step 4: La Roca State
    const [rockTitle, setRockTitle] = useState("");
    const { addNote } = useLifeOSContext();

    const handleNext = () => {
        if (currentStep < 4) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const currentInboxNote = inboxNotes[processingIndex];

    const handleProcessInboxItem = async (action: "delete" | "convert" | "skip") => {
        if (!currentInboxNote) return;

        if (action === "delete") {
            await deleteNote(currentInboxNote.id);
            // Don't advance processingIndex because the array shrinks
        } else if (action === "convert") {
            if (!selectedProjectId || !activityTitle.trim()) return;
            await addProjectActivity({
                projectId: selectedProjectId,
                title: activityTitle.trim(),
                status: "Pendiente",
            });
            await deleteNote(currentInboxNote.id);
            setSelectedProjectId("");
            setActivityTitle("");
        } else if (action === "skip") {
            setProcessingIndex(prev => prev + 1);
        }
    };

    // Pre-fill activity title when note changes
    useMemo(() => {
        if (currentInboxNote) {
            setActivityTitle(currentInboxNote.content);
        }
    }, [currentInboxNote]);

    const progress = ((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] h-[85vh] sm:h-[650px] flex flex-col p-0 gap-0 overflow-hidden bg-background">

                {/* Wizard Header */}
                <div className="px-6 py-4 border-b border-border bg-card/50 flex-none">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <DialogTitle className="text-xl">Planificación Semanal</DialogTitle>
                            <DialogDescription>Prepárate para una semana productiva</DialogDescription>
                        </div>
                        <Badge variant="outline" className="font-mono">{currentStep} / 4</Badge>
                    </div>

                    <div className="relative">
                        <Progress value={progress} className="h-2" />
                        <div className="absolute top-0 left-0 w-full flex justify-between px-1 -mt-2">
                            {WIZARD_STEPS.map((step, idx) => {
                                const isCompleted = currentStep > step.id;
                                const isCurrent = currentStep === step.id;
                                const Icon = step.icon;
                                return (
                                    <div key={step.id} className="flex flex-col items-center">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-background
                      ${isCompleted ? 'border-primary text-primary' :
                                                isCurrent ? 'border-primary ring-4 ring-primary/20 text-primary' :
                                                    'border-muted text-muted-foreground'}`
                                        }>
                                            {isCompleted ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Wizard Content Body */}
                <div className="flex-1 overflow-y-auto p-6 relative bg-muted/10">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {/* ------------ STEP 1: INBOX ------------ */}
                            {currentStep === 1 && (
                                <div className="space-y-6 h-full flex flex-col">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Inbox className="w-5 h-5 text-primary" />
                                            Vaciar Bandeja de Entrada
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Procesa tus ideas capturadas. Conviértelas en tareas accionables, bórralas o déjalas para después.
                                        </p>
                                    </div>

                                    {inboxNotes.length === 0 || processingIndex >= inboxNotes.length ? (
                                        <Card className="flex-1 flex flex-col items-center justify-center border-dashed bg-transparent p-8 text-center">
                                            <CheckCircle2 className="w-16 h-16 text-success mb-4 opacity-50" />
                                            <h4 className="text-xl font-medium mb-2">¡Inbox Vacío!</h4>
                                            <p className="text-muted-foreground">No tienes ítems pendientes por procesar. Tienes la mente clara.</p>
                                        </Card>
                                    ) : (
                                        <Card className="flex-1 flex flex-col shadow-card border-primary/20">
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    <span>Ítem {processingIndex + 1} de {inboxNotes.length}</span>
                                                </div>
                                                <div className="bg-muted/50 p-4 rounded-lg flex-1 overflow-y-auto text-foreground italic whitespace-pre-wrap font-medium text-lg">
                                                    "{currentInboxNote.content}"
                                                </div>
                                            </div>

                                            <div className="p-6 border-t border-border bg-card/50 space-y-4">
                                                <div className="space-y-3">
                                                    <Label>Convertir en Actividad de Proyecto</Label>
                                                    <Input
                                                        value={activityTitle}
                                                        onChange={e => setActivityTitle(e.target.value)}
                                                        placeholder="Nombre de la acción a realizar..."
                                                    />
                                                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar Proyecto Padre..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {state.projects.map(p => (
                                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2">
                                                    <Button
                                                        variant="default"
                                                        className="flex-1"
                                                        disabled={!selectedProjectId || !activityTitle.trim()}
                                                        onClick={() => handleProcessInboxItem("convert")}
                                                    >
                                                        Asignar y Limpiar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleProcessInboxItem("skip")}
                                                        title="Dejar en el Inbox"
                                                    >
                                                        Omitir
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => handleProcessInboxItem("delete")}
                                                        title="Eliminar ítem"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* ------------ STEP 2: REVIEW ------------ */}
                            {currentStep === 2 && (
                                <div className="space-y-6 h-full flex flex-col">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <BrainCircuit className="w-5 h-5 text-primary" />
                                            Revisión de la Semana Pasada
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Analiza tu rendimiento y métricas principales de los últimos 7 días.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                        <Card className="flex flex-col items-center justify-center p-6 text-center shadow-sm">
                                            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                                                <Flame className="w-6 h-6 text-orange-500" />
                                            </div>
                                            <h4 className="text-3xl font-bold text-foreground mb-1">{lastWeekStats.habitsDone}</h4>
                                            <p className="text-sm text-muted-foreground">Hábitos Completados</p>
                                        </Card>

                                        <Card className="flex flex-col items-center justify-center p-6 text-center shadow-sm">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                                <Clock className="w-6 h-6 text-primary" />
                                            </div>
                                            <h4 className="text-3xl font-bold text-foreground mb-1">{lastWeekStats.pomodorosDone}</h4>
                                            <p className="text-sm text-muted-foreground">Sesiones de Foco ({Math.round(lastWeekStats.timeSpent / 60)} hs)</p>
                                        </Card>
                                    </div>

                                    <Card className="p-5 border-dashed bg-transparent mt-4">
                                        <h4 className="font-medium mb-2 text-sm">Reflexión Semanal</h4>
                                        <textarea
                                            className="w-full h-24 bg-card rounded-md border border-input p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-muted-foreground"
                                            placeholder="¿Qué salió bien? ¿Qué obstáculos enfrentaste? ¿Cómo mejorarás esta semana?"
                                        />
                                    </Card>
                                </div>
                            )}

                            {/* ------------ STEP 3: PLANIFICACIÓN ------------ */}
                            {currentStep === 3 && (
                                <div className="space-y-6 h-full flex flex-col">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <CalendarDays className="w-5 h-5 text-primary" />
                                            Asignar la Semana
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Mueve actividades pendientes de tus proyectos al Kanban de "En progreso" para esta semana.
                                        </p>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                        {pendingActivities.length === 0 ? (
                                            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                                No hay tareas pendientes en tus proyectos.
                                            </div>
                                        ) : (
                                            pendingActivities.map(activity => {
                                                const project = state.projects.find(p => p.id === activity.projectId);
                                                return (
                                                    <div key={activity.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between shadow-sm">
                                                        <div>
                                                            <Badge variant="outline" className="mb-2 text-[10px] bg-muted/50">{project?.name || "Proyecto"}</Badge>
                                                            <p className="font-medium text-sm text-foreground">{activity.title}</p>
                                                        </div>
                                                        <Button size="sm" onClick={() => handleMoveToWeek(activity.id)} className="shrink-0 ml-4 gap-1">
                                                            <Plus className="w-3.5 h-3.5" /> Semana
                                                        </Button>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ------------ STEP 4: LA ROCA ------------ */}
                            {currentStep === 4 && (
                                <div className="space-y-6 h-full flex flex-col">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Star className="w-5 h-5 text-primary" />
                                            Definir La Roca
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            ¿Cuál es la única cosa que, si logras esta semana, hará que estés satisfecho?
                                        </p>
                                    </div>

                                    <Card className="flex-1 flex flex-col items-center justify-center p-8 border-primary/20 bg-primary/5 shadow-inner">
                                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 shadow-sm">
                                            <Star className="w-8 h-8 text-primary" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-4">Misión Principal</h4>
                                        <Input
                                            value={rockTitle}
                                            onChange={e => setRockTitle(e.target.value)}
                                            placeholder="Ej: Terminar de refactorizar el código fuente..."
                                            className="max-w-md text-center text-lg h-12 shadow-sm border-primary/50"
                                        />
                                        <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
                                            Esto se anclará en tu dashboard. Todo lo demás es secundario hasta que La Roca esté terminada.
                                        </p>
                                    </Card>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Wizard Footer Controls */}
                <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between flex-none">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                    >
                        Atrás
                    </Button>

                    {currentStep === 4 ? (
                        <Button
                            onClick={async () => {
                                if (rockTitle.trim()) {
                                    await addNote({ content: rockTitle.trim(), tags: ["weekly-rock"], folderId: null });
                                }
                                onOpenChange(false);
                            }}
                            className="gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Finalizar Planificación
                        </Button>
                    ) : (
                        <Button onClick={handleNext} className="gap-2">
                            Siguiente Paso
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
